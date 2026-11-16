export type ShabbatCity = {
  id: string;
  city: string;
  country: string;
  countryLabel: string;
  geonameid: number;
};

export type ShabbatTime = {
  city: string;
  country: string;
  entree: string;
  sortie: string;
  candleLabel: string;
  havdalahLabel: string;
};

export type ParachaInfo = {
  name: string;
  hebrewName: string;
  dateRange: string;
};

type HebcalItem = {
  title: string;
  category: string;
  date: string;
  hebrew?: string;
  memo?: string;
  subcat?: string;
};

type HebcalResponse = {
  title?: string;
  date?: string;
  location?: {
    city?: string;
    country?: string;
  };
  items?: HebcalItem[];
};

export const SHABBAT_CITIES: ShabbatCity[] = [
  { id: "paris", city: "Paris", country: "france", countryLabel: "France", geonameid: 2988507 },
  { id: "lyon", city: "Lyon", country: "france", countryLabel: "France", geonameid: 2996944 },
  { id: "marseille", city: "Marseille", country: "france", countryLabel: "France", geonameid: 2995469 },
  { id: "nice", city: "Nice", country: "france", countryLabel: "France", geonameid: 2990440 },
  { id: "toulouse", city: "Toulouse", country: "france", countryLabel: "France", geonameid: 2972315 },
  { id: "strasbourg", city: "Strasbourg", country: "france", countryLabel: "France", geonameid: 2973783 },
  { id: "bordeaux", city: "Bordeaux", country: "france", countryLabel: "France", geonameid: 3031582 },
  { id: "jerusalem", city: "Jérusalem", country: "israel", countryLabel: "Israël", geonameid: 281184 },
  { id: "tel-aviv", city: "Tel-Aviv", country: "israel", countryLabel: "Israël", geonameid: 293397 },
  { id: "netanya", city: "Netanya", country: "israel", countryLabel: "Israël", geonameid: 294071 },
  { id: "ashdod", city: "Ashdod", country: "israel", countryLabel: "Israël", geonameid: 295629 },
  { id: "haifa", city: "Haïfa", country: "israel", countryLabel: "Israël", geonameid: 294801 },
  { id: "beer-sheva", city: "Beer-Sheva", country: "israel", countryLabel: "Israël", geonameid: 295530 },
  { id: "london", city: "Londres", country: "world", countryLabel: "Monde", geonameid: 2643743 },
  { id: "brussels", city: "Bruxelles", country: "world", countryLabel: "Monde", geonameid: 2800866 },
  { id: "geneva", city: "Genève", country: "world", countryLabel: "Monde", geonameid: 2660646 },
  { id: "montreal", city: "Montréal", country: "world", countryLabel: "Monde", geonameid: 6077243 },
  { id: "new-york", city: "New York", country: "world", countryLabel: "Monde", geonameid: 5128581 },
];

export const COUNTRY_LABELS = [
  { id: "france", label: "France" },
  { id: "israel", label: "Israël" },
  { id: "world", label: "Monde" },
] as const;

export async function fetchShabbatCity(city: ShabbatCity): Promise<{
  time: ShabbatTime;
  paracha: ParachaInfo;
}> {
  const url = `https://www.hebcal.com/shabbat?cfg=json&geonameid=${city.geonameid}&M=on`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Hebcal API error: ${response.status}`);
  }

  const data = (await response.json()) as HebcalResponse;
  const items = data.items || [];
  const candle = items.find((item) => item.category === "candles");
  const havdalah = items.find((item) => item.category === "havdalah");
  const parasha = items.find((item) => item.category === "parashat");

  return {
    time: {
      city: city.city,
      country: city.countryLabel,
      entree: candle ? extractTime(candle.date) : "À confirmer",
      sortie: havdalah ? extractTime(havdalah.date) : "À confirmer",
      candleLabel: "Allumage des bougies",
      havdalahLabel: "Sortie de Chabbat (Havdala)",
    },
    paracha: {
      name: parasha?.title?.replace(/^Parashat\s+/i, "") || "Paracha de la semaine",
      hebrewName: parasha?.hebrew || "",
      dateRange: formatWeekRange(candle?.date, havdalah?.date),
    },
  };
}

export async function fetchShabbatTimes(country = "france"): Promise<{
  times: ShabbatTime[];
  selected: ShabbatTime;
  paracha: ParachaInfo;
}> {
  const cities = SHABBAT_CITIES.filter((city) => city.country === country).slice(0, 7);
  const results = await Promise.all(cities.map((city) => fetchShabbatCity(city)));

  return {
    times: results.map((result) => result.time),
    selected: results[0].time,
    paracha: results[0].paracha,
  };
}

function extractTime(dateString: string): string {
  return dateString.match(/T(\d{2}:\d{2})/)?.[1] || "À confirmer";
}

function formatWeekRange(start?: string, end?: string): string {
  if (!start || !end) return "Cette semaine";

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  });

  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
}
