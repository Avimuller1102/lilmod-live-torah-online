/**
 * Affiche de la semaine, dessinée automatiquement à partir des cours publiés.
 * Utilisable en haut de la newsletter, et téléchargeable pour WhatsApp / Instagram.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, ImagePlus, RefreshCw } from 'lucide-react';
import { adminApi } from './api';
import { btn } from './ui';
import { addDaysToKey, dualTimes, localDateKey, WEEKDAYS_FR } from '../../shared/time.js';

const W = 1200;
const NAVY = '#0F1E36';
const NAVY2 = '#172C4D';
const GOLD = '#CFA653';
const GOLD_DARK = '#9A722B';
const SAND = '#F7F3EC';
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const ORG_LOGOS: Record<string, string> = {
  LILMOD: '/images/logo-lilmod.webp',
  'Midreshet Yehouda-Manitou': '/images/partners/manitou.webp',
  'Le HOUG': '/images/partners/houg.webp',
  'Emounah Chelema': '/images/partners/emouna-chelema.webp',
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = String(text || '').split(/\s+/);
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

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circleImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, cx: number, cy: number, r: number, ring = GOLD) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  if (img) {
    ctx.clip();
    const s = Math.max((2 * r) / img.width, (2 * r) / img.height);
    ctx.drawImage(img, cx - (img.width * s) / 2, cy - (img.height * s) / 2, img.width * s, img.height * s);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(2, r / 12);
  ctx.strokeStyle = ring;
  ctx.stroke();
}

export async function drawPoster(canvas: HTMLCanvasElement, { courses, teachers, weekStart, parasha }: any) {
  await Promise.all(['600 64px Fraunces', '700 26px Inter', '600 20px Inter', '400 18px Inter'].map((f) => document.fonts.load(f).catch(() => null)));
  const teacherName = (id: string) => teachers.find((t: any) => t.id === id)?.name || '';
  const days = Array.from({ length: 7 }, (_, i) => addDaysToKey(weekStart, i))
    .map((d) => ({ d, list: courses.filter((c: any) => localDateKey(c.start) === d).sort((a: any, b: any) => a.start.localeCompare(b.start)) }))
    .filter((x) => x.list.length);
  const organizers = [...new Set<string>(courses.map((c: any) => c.organizer).filter(Boolean))];
  const logos: Record<string, HTMLImageElement | null> = {};
  for (const o of ['LILMOD', ...organizers]) logos[o] = await loadImage(ORG_LOGOS[o] || '');
  const tmLogo = await loadImage('/images/torah-mitzion-logo.webp');

  // Mise en page
  const ctx = canvas.getContext('2d')!;
  const margin = 40;
  const gap = 14;
  const n = Math.max(days.length, 1);
  const colW = (W - margin * 2 - gap * (n - 1)) / n;
  const pad = 16;
  ctx.font = '600 19px Inter';
  const cardHeights = days.map((x) =>
    x.list.map((c: any) => {
      ctx.font = '700 17px Inter';
      const tl = wrap(ctx, teacherName(c.teacherId).toUpperCase(), colW - pad * 2, 2).length;
      ctx.font = '400 16px Inter';
      const ll = wrap(ctx, c.title, colW - pad * 2, 5).length;
      return 26 + 34 + 22 + tl * 21 + 8 + ll * 21 + (c.organizer ? 34 : 0) + 18;
    }),
  );
  const colHeights = cardHeights.map((hs) => hs.reduce((a, b) => a + b + 12, 0));
  const headerH = 300;
  const orgH = organizers.length ? 96 : 0;
  const gridTop = headerH + orgH + 34;
  const gridH = Math.max(260, ...colHeights) + 70;
  const footerH = 128;
  const H = gridTop + gridH + 30 + footerH;
  canvas.width = W;
  canvas.height = H;

  // Fond
  ctx.fillStyle = SAND;
  ctx.fillRect(0, 0, W, H);

  // En-tête
  const g = ctx.createLinearGradient(0, 0, W, headerH);
  g.addColorStop(0, NAVY);
  g.addColorStop(0.55, NAVY2);
  g.addColorStop(1, '#0A1426');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, headerH);
  const glow = ctx.createRadialGradient(160, 60, 10, 160, 60, 420);
  glow.addColorStop(0, 'rgba(207,166,83,0.35)');
  glow.addColorStop(1, 'rgba(207,166,83,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, headerH);
  circleImage(ctx, logos.LILMOD, 112, 110, 62);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E8C76D';
  ctx.font = '700 20px Inter';
  ctx.fillText("LILMOD · LA TORAH EN DIRECT D'ISRAËL", 200, 78);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 62px Fraunces';
  ctx.fillText('Programme de la semaine', 198, 148);
  const [, m1, d1] = weekStart.split('-').map(Number);
  const last = days.length ? days[days.length - 1].d : addDaysToKey(weekStart, 6);
  const [, m2, d2] = last.split('-').map(Number);
  ctx.fillStyle = '#E8C76D';
  ctx.font = '600 26px Inter';
  ctx.fillText(`Du ${d1} ${m1 === m2 ? '' : `${MONTHS[m1 - 1]} `}au ${d2} ${MONTHS[m2 - 1]}${parasha ? `  ·  Paracha ${parasha}` : ''}`, 200, 196);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '400 20px Inter';
  ctx.fillText('Cours en direct sur Zoom · Horaires à l’heure de France (heure d’Israël entre parenthèses)', 200, 238);
  const bar = ctx.createLinearGradient(0, 0, W, 0);
  bar.addColorStop(0, GOLD_DARK);
  bar.addColorStop(0.5, '#E8C76D');
  bar.addColorStop(1, GOLD_DARK);
  ctx.fillStyle = bar;
  ctx.fillRect(0, headerH - 8, W, 8);

  // Organisateurs
  if (organizers.length) {
    ctx.font = '600 18px Inter';
    const items = organizers.map((o) => ({ o, w: 56 + ctx.measureText(o).width + 28 }));
    const total = 70 + items.reduce((a, b) => a + b.w + 14, 0);
    let x = (W - total) / 2;
    const y = headerH + 26;
    ctx.fillStyle = '#5f6670';
    ctx.font = '600 18px Inter';
    ctx.fillText('Avec', x, y + 30);
    x += 70;
    for (const it of items) {
      roundRect(ctx, x, y, it.w, 46, 23);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#E8E2D6';
      ctx.lineWidth = 2;
      ctx.stroke();
      circleImage(ctx, logos[it.o], x + 25, y + 23, 17, '#E8E2D6');
      ctx.fillStyle = NAVY;
      ctx.font = '600 18px Inter';
      ctx.fillText(it.o, x + 50, y + 30);
      x += it.w + 14;
    }
  }

  // Colonnes des jours
  days.forEach(({ d, list }, i) => {
    const x = margin + i * (colW + gap);
    roundRect(ctx, x, gridTop, colW, gridH, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#E8E2D6';
    ctx.lineWidth = 2;
    ctx.stroke();
    // pastille du jour
    roundRect(ctx, x + 12, gridTop + 12, colW - 24, 46, 14);
    const dg = ctx.createLinearGradient(x, 0, x + colW, 0);
    dg.addColorStop(0, GOLD_DARK);
    dg.addColorStop(1, GOLD);
    ctx.fillStyle = dg;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '700 20px Inter';
    const wd = new Date(`${d}T12:00:00Z`).getUTCDay();
    ctx.fillText(`${WEEKDAYS_FR[wd]} ${Number(d.slice(8))}`, x + colW / 2, gridTop + 42);
    // cours
    let y = gridTop + 74;
    list.forEach((c: any, k: number) => {
      const h = cardHeights[i][k];
      roundRect(ctx, x + 10, y, colW - 20, h, 16);
      ctx.fillStyle = '#FBF7EE';
      ctx.fill();
      const cx = x + colW / 2;
      const { il, fr } = dualTimes(c.start);
      let ty = y + 34;
      ctx.fillStyle = NAVY;
      ctx.font = '700 28px Inter';
      ctx.fillText(fr.replace(':', 'h'), cx, ty);
      ty += 24;
      ctx.fillStyle = '#7a7f87';
      ctx.font = '500 16px Inter';
      ctx.fillText(`(${il.replace(':', 'h')} Israël)`, cx, ty);
      ty += 30;
      ctx.fillStyle = GOLD_DARK;
      ctx.font = '700 17px Inter';
      for (const l of wrap(ctx, teacherName(c.teacherId).toUpperCase(), colW - pad * 2, 2)) {
        ctx.fillText(l, cx, ty);
        ty += 21;
      }
      ty += 6;
      ctx.fillStyle = '#262626';
      ctx.font = '400 16px Inter';
      for (const l of wrap(ctx, c.title, colW - pad * 2, 5)) {
        ctx.fillText(l, cx, ty);
        ty += 21;
      }
      if (c.organizer) {
        circleImage(ctx, logos[c.organizer], cx, ty + 12, 14, '#E8E2D6');
      }
      y += h + 12;
    });
  });
  ctx.textAlign = 'left';

  // Pied
  const fy = H - footerH;
  const fg = ctx.createLinearGradient(0, fy, W, H);
  fg.addColorStop(0, NAVY);
  fg.addColorStop(1, NAVY2);
  ctx.fillStyle = fg;
  ctx.fillRect(0, fy, W, footerH);
  ctx.fillStyle = bar;
  ctx.fillRect(0, fy, W, 6);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 38px Fraunces';
  ctx.fillText('LILMOD', margin, fy + 62);
  ctx.font = '700 22px Inter';
  const live = 'La Torah en LIVE';
  ctx.fillText(live, margin + 190, fy + 56);
  const lw = ctx.measureText(live).width;
  ctx.fillStyle = '#E53935';
  ctx.beginPath();
  ctx.arc(margin + 190 + lw + 18, fy + 49, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '400 19px Inter';
  ctx.fillText('Programme, liens et replays sur lilmod.fr', margin + 190, fy + 90);
  if (tmLogo) {
    const h = 74;
    const w = (tmLogo.width / tmLogo.height) * h;
    ctx.drawImage(tmLogo, W - margin - w, fy + (footerH - h) / 2 + 3, w, h);
  }
}

export default function PosterPanel({ data, weekStart, flash, onSaved }: any) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState('');
  const render = useCallback(async () => {
    if (ref.current && data) await drawPoster(ref.current, { courses: data.courses || [], teachers: data.teachers || [], weekStart, parasha: data.parasha });
  }, [data, weekStart]);
  useEffect(() => {
    render();
  }, [render]);

  const download = () => {
    const a = document.createElement('a');
    a.href = ref.current!.toDataURL('image/png');
    a.download = `lilmod-programme-${weekStart}.png`;
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
        <button type="button" className={btn.outline} onClick={download}>
          <Download className="h-4 w-4" aria-hidden="true" /> Télécharger (WhatsApp, Instagram)
        </button>
        <button type="button" className={btn.outline} onClick={render} aria-label="Redessiner">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {data.poster && <p className="text-xs text-green-700">✓ Une affiche est déjà dans la newsletter de cette semaine.</p>}
    </div>
  );
}
