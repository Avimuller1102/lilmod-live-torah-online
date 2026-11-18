/**
 * Intégration Mailchimp (API Marketing officielle).
 * La clé MAILCHIMP_API_KEY reste côté serveur (variable d'environnement Netlify).
 * Les audiences et abonnés existants sont réutilisés : aucune audience n'est créée.
 */
export function mailchimpConfigured() {
  return Boolean(process.env.MAILCHIMP_API_KEY && /-[a-z]{2}\d+$/.test(process.env.MAILCHIMP_API_KEY));
}

async function mc(path, { method = 'GET', body } = {}) {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!mailchimpConfigured()) {
    throw Object.assign(new Error('Mailchimp non connecté : MAILCHIMP_API_KEY manquante.'), { status: 503 });
  }
  const dc = key.split('-').pop();
  const res = await fetch(`https://${dc}.api.mailchimp.com/3.0${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`lilmod:${key}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw Object.assign(new Error(`Mailchimp : ${data.detail || data.title || res.status}`), { status: 502 });
  return data;
}

export const ping = () => mc('/ping');

/** Audiences existantes (lecture seule) avec leurs tags, pour la configuration. */
export async function listAudiences() {
  const data = await mc('/lists?count=50&fields=lists.id,lists.name,lists.stats.member_count');
  const lists = data.lists || [];
  for (const l of lists) {
    try {
      const tags = await mc(`/lists/${l.id}/segments?type=static&count=100&fields=segments.id,segments.name,segments.member_count`);
      l.tags = tags.segments || [];
    } catch {
      l.tags = [];
    }
  }
  return lists;
}

async function tagSegmentId(audienceId, tagName) {
  if (!tagName) return null;
  const data = await mc(`/lists/${audienceId}/segments?type=static&count=200&fields=segments.id,segments.name`);
  const found = (data.segments || []).find((s) => s.name.toLowerCase() === tagName.toLowerCase());
  if (!found) throw Object.assign(new Error(`Tag Mailchimp « ${tagName} » introuvable dans l'audience.`), { status: 400 });
  return found.id;
}

/** Crée une campagne en brouillon dans Mailchimp (aucun envoi). */
export async function createDraftCampaign({ audienceId, tag, subject, previewText, html, fromName, replyTo, title }) {
  if (!audienceId) throw Object.assign(new Error('Audience Mailchimp non configurée dans les paramètres.'), { status: 400 });
  const recipients = { list_id: audienceId };
  const segmentId = await tagSegmentId(audienceId, tag);
  if (segmentId) recipients.segment_opts = { saved_segment_id: segmentId };
  const campaign = await mc('/campaigns', {
    method: 'POST',
    body: {
      type: 'regular',
      recipients,
      settings: { subject_line: subject, preview_text: previewText, title, from_name: fromName || 'LILMOD', reply_to: replyTo },
    },
  });
  await mc(`/campaigns/${campaign.id}/content`, { method: 'PUT', body: { html } });
  return { id: campaign.id, webId: campaign.web_id };
}

export const sendTest = (campaignId, emails) =>
  mc(`/campaigns/${campaignId}/actions/test`, { method: 'POST', body: { test_emails: emails, send_type: 'html' } });

export const scheduleCampaign = (campaignId, isoTime) =>
  mc(`/campaigns/${campaignId}/actions/schedule`, { method: 'POST', body: { schedule_time: isoTime } });

export const sendNow = (campaignId) => mc(`/campaigns/${campaignId}/actions/send`, { method: 'POST' });

export const campaignStatus = (campaignId) => mc(`/campaigns/${campaignId}?fields=id,status,send_time,emails_sent`);
