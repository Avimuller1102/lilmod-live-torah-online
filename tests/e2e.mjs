/**
 * Test de bout en bout (navigateur réel) sur le serveur local.
 *   npm run build && npm run test:e2e
 * Utilise un stockage temporaire : aucune donnée de production n'est touchée,
 * aucun e-mail n'est envoyé (Mailchimp non configuré).
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const PORT = 4400 + Math.floor(Math.random() * 400);
const BASE = `http://localhost:${PORT}`;
const PASSWORD = 'mot-de-passe-e2e-123';
const shots = process.env.E2E_SHOTS || '';
const store = mkdtempSync(path.join(tmpdir(), 'lilmod-e2e-'));

const server = spawn(process.execPath, ['scripts/local-server.mjs'], {
  env: { ...process.env, PORT: String(PORT), LILMOD_STORE_DIR: store, ADMIN_PASSWORD: PASSWORD, MAILCHIMP_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((resolve) => server.stdout.on('data', (d) => String(d).includes('LILMOD local') && resolve()));

const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push(`✔ ${name}`);
  } catch (e) {
    results.push(`✘ ${name} — ${e.message.split('\n')[0]}`);
  }
};

const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => d.accept());

  await step("Connexion à l'administration", async () => {
    await page.goto(`${BASE}/admin`);
    await page.fill('#p', 'mauvais');
    await page.click('button[type=submit]');
    await page.getByRole('alert').waitFor();
    await page.fill('#p', PASSWORD);
    await page.click('button[type=submit]');
    await page.getByText('Bonjour admin').waitFor();
  });

  await step('Importer le programme réel de la newsletter (9 cours + récurrences)', async () => {
    const { SAMPLE } = await import('./importer.test.js');
    await page.goto(`${BASE}/admin/programme`);
    await page.getByRole('button', { name: 'Importer un programme' }).click();
    await page.fill('#import-text', SAMPLE);
    await page.getByRole('button', { name: 'Analyser' }).click();
    await page.getByText('9 cours reconnus').waitFor();
    await page.getByRole('button', { name: /Importer 9 cours/ }).click();
    await page.getByText(/9 cours importés, 9 cours récurrents créés/).waitFor();
    if (shots) await page.screenshot({ path: `${shots}/admin-import.png` });
  });

  await step('Téléverser la photo d’un intervenant', async () => {
    await page.goto(`${BASE}/admin/intervenants`);
    await page.locator('li:has-text("Dr Michael Gross") button:has-text("Modifier")').click();
    await page.setInputFiles('input[type=file]', { name: 'gross.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64') });
    await page.getByText('Photo téléversée').waitFor();
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await page.getByText('Intervenant enregistré').waitFor();
    const { teachers } = await (await page.request.get(`${BASE}/api/v1/catalog`)).json();
    assert.match(teachers.find((t) => t.id === 'gross').photo, /^\/api\/v1\/media\//);
  });

  await step('Créer un cours récurrent (chaque dimanche et mercredi, 19h00 France)', async () => {
    await page.goto(`${BASE}/admin/recurrences`);
    await page.getByRole('button', { name: 'Nouveau cours récurrent' }).click();
    await page.fill('#r-title', 'La Paracha de la semaine');
    await page.locator('label:has-text("Mercredi")').click();
    await page.selectOption('#r-teacher', 'ben-ichay');
    await page.fill('#r-join', 'https://zoom.us/j/111');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await page.getByText('Dimanche, Mercredi à 19:00 (heure de France)').waitFor();
  });

  await step('Préparer la semaine suivante depuis les récurrences', async () => {
    await page.goto(`${BASE}/admin`);
    await page.getByRole('button', { name: 'Préparer la semaine suivante' }).click();
    await page.getByText(/cours créés en brouillon/).waitFor();
    assert.equal(await page.getByText('La Paracha de la semaine', { exact: true }).count(), 2);
  });

  await step('Ajouter un cours en direct maintenant (heure de France) et publier', async () => {
    await page.goto(`${BASE}/admin/programme`);
    await page.getByRole('button', { name: 'Ajouter un cours' }).first().click();
    await page.fill('#c-title', 'Tefila : la Amida (test)');
    await page.selectOption('#c-teacher', 'akerman');
    const now = new Date(Date.now() - 10 * 60000);
    const fr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' }).format(now).split(' ');
    await page.fill('#c-date', fr[0]);
    await page.fill('#c-time', fr[1]);
    await page.selectOption('#c-tz', 'Europe/Paris');
    await page.getByText('Affiché aux visiteurs').waitFor();
    await page.fill('#c-join', 'https://zoom.us/j/222');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await page.getByText('Cours enregistré').waitFor();
    await page.getByRole('button', { name: 'Vérifier' }).click();
    await page.getByText(/point\(s\) à vérifier|Tout est en ordre/).waitFor();
    await page.getByRole('button', { name: 'Publier la semaine' }).click();
    await page.getByText(/cours publiés/).waitFor();
  });

  await step('Publier aussi la semaine suivante', async () => {
    await page.locator('button[aria-label="Semaine suivante"]').click();
    await page.getByText('La Paracha de la semaine').first().waitFor();
    await page.getByRole('button', { name: 'Publier la semaine' }).click();
    await page.getByText(/cours publiés/).waitFor();
  });

  await step('Accueil : cours « En direct » et bouton Rejoindre', async () => {
    await page.goto(BASE);
    await page.getByRole('heading', { name: 'Un cours est en direct' }).waitFor();
    const hrefs = await page.locator('#prochains-cours a:has-text("Rejoindre le cours")').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    assert.ok(hrefs.includes('https://zoom.us/j/222'), JSON.stringify(hrefs));
    if (shots) await page.screenshot({ path: `${shots}/accueil.png` });
  });

  await step('Programme : semaine, filtres, fiche du cours', async () => {
    await page.goto(`${BASE}/programme`);
    await page.getByText('Tefila : la Amida (test)').first().waitFor();
    await page.getByRole('button', { name: 'Semaine suivante' }).click();
    await page.getByText('La Paracha de la semaine').first().waitFor();
    await page.getByRole('button', { name: 'Semaine', exact: true }).click();
    if (shots) await page.screenshot({ path: `${shots}/programme-semaine.png` });
    await page.getByRole('button', { name: 'Aujourd’hui' }).or(page.getByRole('button', { name: "Aujourd'hui" })).click();
    await page.getByRole('link', { name: 'Tefila : la Amida (test)' }).first().click();
    await page.getByRole('heading', { name: 'Tefila : la Amida (test)' }).waitFor();
    assert.ok(await page.getByRole('link', { name: 'Rejoindre le cours' }).isVisible());
    if (shots) await page.screenshot({ path: `${shots}/fiche-cours.png` });
  });

  await step('Fichier .ics du cours', async () => {
    const res = await page.request.get(`${BASE}/api/v1/programme`);
    const { courses } = await res.json();
    const ics = await (await page.request.get(`${BASE}/api/v1/ics/${courses[0].id}`)).text();
    assert.match(ics, /BEGIN:VEVENT/);
  });

  await step('Recherche tolérante « ben ishai »', async () => {
    await page.goto(BASE);
    await page.getByRole('heading', { name: /cours/i }).first().waitFor();
    await page.getByRole('button', { name: /^Rechercher/ }).click();
    await page.fill('#global-search', 'ben ishai');
    await page.getByText('Rav Yehouda Ben Ichay').first().waitFor();
    await page.keyboard.press('Escape');
  });

  await step('Bibliothèque, fiche vidéo, intervenant, série', async () => {
    await page.goto(`${BASE}/cours`);
    await page.locator('article h3 a').first().waitFor({ timeout: 20000 });
    await page.locator('article h3 a').first().click();
    await page.getByRole('button', { name: /Lire la vidéo/ }).waitFor();
    if (shots) await page.screenshot({ path: `${shots}/video.png` });
    await page.goto(`${BASE}/intervenants/akerman`);
    await page.getByRole('heading', { name: 'Rav Menahem Akerman', exact: true }).waitFor();
    await page.getByText('Tefila : la Amida (test)').first().waitFor();
    await page.goto(`${BASE}/series`);
    await page.getByRole('heading', { name: 'Suivre un enseignement dans la durée' }).waitFor();
  });

  await step('WhatsApp : message généré depuis le programme', async () => {
    await page.goto(`${BASE}/admin/whatsapp?type=daily`);
    const text = await page.locator('#wa-text').inputValue();
    assert.match(text, /LES COURS D'AUJOURD'HUI/);
    assert.match(text, /Tefila : la Amida \(test\)/);
    const href = await page.getByRole('link', { name: 'Ouvrir dans WhatsApp' }).getAttribute('href');
    assert.match(href, /^https:\/\/wa\.me\/\?text=/);
  });

  await step('Newsletter : aperçu et copie HTML sans Mailchimp', async () => {
    await page.goto(`${BASE}/admin/newsletter`);
    await page.locator('iframe[title="Aperçu de l\'e-mail"]').waitFor();
    await page.getByText("Mailchimp n'est pas encore connecté").waitFor();
    if (shots) await page.screenshot({ path: `${shots}/admin-newsletter.png` });
  });

  await step('Modifier un horaire : visible immédiatement sur le site', async () => {
    const res = await page.request.get(`${BASE}/api/admin/courses`);
    const { courses } = await res.json();
    const c = courses.find((x) => x.title === 'La Paracha de la semaine');
    const put = await page.request.put(`${BASE}/api/admin/courses/${c.id}`, { headers: { 'x-lilmod-admin': '1' }, data: { ...c, title: 'Paracha Vayichla’h (titre modifié)' } });
    assert.equal(put.status(), 200);
    const pub = await (await page.request.get(`${BASE}/api/v1/programme/${c.id}`)).json();
    assert.equal(pub.course.title, 'Paracha Vayichla’h (titre modifié)');
  });

  await step('Mobile : accueil, programme et fiche sans débordement', async () => {
    const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    m.on('pageerror', (e) => errors.push(e.message));
    for (const p of ['/', '/programme', '/cours', '/intervenants']) {
      await m.goto(`${BASE}${p}`);
      await m.waitForTimeout(800);
      const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(overflow <= 0, `débordement horizontal sur ${p} : ${overflow}px`);
    }
    await m.goto(BASE);
    await m.waitForTimeout(800);
    if (shots) await m.screenshot({ path: `${shots}/mobile-accueil.png` });
    await m.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await m.getByRole('link', { name: 'Programme' }).first().click();
    await m.getByRole('heading', { name: 'Le programme de la semaine' }).waitFor();
    if (shots) await m.screenshot({ path: `${shots}/mobile-programme.png` });
  });

  await step('Aucune erreur JavaScript', async () => assert.deepEqual(errors, []));
} finally {
  await browser.close();
  server.kill();
}

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('✘')).length;
console.log(`\n${results.length - failed}/${results.length} étapes réussies`);
process.exit(failed ? 1 : 0);
