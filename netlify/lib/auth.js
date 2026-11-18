/**
 * Authentification de l'administration.
 * - Compte principal : identifiant « admin » + mot de passe ADMIN_PASSWORD (variable
 *   d'environnement Netlify, jamais dans le code).
 * - Comptes supplémentaires (rôles « admin » ou « editor ») créés depuis
 *   l'administration, mots de passe hachés (scrypt).
 * - Session : jeton signé HMAC dans un cookie HttpOnly, Secure, SameSite=Strict.
 */
import crypto from 'node:crypto';
import { getUsers } from './data.js';

const COOKIE = 'lilmod_admin';
const SESSION_HOURS = 12;

function secret() {
  const s = process.env.ADMIN_SECRET || (process.env.ADMIN_PASSWORD ? `lilmod:${process.env.ADMIN_PASSWORD}` : '');
  if (!s) throw Object.assign(new Error("L'administration n'est pas configurée (ADMIN_PASSWORD manquant)."), { status: 503 });
  return crypto.createHash('sha256').update(s).digest();
}

const b64 = (buf) => Buffer.from(buf).toString('base64url');

export function signSession(payload) {
  const body = b64(JSON.stringify({ ...payload, exp: Date.now() + SESSION_HOURS * 3600_000 }));
  const sig = b64(crypto.createHmac('sha256', secret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifySession(token) {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = b64(crypto.createHmac('sha256', secret()).update(body).digest());
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 32);
  return `scrypt$${b64(salt)}$${b64(hash)}`;
}

function verifyHash(password, stored) {
  const [, salt, hash] = String(stored || '').split('$');
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(password, Buffer.from(salt, 'base64url'), 32);
  const expected = Buffer.from(hash, 'base64url');
  return computed.length === expected.length && crypto.timingSafeEqual(computed, expected);
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Vérifie identifiant / mot de passe. Retourne { username, role } ou null. */
export async function checkCredentials(username, password) {
  const user = String(username || '').trim().toLowerCase();
  if (!password) return null;
  if (user === 'admin' && process.env.ADMIN_PASSWORD && safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return { username: 'admin', role: 'admin' };
  }
  const users = await getUsers();
  const found = users.find((u) => u.username === user && !u.disabled);
  if (found && verifyHash(password, found.passwordHash)) return { username: found.username, role: found.role };
  return null;
}

/* Limitation des tentatives de connexion (par instance de fonction). */
const attempts = new Map();
export function tooManyAttempts(ip) {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  attempts.set(ip, list);
  return list.length >= 8;
}
export function recordFailure(ip) {
  attempts.set(ip, [...(attempts.get(ip) || []), Date.now()]);
}

export function sessionCookie(token) {
  return `${COOKIE}=${token}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`;
}
export const clearCookie = `${COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function readSession(req) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  return verifySession(token);
}
