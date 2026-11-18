/**
 * Serveur local de test : sert le site compilé (dist/) et exécute les vraies
 * fonctions Netlify (API publique et administration) avec un stockage fichier
 * séparé de la production.
 *
 *   npm run build && LILMOD_STORE_DIR=.local-data ADMIN_PASSWORD=... node scripts/local-server.mjs
 */
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT || 4321);
process.env.LILMOD_STORE_DIR ||= path.join(root, '.local-data');
process.env.URL ||= `http://localhost:${port}`;

const { default: api } = await import('../netlify/functions/api.js');
const { default: admin } = await import('../netlify/functions/admin.js');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

async function toRequest(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  return new Request(`http://localhost:${port}${req.url}`, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
}

async function send(res, response) {
  const headers = {};
  response.headers.forEach((v, k) => (headers[k] = v));
  // Le cookie « Secure » n'est pas accepté en http local : on l'assouplit uniquement ici.
  if (headers['set-cookie']) headers['set-cookie'] = headers['set-cookie'].replace('; Secure', '');
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
}

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://localhost:${port}`);
      if (url.pathname.startsWith('/api/v1/')) return send(res, await api(await toRequest(req)));
      if (url.pathname.startsWith('/api/admin/')) return send(res, await admin(await toRequest(req)));
      if (url.pathname.startsWith('/.netlify/functions/')) {
        res.writeHead(404);
        return res.end();
      }
      let file = path.join(dist, decodeURIComponent(url.pathname));
      if (!file.startsWith(dist)) {
        res.writeHead(403);
        return res.end();
      }
      let stat = await fs.stat(file).catch(() => null);
      if (!stat || stat.isDirectory()) {
        file = path.join(dist, 'index.html');
        stat = await fs.stat(file);
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(await fs.readFile(file));
    } catch (e) {
      console.error(e);
      res.writeHead(500);
      res.end('Erreur serveur local');
    }
  })
  .listen(port, () => console.log(`LILMOD local : http://localhost:${port} (données : ${process.env.LILMOD_STORE_DIR})`));
