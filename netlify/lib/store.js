/**
 * Stockage des données LILMOD.
 * - Sur Netlify : Netlify Blobs (inclus dans l'hébergement, aucun service payant).
 * - En local / tests : fichiers JSON dans LILMOD_STORE_DIR, ou mémoire.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const memory = new Map();
let blobStore = null;

async function netlifyStore() {
  if (blobStore !== null) return blobStore;
  if (process.env.LILMOD_STORE_DIR || process.env.LILMOD_STORE === 'memory') return (blobStore = false);
  try {
    const { getStore } = await import('@netlify/blobs');
    blobStore = getStore({ name: 'lilmod', consistency: 'strong' });
  } catch {
    blobStore = false;
  }
  return blobStore;
}

function filePath(key) {
  return path.join(process.env.LILMOD_STORE_DIR, `${key.replace(/[^a-z0-9_-]/gi, '_')}.json`);
}

export async function readJSON(key, fallback = null) {
  const store = await netlifyStore();
  try {
    if (store) {
      const value = await store.get(key, { type: 'json' });
      return value ?? fallback;
    }
    if (process.env.LILMOD_STORE_DIR) {
      return JSON.parse(await fs.readFile(filePath(key), 'utf8'));
    }
    return memory.has(key) ? structuredClone(memory.get(key)) : fallback;
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback;
    throw error;
  }
}

export async function writeJSON(key, value) {
  const store = await netlifyStore();
  if (store) return store.setJSON(key, value);
  if (process.env.LILMOD_STORE_DIR) {
    await fs.mkdir(process.env.LILMOD_STORE_DIR, { recursive: true });
    const tmp = `${filePath(key)}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2));
    return fs.rename(tmp, filePath(key));
  }
  memory.set(key, structuredClone(value));
}

/** Pour les tests : vide le stockage mémoire. */
export function resetMemoryStore() {
  memory.clear();
  blobStore = null;
}
