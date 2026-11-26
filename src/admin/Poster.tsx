/**
 * Affiche de la semaine, au design LILMOD habituel (modèle fourni par l'équipe) :
 * le fond est le modèle vierge, les dates et les cours publiés sont écrits automatiquement
 * dans les colonnes. Utilisable en haut de la newsletter et téléchargeable (JPG / PNG).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, ImagePlus, RefreshCw } from 'lucide-react';
import { adminApi } from './api';
import { btn } from './ui';
import { addDaysToKey, dualTimes, localDateKey } from '../../shared/time.js';

/** Modèle vierge (1024 × 950) et position des 6 colonnes, du dimanche au vendredi. */
const TEMPLATE = '/images/affiche-modele.webp';
const TW = 1024;
const TH = 950;
const COLUMNS: [number, number][] = [[14, 169], [183, 339], [351, 507], [519, 675], [687, 844], [856, 1012]];
const BODY_TOP = 222;
const BODY_BOTTOM = 830;
const SCALE = 2; // rendu net (2048 × 1900)

const ORANGE = '#E8920F';
const INK = '#2B2B2B';
const GREY = '#7A7A7A';

/**
 * Logos des organisateurs, dessinés dans un rond blanc cerclé d'orange (style de l'affiche LILMOD).
 * fill : l'image remplit tout le rond (photo, emblème déjà rond) ; sinon elle est centrée avec une marge.
 */
const ORG_LOGOS: Record<string, { src: string; fill?: boolean; scale?: number }> = {
  LILMOD: { src: '/images/partners/lilmod-fleur.webp', scale: 0.86 },
  'Midreshet Yehouda-Manitou': { src: '/images/partners/manitou.webp', scale: 0.78 },
  'Le HOUG': { src: '/images/partners/houg-rond.webp', fill: true },
  'Emounah Chelema': { src: '/images/partners/emouna-rond.webp', fill: true },
  "Manitou l'hébreu": { src: '/images/partners/manitou-hebreu.webp', fill: true },
};
const RING = '#EFA52F';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const cut = lines.slice(0, maxLines);
    let last = cut[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length) last = last.slice(0, -1);
    cut[maxLines - 1] = `${last.trimEnd()}…`;
    return cut;
  }
  return lines;
}

/** Logo dans un rond blanc cerclé d'orange. */
function drawLogo(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, opts: { fill?: boolean; scale?: number }, cx: number, top: number, box: number) {
  const r = box / 2;
  const cy = top + r;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  if (img) {
    ctx.clip();
    const target = opts.fill ? box : box * (opts.scale ?? 0.8);
    const s = opts.fill ? Math.max(target / img.width, target / img.height) : Math.min(target / img.width, target / img.height);
    const w = img.width * s;
    const h = img.height * s;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 0.75, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = RING;
  ctx.stroke();
}

const hhmm = (t: string) => t.replace(':', 'H');
const ddmm = (key: string) => `${key.slice(8, 10)}/${key.slice(5, 7)}`;

export async function drawPoster(canvas: HTMLCanvasElement, { courses, teachers, weekStart }: any) {
  await Promise.all(['800 24px Inter', '700 14px Inter', '500 26px Inter'].map((f) => document.fonts.load(f).catch(() => null)));
  const teacherName = (id: string) => teachers.find((t: any) => t.id === id)?.name || '';
  const [template, ...logoList] = await Promise.all([loadImage(TEMPLATE), ...Object.values(ORG_LOGOS).map((o) => loadImage(o.src))]);
  const logos = Object.fromEntries(Object.keys(ORG_LOGOS).map((k, i) => [k, logoList[i]]));

  canvas.width = TW * SCALE;
  canvas.height = TH * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, TW, TH);
  if (template) ctx.drawImage(template, 0, 0, TW, TH);

  // Dates de la semaine, entre « Programme » et « organisé avec : »
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#3A3A3A';
  ctx.font = '600 24px Inter';
  ctx.fillText(`${ddmm(weekStart)} AU ${ddmm(addDaysToKey(weekStart, 5))}`, 512, 51);

  // Colonnes : dimanche → vendredi
  COLUMNS.forEach(([x0, x1], i) => {
    const day = addDaysToKey(weekStart, i);
    const list = courses.filter((c: any) => localDateKey(c.start) === day).sort((a: any, b: any) => a.start.localeCompare(b.start));
    if (!list.length) return;
    const cx = (x0 + x1) / 2;
    const maxW = x1 - x0 - 18;

    // Mise en page : on réduit légèrement les tailles si la colonne est trop remplie.
    const layout = (k: number) => {
      const f = { logo: 52 * k, time: 24 * k, il: 12.5 * k, teacher: 17 * k, title: 13.5 * k, gap: 22 * k };
      const blocks = list.map((c: any) => {
        ctx.font = `800 ${f.teacher}px Inter`;
        // Sans enseignant unique (ex. conférence à plusieurs voix) : « Titre – avec X, Y… »
        // → le titre prend la place du nom, la liste des intervenants passe dessous.
        const name = teacherName(c.teacherId);
        const split = !name ? String(c.title).split(/\s+[–—-]\s+(?=avec\s)/i) : [];
        const head = name || (split.length > 1 ? split[0] : '');
        const body = name || split.length < 2 ? c.title : split.slice(1).join(' – ').replace(/^avec/i, 'Avec');
        const tl = wrap(ctx, head.toUpperCase(), maxW, 4);
        ctx.font = `700 ${f.title}px Inter`;
        const ll = wrap(ctx, body, maxW, 8);
        const h = f.logo + 6 * k + f.time + f.il + 8 * k + tl.length * f.teacher * 1.15 + 6 * k + ll.length * f.title * 1.3;
        return { c, tl, ll, h };
      });
      const total = blocks.reduce((a: number, b: any) => a + b.h, 0) + f.gap * (blocks.length - 1);
      return { f, blocks, total };
    };
    let k = 1;
    let L = layout(k);
    while (L.total > BODY_BOTTOM - BODY_TOP - 16 && k > 0.6) {
      k -= 0.05;
      L = layout(k);
    }

    let y = BODY_TOP + 14;
    for (const b of L.blocks) {
      const { f } = L;
      const org = ORG_LOGOS[b.c.organizer] ? b.c.organizer : 'LILMOD';
      drawLogo(ctx, logos[org], ORG_LOGOS[org], cx, y, f.logo);
      y += f.logo + 6 * k + f.time;
      const { fr, il } = dualTimes(b.c.start);
      ctx.fillStyle = ORANGE;
      ctx.font = `800 ${f.time}px Inter`;
      ctx.fillText(hhmm(fr), cx, y);
      y += f.il + 2 * k;
      ctx.fillStyle = GREY;
      ctx.font = `600 ${f.il}px Inter`;
      ctx.fillText(`(${hhmm(il)} Israël)`, cx, y);
      y += 8 * k;
      ctx.fillStyle = INK;
      ctx.font = `800 ${f.teacher}px Inter`;
      for (const l of b.tl) {
        y += f.teacher * 1.15;
        ctx.fillText(l, cx, y);
      }
      y += 6 * k;
      ctx.font = `700 ${f.title}px Inter`;
      for (const l of b.ll) {
        y += f.title * 1.3;
        ctx.fillText(l, cx, y);
      }
      y += f.gap;
    }
  });
  ctx.textAlign = 'left';
}

export default function PosterPanel({ data, weekStart, flash, onSaved }: any) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState('');
  const render = useCallback(async () => {
    if (ref.current && data) await drawPoster(ref.current, { courses: data.courses || [], teachers: data.teachers || [], weekStart });
  }, [data, weekStart]);
  useEffect(() => {
    render();
  }, [render]);

  const download = (format: 'png' | 'jpg') => {
    const a = document.createElement('a');
    a.href = format === 'png' ? ref.current!.toDataURL('image/png') : ref.current!.toDataURL('image/jpeg', 0.92);
    a.download = `lilmod-programme-${weekStart}.${format}`;
    a.click();
  };

  const useInNewsletter = async () => {
    setBusy('save');
    try {
      const dataUrl = ref.current!.toDataURL('image/jpeg', 0.9);
      const { url } = await adminApi('POST', '/media', { dataUrl });
      const { settings } = await adminApi('GET', '/settings');
      await adminApi('PUT', '/settings', { weekly: { ...settings.weekly, posters: { ...(settings.weekly.posters || {}), [weekStart]: url } } });
      flash.ok("Affiche ajoutée en haut de la newsletter de la semaine.");
      onSaved?.();
    } catch (e: any) {
      flash.error(e.message);
    } finally {
      setBusy('');
    }
  };

  if (!data?.courses?.length) return null;
  return (
    <div className="space-y-3">
      <canvas ref={ref} className="h-auto w-full rounded-xl border border-neutral-200 bg-white" aria-label="Affiche du programme de la semaine" role="img" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn.accent} disabled={!!busy} onClick={useInNewsletter}>
          <ImagePlus className="h-4 w-4" aria-hidden="true" /> {data.poster ? "Mettre à jour l'affiche de la newsletter" : 'Mettre en haut de la newsletter'}
        </button>
        <button type="button" className={btn.outline} onClick={() => download('jpg')}>
          <Download className="h-4 w-4" aria-hidden="true" /> Télécharger en JPG
        </button>
        <button type="button" className={btn.outline} onClick={() => download('png')}>
          <Download className="h-4 w-4" aria-hidden="true" /> Télécharger en PNG
        </button>
        <button type="button" className={btn.outline} onClick={render} aria-label="Redessiner">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {data.poster && <p className="text-xs text-green-700">✓ Une affiche est déjà dans la newsletter de cette semaine.</p>}
    </div>
  );
}
