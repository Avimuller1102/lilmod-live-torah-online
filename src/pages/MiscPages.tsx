/**
 * Pages secondaires : recherche, confidentialité, page introuvable.
 */
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { usePublicSettings } from '@/lib/api';
import { PageHero } from '@/components/ui';
import { SearchResults, useSearch } from '@/components/SearchDialog';

export const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const { results, catalog } = useSearch(q);
  useSeo(q ? `Recherche : ${q}` : 'Recherche');
  return (
    <>
      <PageHero eyebrow="Recherche" title="Rechercher dans LILMOD" subtitle="Cours programmés, vidéos, séries, intervenants et thèmes.">
        <form role="search" className="mt-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="q" className="sr-only">Rechercher</label>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 pl-4 shadow-lg">
            <Search className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            <input id="q" type="search" autoFocus value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} placeholder="Ben Ichay, Tefila, Rav Kook…" className="h-11 min-w-0 flex-1 bg-transparent text-base text-neutral-900 focus:outline-none" />
          </div>
        </form>
      </PageHero>
      <section className="section-padding pt-8">
        <div className="container-custom max-w-3xl rounded-2xl bg-white p-3 sm:p-5">
          <SearchResults query={q} results={results} catalog={catalog} limit={20} />
        </div>
      </section>
    </>
  );
};

export const PrivacyPage = () => {
  const settings = usePublicSettings();
  useSeo('Politique de confidentialité', 'Comment LILMOD utilise vos données : newsletter, groupe WhatsApp, formulaire de contact.');
  return (
    <>
      <PageHero eyebrow="Confidentialité" title="Politique de confidentialité" />
      <section className="section-padding pt-10">
        <div className="container-custom max-w-3xl space-y-6 text-[16px] leading-7 text-neutral-800">
          <p>LILMOD (Torah MiTzion) respecte votre vie privée. Cette page explique quelles données sont collectées et pourquoi.</p>
          <h2 className="font-display text-2xl font-semibold">Newsletter (e-mail)</h2>
          <p>L'inscription se fait volontairement via notre formulaire Mailchimp. Votre adresse sert uniquement à vous envoyer le programme des cours et les informations LILMOD. Chaque e-mail contient un lien de désinscription. Mailchimp (Intuit) héberge la liste.</p>
          <h2 className="font-display text-2xl font-semibold">Groupe WhatsApp</h2>
          <p>Rejoindre le groupe est un choix volontaire ; vous pouvez le quitter à tout moment depuis WhatsApp. Nous n'ajoutons personne sans son accord.</p>
          <h2 className="font-display text-2xl font-semibold">Formulaire de contact</h2>
          <p>Les messages envoyés via le formulaire (nom, e-mail, message) sont transmis par Formspree à l'équipe LILMOD pour vous répondre, et ne sont pas utilisés à d'autres fins.</p>
          <h2 className="font-display text-2xl font-semibold">Vidéos et mesure d'audience</h2>
          <p>Les vidéos YouTube ne se chargent que lorsque vous cliquez sur « Lire », en mode de confidentialité renforcée (youtube-nocookie.com). Le site n'utilise pas de cookies publicitaires ni de traceurs de mesure d'audience.</p>
          <h2 className="font-display text-2xl font-semibold">Vos droits</h2>
          <p>Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a className="font-semibold text-primary-700 underline" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.</p>
        </div>
      </section>
    </>
  );
};

export const NotFoundPage = () => {
  useSeo('Page introuvable');
  return (
    <>
      <PageHero eyebrow="Erreur 404" title="Cette page n'existe pas." subtitle="Le lien est peut-être ancien ou mal recopié." />
      <section className="section-padding pt-10">
        <div className="container-custom flex flex-wrap gap-3">
          <Link to="/programme" className="btn-primary">Programme de la semaine</Link>
          <Link to="/cours" className="btn-outline">Les cours en replay</Link>
          <Link to="/" className="btn-outline">Accueil</Link>
        </div>
      </section>
    </>
  );
};
