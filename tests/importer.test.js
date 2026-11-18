import test from 'node:test';
import assert from 'node:assert/strict';
import { parseProgrammeText, parseDayLine, parseTimeLine } from '../shared/importer.js';
import { SEED_TEACHERS } from '../shared/catalog.js';
import { localTime, TZ_FRANCE, TZ_ISRAEL } from '../shared/time.js';

// Programme réel de la semaine du 15 novembre 2026 (newsletter LILMOD).
const SAMPLE = `Programme de la semaine LILMOD et Midreshet Yehouda-Manitou

Dimanche 15 Novembre
Rav Shmuel Elikan
17H00 France

Torah et psychologie – Lecture biblique : La tour de Babel et le « Groupthink » d'Irving Janis

https://zoom.us/j/99172021386?pwd=fMOKyc6tTVMD4EYBLe80iL8vAKgrk9.1

By MIDRESHET YEHOUDA
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/j2YApc3Zu3O?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Lundi 16 Novembre
Rav Menahem Akerman
17H00 France

La prière de la Amida

https://lilmod.zoom.us/j/84153708030?pwd=VitTc1hVSjJSVXovWGJlRG9VQm5TZz09

By LILMOD
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/DCFA3JzVEl0?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Georges Spira
18H30 France

Les Juifs dans l'économie d'Amsterdam

https://zoom.us/j/99172021386?pwd=fMOKyc6tTVMD4EYBLe80iL8vAKgrk9.1

By MIDRESHET YEHOUDA
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/8PAh3FCNFuy?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Mardi 17 Novembre
Rav Eytan Fiszon
17H00 France

Les principaux textes de la prière

https://zoom.us/j/99172021386?pwd=fMOKyc6tTVMD4EYBLe80iL8vAKgrk9.1

By MIDRESHET YEHOUDA
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/fdWC4IyMSUy?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Mercredi 18 Novembre
Rav Menahem Akerman
17H00 France

La Torah de Manitou  – Berechit selon Manitou : de Kaïn à Hevel jusqu'au Déluge

https://lilmod.zoom.us/j/84153708030?pwd=VitTc1hVSjJSVXovWGJlRG9VQm5TZz09

By MIDRESHET YEHOUDA
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/Ut3oJMUzqa9?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Dr Michael Gross
19H15 France

Réflexion sur la Paracha de la semaine

https://lilmod.zoom.us/j/87912806201?pwd=V0sraDBBVWIyMi9hY1pRV3pGWmtvQT09


By LE HOUG
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/g_0DXVkCJiM?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Jeudi 19 Novembre
Rav Yossef Ben-Shoushan
17H00 France

Étude du Rav Kook

https://lilmod.zoom.us/j/83014400119?pwd=jcdh3GlPL7doXZySVI0TeoRKidSv1E.1

By LILMOD
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/_AeaxuVQudb?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Rav Shmouel Ouziel
18H00 France

Paracha Hachavoua

https://zoom.us/j/99172021386?pwd=fMOKyc6tTVMD4EYBLe80iL8vAKgrk9.1

By MIDRESHET YEOUDA
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/mXdo79lmDkz?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)
Vendredi 20 Novembre
Rav Ben-Ichay
10H15 France

Parachat HaChavoua

https://lilmod.zoom.us/j/95699230619?pwd=cC9scGdjSENKSStBTGxvRnFyamxtQT09

By LILMOD
[Cliquez ici- pour le lien Zoom](https://us.list-manage.com/NcYZY1vTEA2?e=13ab771ad7&c2id=36fc83a3615e4be7f2bb6d7771f6fc5e)`;

export { SAMPLE };

test('lignes de jour et d’heure', () => {
  const ref = new Date('2026-11-18T10:00:00Z');
  assert.equal(parseDayLine('Dimanche 15 Novembre', ref), '2026-11-15');
  assert.equal(parseDayLine('Mardi 1er décembre', ref), '2026-12-01');
  assert.equal(parseDayLine('Jeudi 7 janvier', ref), '2027-01-07');
  assert.equal(parseDayLine('Rav Menahem Akerman', ref), null);
  assert.deepEqual(parseTimeLine('17H00 France'), { time: '17:00', timezone: TZ_FRANCE, timezoneGuessed: false });
  assert.equal(parseTimeLine('20h30 Israël').timezone, TZ_ISRAEL);
  assert.equal(parseTimeLine('Les principaux textes de la prière'), null);
});

test('programme réel : 9 cours, intervenants, liens, organisateurs', () => {
  const courses = parseProgrammeText(SAMPLE, { teachers: SEED_TEACHERS, reference: new Date('2026-11-18T10:00:00Z') });
  assert.equal(courses.length, 9);
  const [elikan, akerman, spira, fiszon, manitou, gross, kook, ouziel, benIchay] = courses;

  assert.equal(elikan.date, '2026-11-15');
  assert.equal(elikan.teacherName, 'Rav Shmuel Elikan');
  assert.equal(elikan.teacherId, 'elikan');
  assert.match(elikan.title, /^Torah et psychologie – Lecture biblique/);
  assert.equal(elikan.joinUrl, 'https://zoom.us/j/99172021386?pwd=fMOKyc6tTVMD4EYBLe80iL8vAKgrk9.1');
  assert.equal(elikan.organizer, 'Midreshet Yehouda-Manitou');
  assert.equal(localTime(elikan.start, TZ_FRANCE), '17:00');
  assert.equal(localTime(elikan.start, TZ_ISRAEL), '18:00');

  assert.equal(akerman.teacherId, 'akerman');
  assert.equal(akerman.category, 'tefila');
  assert.equal(akerman.organizer, 'LILMOD');
  assert.equal(spira.teacherId, 'spira');
  assert.equal(spira.date, '2026-11-16');
  assert.equal(spira.time, '18:30');
  assert.equal(fiszon.teacherId, 'fizson');
  assert.equal(manitou.date, '2026-11-18');
  assert.equal(gross.teacherId, 'gross');
  assert.equal(gross.organizer, 'Le HOUG');
  assert.equal(gross.joinUrl, 'https://lilmod.zoom.us/j/87912806201?pwd=V0sraDBBVWIyMi9hY1pRV3pGWmtvQT09');
  assert.equal(kook.teacherId, 'ben-shoushan');
  assert.equal(kook.category, 'rav-kook');
  assert.equal(ouziel.teacherId, 'ouziel');
  assert.equal(ouziel.organizer, 'Midreshet Yehouda-Manitou');
  assert.equal(benIchay.teacherId, 'ben-ichay');
  assert.equal(benIchay.date, '2026-11-20');
  assert.equal(benIchay.time, '10:15');
  assert.ok(courses.every((c) => !c.joinUrl.includes('list-manage')), 'liens de suivi Mailchimp ignorés');
  assert.ok(courses.every((c) => c.warnings.length === 0), JSON.stringify(courses.map((c) => c.warnings)));
});

test('intervenant inconnu signalé, rien d’inventé', () => {
  const [c] = parseProgrammeText('Lundi 16 Novembre\nRav Inconnu Test\n20h00 Israël\nUn cours\n', { teachers: SEED_TEACHERS, reference: new Date('2026-11-18T10:00:00Z') });
  assert.equal(c.teacherId, '');
  assert.equal(c.teacherName, 'Rav Inconnu Test');
  assert.ok(c.warnings.some((w) => /à créer/.test(w)));
  assert.ok(c.warnings.some((w) => /Lien/.test(w)));
});
