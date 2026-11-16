import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, MapPin, Moon, RefreshCw, Sparkles, Sun } from 'lucide-react';
import {
  COUNTRY_LABELS,
  SHABBAT_CITIES,
  fetchShabbatCity,
  type ParachaInfo,
  type ShabbatCity,
  type ShabbatTime,
} from '@/services/shabbatService.ts';

const defaultCity = SHABBAT_CITIES.find((city) => city.id === "jerusalem") || SHABBAT_CITIES[0];

const ShabbatTimes = () => {
  const [country, setCountry] = useState(defaultCity.country);
  const [cityId, setCityId] = useState(defaultCity.id);
  const [selectedTime, setSelectedTime] = useState<ShabbatTime | null>(null);
  const [paracha, setParacha] = useState<ParachaInfo | null>(null);
  const [countryTimes, setCountryTimes] = useState<ShabbatTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const citiesForCountry = useMemo(
    () => SHABBAT_CITIES.filter((city) => city.country === country),
    [country]
  );

  const selectedCity = useMemo(
    () => SHABBAT_CITIES.find((city) => city.id === cityId) || citiesForCountry[0] || defaultCity,
    [citiesForCountry, cityId]
  );

  useEffect(() => {
    const firstCity = SHABBAT_CITIES.find((city) => city.country === country);
    if (firstCity && !SHABBAT_CITIES.some((city) => city.id === cityId && city.country === country)) {
      setCityId(firstCity.id);
    }
  }, [country, cityId]);

  const loadTimes = useCallback(async (city: ShabbatCity) => {
    setLoading(true);
    setError(null);

    try {
      const [selected, nearby] = await Promise.all([
        fetchShabbatCity(city),
        Promise.all(citiesForCountry.slice(0, 7).map((item) => fetchShabbatCity(item))),
      ]);

      setSelectedTime(selected.time);
      setParacha(selected.paracha);
      setCountryTimes(nearby.map((item) => item.time));
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les horaires pour cette ville.");
    } finally {
      setLoading(false);
    }
  }, [citiesForCountry]);

  useEffect(() => {
    loadTimes(selectedCity);
  }, [loadTimes, selectedCity]);

  return (
    <section id="shabbat" className="section-padding relative overflow-hidden bg-primary-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(216,174,69,0.25),transparent_28rem),radial-gradient(circle_at_85%_30%,rgba(87,148,230,0.25),transparent_26rem)]" />
      <div className="container-custom relative z-10">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-300/30 bg-accent-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent-200">
              <Sparkles className="h-3.5 w-3.5" />
              Horaires de Chabbat
            </span>
            <h2 className="mt-5 text-balance text-4xl font-black text-white md:text-5xl">
              Les horaires de Chabbat, ville par ville.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-blue-50/80">
              Sélectionnez un pays et une ville pour obtenir l'entrée et la sortie de Chabbat
              synchronisées avec Hebcal, avec la paracha de la semaine.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-blue-50/80">Pays / région</span>
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white backdrop-blur outline-none transition focus:border-accent-300"
                >
                  {COUNTRY_LABELS.map((item) => (
                    <option key={item.id} value={item.id} className="text-neutral-900">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-blue-50/80">Ville</span>
                <select
                  value={cityId}
                  onChange={(event) => setCityId(event.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white backdrop-blur outline-none transition focus:border-accent-300"
                >
                  {citiesForCountry.map((city) => (
                    <option key={city.id} value={city.id} className="text-neutral-900">
                      {city.city}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              onClick={() => loadTimes(selectedCity)}
              disabled={loading}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>

          <div className="premium-card-3d rounded-xl border border-white/20 bg-white/10 p-1 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div className="rounded-lg bg-gradient-to-br from-white/20 to-white/5 p-6 md:p-8">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-accent-200">
                    <MapPin className="h-4 w-4" />
                    {selectedCity.city}, {selectedCity.countryLabel}
                  </div>
                  <h3 className="mt-2 text-3xl font-black text-white">Cette semaine</h3>
                </div>
                <div className="rounded-lg border border-accent-300/30 bg-accent-300/10 px-4 py-3 text-right">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-accent-100">Paracha</div>
                  <div className="mt-1 font-black text-white">{paracha?.name || "Chargement"}</div>
                  <div className="text-sm text-blue-50/70" lang="he" dir="rtl">{paracha?.hebrewName}</div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-300/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <TimePanel
                  icon={Sun}
                  label="Entrée"
                  value={loading ? "..." : selectedTime?.entree || "À confirmer"}
                  caption={selectedTime?.candleLabel || "Allumage des bougies"}
                />
                <TimePanel
                  icon={Moon}
                  label="Sortie"
                  value={loading ? "..." : selectedTime?.sortie || "À confirmer"}
                  caption={selectedTime?.havdalahLabel || "Havdalah"}
                />
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-blue-50/70">
                <CalendarDays className="h-4 w-4 text-accent-200" />
                {paracha?.dateRange || "Calcul de la semaine en cours"}
              </div>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {countryTimes.map((time) => (
                  <div key={`${time.city}-${time.entree}`} className="rounded-lg border border-white/10 bg-primary-900/30 p-3">
                    <div className="font-bold text-white">{time.city}</div>
                    <div className="mt-1 flex items-center justify-between text-sm text-blue-50/75">
                      <span>Entrée {time.entree}</span>
                      <span>Sortie {time.sortie}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TimePanel = ({
  icon: Icon,
  label,
  value,
  caption,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
  caption: string;
}) => (
  <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-xl shadow-black/10">
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-50/70">
        <Icon className="h-4 w-4 text-accent-200" />
        {label}
      </div>
      <Clock3 className="h-5 w-5 text-accent-200" />
    </div>
    <div className="text-5xl font-black tabular-nums text-white">{value}</div>
    <p className="mt-3 line-clamp-2 text-sm leading-6 text-blue-50/70">{caption}</p>
  </div>
);

export default ShabbatTimes;
