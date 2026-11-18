import test from 'node:test';
import assert from 'node:assert/strict';
import { zonedTimeToUtc, localTime, dualTimes, weekOf, courseTiming, addDaysToKey, TZ_ISRAEL, TZ_FRANCE } from '../shared/time.js';
import { expandRule, prepareWeekFromRules, duplicateWeek, validateCourses, isPublicCourse, publicCourse } from '../shared/programme.js';
import { whatsappWeekly, whatsappDaily, emailWeekly, emailDaily, courseToIcs, googleCalendarUrl } from '../shared/messages.js';
import { fold, matchScore, detectTeacherId, detectCategories, enrichVideo, searchAll, SEED_TEACHERS, SEED_SERIES, episodeNumber } from '../shared/catalog.js';

test('heure locale Israël -> UTC, hiver et été', () => {
  assert.equal(zonedTimeToUtc('2026-12-06', '20:30', TZ_ISRAEL).toISOString(), '2026-12-06T18:30:00.000Z'); // IST UTC+2
  assert.equal(zonedTimeToUtc('2026-07-05', '20:30', TZ_ISRAEL).toISOString(), '2026-07-05T17:30:00.000Z'); // IDT UTC+3
  assert.equal(zonedTimeToUtc('2026-12-06', '19:30', TZ_FRANCE).toISOString(), '2026-12-06T18:30:00.000Z');
});

test('écart France/Israël variable selon les dates (pas de décalage fixe)', () => {
  // Fin mars 2026 : Israël passe à l'heure d'été le vendredi 27/03, la France le dimanche 29/03.
  const gaps = ['2026-03-20', '2026-03-28', '2026-04-05', '2026-10-20', '2026-10-27', '2026-11-05'].map((d) => {
    const t = zonedTimeToUtc(d, '20:00', TZ_ISRAEL);
    const { il, fr } = dualTimes(t.toISOString());
    return Number(il.slice(0, 2)) - Number(fr.slice(0, 2));
  });
  assert.ok(gaps.includes(1));
  assert.ok(gaps.every((g) => g === 1 || g === 2 || g === 0), String(gaps));
  assert.ok(new Set(gaps).size >= 2, `l'écart doit varier : ${gaps}`);
});

test('semaine du dimanche au samedi', () => {
  const w = weekOf(new Date('2026-11-18T10:00:00Z'));
  assert.equal(w.start, '2026-11-15');
  assert.equal(w.end, '2026-11-21');
  assert.equal(w.days.length, 7);
});

test('statut en direct basé sur la plage horaire', () => {
  const c = { start: '2026-11-18T18:00:00Z', end: '2026-11-18T19:00:00Z', status: 'published' };
  assert.equal(courseTiming(c, new Date('2026-11-18T17:59:00Z')), 'upcoming');
  assert.equal(courseTiming(c, new Date('2026-11-18T18:30:00Z')), 'live');
  assert.equal(courseTiming(c, new Date('2026-11-18T19:01:00Z')), 'past');
  assert.equal(courseTiming({ ...c, status: 'cancelled' }, new Date('2026-11-18T18:30:00Z')), 'cancelled');
});

const rule = { id: 'r1', title: 'Paracha', teacherId: 'ben-ichay', weekdays: [0, 3], time: '20:30', durationMin: 60, timezone: TZ_ISRAEL, intervalWeeks: 1, startDate: '2026-11-01', active: true, joinUrl: 'https://zoom.us/j/1', joinPublic: true };

test('récurrence hebdomadaire et personnalisée', () => {
  const occ = expandRule(rule, '2026-11-15', '2026-11-21');
  assert.deepEqual(occ.map((o) => o.occurrenceDate), ['2026-11-15', '2026-11-18']);
  assert.equal(occ[0].id, 'r1__2026-11-15');
  assert.equal(localTime(occ[0].start, TZ_ISRAEL), '20:30');
  const biweekly = expandRule({ ...rule, weekdays: [0], intervalWeeks: 2 }, '2026-11-01', '2026-11-30');
  assert.deepEqual(biweekly.map((o) => o.occurrenceDate), ['2026-11-01', '2026-11-15', '2026-11-29']);
  assert.equal(expandRule({ ...rule, active: false }, '2026-11-15', '2026-11-21').length, 0);
});

test("préparer la semaine ne recrée pas une occurrence existante (modif isolée)", () => {
  const existing = [{ ...expandRule(rule, '2026-11-15', '2026-11-15')[0], title: 'Titre modifié' }];
  const created = prepareWeekFromRules([rule], existing, '2026-11-15');
  assert.deepEqual(created.map((c) => c.occurrenceDate), ['2026-11-18']);
});

test('dupliquer une semaine garde l’heure locale malgré le changement d’heure', () => {
  const src = [{ id: 'a', title: 'Cours', start: zonedTimeToUtc('2026-10-18', '20:30', TZ_ISRAEL).toISOString(), end: zonedTimeToUtc('2026-10-18', '21:30', TZ_ISRAEL).toISOString(), timezone: TZ_ISRAEL, status: 'published', replayUrl: 'x' }];
  const [copy] = duplicateWeek(src, '2026-10-18', '2026-10-25');
  assert.equal(localTime(copy.start, TZ_ISRAEL), '20:30');
  assert.equal(copy.status, 'draft');
  assert.equal(copy.replayUrl, '');
  assert.notEqual(copy.id, 'a');
});

test('contrôles avant publication', () => {
  const t = [{ id: 'ben-ichay', name: 'Rav' }];
  const base = { id: 'x', title: 'A', teacherId: 'ben-ichay', start: '2026-11-18T18:00:00Z', timezone: TZ_ISRAEL, status: 'scheduled', joinUrl: 'https://zoom.us/j/1' };
  const issues = validateCourses([
    base,
    { ...base, id: 'y' },
    { id: 'z', title: '', start: '', status: 'draft' },
    { ...base, id: 'w', title: 'B', start: '2026-11-19T18:00:00Z', joinUrl: '', timezone: 'Europe/London' },
    { ...base, id: 'k', title: 'K', start: '2026-11-20T18:00:00Z', status: 'cancelled' },
  ], { teachers: t, sentCommunications: [{ id: 'm1', label: 'Newsletter', courseIds: ['k'] }] });
  const msgs = issues.map((i) => i.message).join(' | ');
  assert.match(msgs, /Doublon probable/);
  assert.match(msgs, /sans titre/);
  assert.match(msgs, /sans date/);
  assert.match(msgs, /Lien de participation manquant/);
  assert.match(msgs, /Fuseau horaire inconnu/);
  assert.match(msgs, /rectificatif/);
});

test('visibilité publique et protection des liens privés', () => {
  assert.equal(isPublicCourse({ status: 'draft', start: 'x' }), false);
  assert.equal(isPublicCourse({ status: 'scheduled', start: 'x' }), false);
  assert.equal(isPublicCourse({ status: 'published', start: 'x' }), true);
  assert.equal(isPublicCourse({ status: 'published', start: 'x', visibility: 'private' }), false);
  assert.equal(isPublicCourse({ status: 'cancelled', start: 'x' }), false);
  assert.equal(isPublicCourse({ status: 'cancelled', start: 'x', publishedAt: 'y' }), true);
  const p = publicCourse({ id: 'a', joinUrl: 'https://zoom.us/j/secret', joinPublic: false, notes: 'interne' });
  assert.equal(p.joinUrl, undefined);
  assert.equal(p.notes, undefined);
});

test('messages WhatsApp et e-mails depuis les cours, sans les annulés', () => {
  const teachers = [{ id: 'ben-ichay', name: 'Rav Yehouda Ben Ichay' }];
  const courses = [
    { id: 'a', title: 'Paracha Vayetsé', teacherId: 'ben-ichay', start: zonedTimeToUtc('2026-11-15', '20:30', TZ_ISRAEL).toISOString(), status: 'published', joinUrl: 'https://zoom.us/j/1', joinPublic: true },
    { id: 'b', title: 'Cours annulé', start: zonedTimeToUtc('2026-11-15', '21:30', TZ_ISRAEL).toISOString(), status: 'cancelled' },
    { id: 'c', title: 'Cours privé', start: zonedTimeToUtc('2026-11-16', '10:00', TZ_ISRAEL).toISOString(), status: 'published', visibility: 'private' },
  ];
  const opts = { teachers, siteUrl: 'https://lilmod.fr', weekStart: '2026-11-15', dayKey: '2026-11-15' };
  const w = whatsappWeekly(courses, opts);
  assert.match(w, /PROGRAMME DE LA SEMAINE/);
  assert.match(w, /19h30 \(20h30 Israël\) — Paracha Vayetsé/);
  assert.match(w, /Avec Rav Yehouda Ben Ichay/);
  assert.doesNotMatch(w, /annulé|privé/);
  assert.match(w, /https:\/\/lilmod.fr\/programme\//);
  const d = whatsappDaily(courses, opts);
  assert.match(d, /COURS D'AUJOURD'HUI/);
  assert.match(d, /zoom.us\/j\/1/);
  const e = emailWeekly(courses, opts);
  assert.deepEqual(e.courseIds, ['a']);
  assert.match(e.html, /\*\|UNSUB\|\*/);
  assert.match(e.html, /Paracha Vayets/);
  assert.equal(emailDaily(courses, { ...opts, dayKey: '2026-11-17' }).empty, true);
});

test('calendriers', () => {
  const c = { id: 'a', title: 'Cours, test', start: '2026-11-18T18:00:00.000Z', status: 'published' };
  const ics = courseToIcs(c, { siteUrl: 'https://lilmod.fr' });
  assert.match(ics, /DTSTART:20261118T180000Z/);
  assert.match(ics, /DTEND:20261118T190000Z/);
  assert.match(ics, /SUMMARY:LILMOD — Cours\\, test/);
  assert.match(googleCalendarUrl(c, { siteUrl: 'https://lilmod.fr' }), /dates=20261118T180000Z%2F20261118T190000Z/);
});

test('recherche tolérante (accents, translittérations)', () => {
  assert.equal(fold('Ben Ichay'), fold('Ben Ishai'));
  assert.equal(fold('Téfila'), fold('Tefila'));
  assert.equal(fold('Parasha'), fold('Paracha'));
  assert.equal(fold('Tefilah'), fold('Tefila'));
  assert.ok(matchScore('ben ishai', [['Rav Yehouda Ben Ichay – Paracha Toldot', 1]]) > 0);
  assert.equal(matchScore('kabbale', [['Rav Kook', 1]]), 0);
});

test('détection intervenant, thèmes, séries, épisodes (titres réels)', () => {
  assert.equal(detectTeacherId("Rav Menahem Akerman - Tefila : personnelle et collective au fil de l'histoire. Episode 4 - 11/11/26"), 'akerman');
  assert.equal(detectTeacherId('Rav Yehouda Ben Ichay – Paracha Toldot : Ce n’est pas naturel 13/11/26'), 'ben-ichay');
  assert.equal(detectTeacherId('Rav Benshoushan - Rav Kook : aux sources de sa pensée 12/11'), 'ben-shoushan');
  assert.equal(detectTeacherId('Dr Michael Gross : Parachat Toldot - Une notion de la Paracha'), 'gross');
  assert.equal(detectTeacherId('Titre sans intervenant'), '');
  assert.ok(detectCategories('Rav Kook : aux sources de sa pensée').includes('rav-kook'));
  assert.ok(detectCategories('Paracha Toldot').includes('paracha'));
  assert.equal(episodeNumber('Introduction à la Tefila Episode 4'), 4);
  const v = enrichVideo({ id: 'x', title: "Rav Menahem Akerman - Tefila : personnelle et collective. Episode 4" });
  assert.equal(v.seriesId, 'introduction-a-la-tefila');
  assert.equal(v.episode, 4);
  const r = searchAll('ben ishai', { teachers: SEED_TEACHERS, series: SEED_SERIES, videos: [v] });
  assert.equal(r.teachers[0].id, 'ben-ichay');
  assert.equal(searchAll('zzzz', { teachers: SEED_TEACHERS }).teachers.length, 0);
});

test('heure de France en premier, heure d’Israël entre parenthèses', async () => {
  const { timeLabel } = await import('../shared/time.js');
  assert.equal(timeLabel(zonedTimeToUtc('2026-11-16', '17:00', TZ_FRANCE).toISOString()), '17h00 (18h00 Israël)');
  // fin mars : la France n'a pas encore changé d'heure, Israël si → 2 h d'écart
  assert.equal(timeLabel(zonedTimeToUtc('2026-03-28', '17:00', TZ_FRANCE).toISOString()), '17h00 (19h00 Israël)');
});
