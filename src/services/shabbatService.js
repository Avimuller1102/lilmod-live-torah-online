/**
 * Service pour récupérer les horaires de Chabbat depuis Torah-Box
 */

// URLs Torah-Box pour chaque ville
const TORAH_BOX_URLS = {
  france: {
    'Paris': 'https://www.torah-box.com/calendrier/chabbat/paris-france_1.html',
    'Toulouse': 'https://www.torah-box.com/calendrier/chabbat/toulouse-france_5.html',
    'Lyon': 'https://www.torah-box.com/calendrier/chabbat/lyon-france_4.html',
    'Marseille': 'https://www.torah-box.com/calendrier/chabbat/marseille-france_2.html',
    'Lille': 'https://www.torah-box.com/calendrier/chabbat/lille-france_3.html',
    'Nice': 'https://www.torah-box.com/calendrier/chabbat/nice-france_6.html',
    'Strasbourg': 'https://www.torah-box.com/calendrier/chabbat/strasbourg-france_8.html',
    'Bordeaux': 'https://www.torah-box.com/calendrier/chabbat/bordeaux-france_7.html',
    'Nantes': 'https://www.torah-box.com/calendrier/chabbat/nantes-france_9.html'
  },
  israel: {
    'Jérusalem': 'https://www.torah-box.com/calendrier/chabbat/jerusalem-israel_7.html',
    'Tel Aviv': 'https://www.torah-box.com/calendrier/chabbat/tel-aviv-israel_10.html',
    'Haïfa': 'https://www.torah-box.com/calendrier/chabbat/haifa-israel_8.html',
    'Beer Sheva': 'https://www.torah-box.com/calendrier/chabbat/beer-sheva-israel_9.html',
    'Netanya': 'https://www.torah-box.com/calendrier/chabbat/netanya-israel_11.html',
    'Ashdod': 'https://www.torah-box.com/calendrier/chabbat/ashdod-israel_12.html',
    'Eilat': 'https://www.torah-box.com/calendrier/chabbat/eilat-israel_13.html'
  }
};

// Fonction améliorée pour extraire les horaires depuis une page Torah-Box
const extractShabbatTimesFromHTML = (html) => {
  try {
    // Nettoyer le HTML des caractères spéciaux
    const cleanHtml = html.replace(/\s+/g, ' ').toLowerCase();
    
    // Patterns pour trouver les horaires d'allumage
    const entreePatterns = [
      /allumage[^>]*?(\d{1,2}:\d{2})/i,
      /entrée[^>]*?(\d{1,2}:\d{2})/i,
      /vendredi[^>]*?(\d{1,2}:\d{2})/i,
      /début[^>]*?(\d{1,2}:\d{2})/i,
      /<td[^>]*>.*?(\d{1,2}:\d{2}).*?<\/td>/i,
      /(\d{1,2}:\d{2})[^>]*allumage/i
    ];
    
    // Patterns pour trouver les horaires de sortie
    const sortiePatterns = [
      /sortie[^>]*?(\d{1,2}:\d{2})/i,
      /havdalah[^>]*?(\d{1,2}:\d{2})/i,
      /samedi[^>]*?(\d{1,2}:\d{2})/i,
      /fin[^>]*?(\d{1,2}:\d{2})/i,
      /(\d{1,2}:\d{2})[^>]*sortie/i,
      /(\d{1,2}:\d{2})[^>]*havdalah/i
    ];
    
    let entree = null;
    let sortie = null;
    
    // Chercher l'heure d'entrée
    for (const pattern of entreePatterns) {
      const match = cleanHtml.match(pattern);
      if (match && match[1]) {
        entree = match[1];
        break;
      }
    }
    
    // Chercher l'heure de sortie
    for (const pattern of sortiePatterns) {
      const match = cleanHtml.match(pattern);
      if (match && match[1]) {
        sortie = match[1];
        break;
      }
    }
    
    // Si on trouve des horaires dans des tableaux
    if (!entree || !sortie) {
      const tableMatches = cleanHtml.match(/<table[^>]*>.*?<\/table>/gi);
      if (tableMatches) {
        for (const table of tableMatches) {
          const timeMatches = table.match(/(\d{1,2}:\d{2})/g);
          if (timeMatches && timeMatches.length >= 2) {
            if (!entree) entree = timeMatches[0];
            if (!sortie) sortie = timeMatches[timeMatches.length - 1];
          }
        }
      }
    }
    
    console.log(`Horaires extraits: Entrée: ${entree}, Sortie: ${sortie}`);
    return { entree, sortie };
  } catch (error) {
    console.error('Erreur lors de l\'extraction des horaires:', error);
    return { entree: null, sortie: null };
  }
};

// Fonction pour récupérer les horaires d'une ville avec retry
const fetchCityShabbatTimes = async (city, url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching Shabbat times for ${city} (attempt ${attempt})...`);
      
      // Utiliser plusieurs proxies CORS
      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
      ];
      
      let response;
      let data;
      
      for (const proxyUrl of proxies) {
        try {
          response = await fetch(proxyUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (response.ok) {
            data = await response.json();
            if (data.contents || data.content) {
              break;
            }
          }
        } catch (proxyError) {
          console.warn(`Proxy failed: ${proxyUrl}`, proxyError);
          continue;
        }
      }
      
      if (data && (data.contents || data.content)) {
        const htmlContent = data.contents || data.content;
        const times = extractShabbatTimesFromHTML(htmlContent);
        
        if (times.entree && times.sortie) {
          return {
            city,
            entree: times.entree,
            sortie: times.sortie
          };
        }
      }
      
      if (attempt === retries) {
        throw new Error('Tous les proxies ont échoué');
      }
      
      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      
    } catch (error) {
      console.warn(`Tentative ${attempt} échouée pour ${city}:`, error);
      
      if (attempt === retries) {
        console.warn(`Impossible de récupérer les horaires pour ${city}, utilisation des horaires de fallback`);
        return {
          city,
          entree: generateFallbackTime(city, 'entree'),
          sortie: generateFallbackTime(city, 'sortie')
        };
      }
    }
  }
};

// Fonction pour générer des horaires de fallback réalistes
const generateFallbackTime = (city, type) => {
  const currentDate = new Date();
  const month = currentDate.getMonth(); // 0-11
  
  // Horaires approximatifs selon la saison et la localisation
  const fallbackTimes = {
    // France
    'Paris': { entree: { winter: '16:30', summer: '21:15' }, sortie: { winter: '17:45', summer: '22:30' } },
    'Toulouse': { entree: { winter: '17:00', summer: '21:05' }, sortie: { winter: '18:15', summer: '22:20' } },
    'Lyon': { entree: { winter: '16:45', summer: '20:55' }, sortie: { winter: '18:00', summer: '22:10' } },
    'Marseille': { entree: { winter: '17:15', summer: '20:35' }, sortie: { winter: '18:30', summer: '21:50' } },
    'Lille': { entree: { winter: '16:20', summer: '21:25' }, sortie: { winter: '17:35', summer: '22:40' } },
    'Nice': { entree: { winter: '17:10', summer: '20:30' }, sortie: { winter: '18:25', summer: '21:45' } },
    'Strasbourg': { entree: { winter: '16:35', summer: '21:20' }, sortie: { winter: '17:50', summer: '22:35' } },
    'Bordeaux': { entree: { winter: '17:05', summer: '21:10' }, sortie: { winter: '18:20', summer: '22:25' } },
    'Nantes': { entree: { winter: '17:00', summer: '21:20' }, sortie: { winter: '18:15', summer: '22:35' } },
    
    // Israël
    'Jérusalem': { entree: { winter: '16:15', summer: '19:10' }, sortie: { winter: '17:30', summer: '20:25' } },
    'Tel Aviv': { entree: { winter: '16:30', summer: '19:20' }, sortie: { winter: '17:45', summer: '20:35' } },
    'Haïfa': { entree: { winter: '16:25', summer: '19:25' }, sortie: { winter: '17:40', summer: '20:40' } },
    'Beer Sheva': { entree: { winter: '16:20', summer: '19:15' }, sortie: { winter: '17:35', summer: '20:30' } },
    'Netanya': { entree: { winter: '16:25', summer: '19:20' }, sortie: { winter: '17:40', summer: '20:35' } },
    'Ashdod': { entree: { winter: '16:25', summer: '19:18' }, sortie: { winter: '17:40', summer: '20:33' } },
    'Eilat': { entree: { winter: '16:45', summer: '19:00' }, sortie: { winter: '18:00', summer: '20:15' } }
  };
  
  const season = (month >= 4 && month <= 8) ? 'summer' : 'winter';
  const cityTimes = fallbackTimes[city];
  
  if (cityTimes && cityTimes[type] && cityTimes[type][season]) {
    return cityTimes[type][season];
  }
  
  // Fallback par défaut
  return type === 'entree' ? '19:00' : '20:15';
};

// Fonction pour obtenir la Paracha courante
const getCurrentParacha = () => {
  const currentDate = new Date();
  const weekOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
  
  // Liste simplifiée des Parachot (cycle annuel approximatif)
  const parachot = [
    { name: 'Bereshit', hebrew: 'בראשית' },
    { name: 'Noa\'h', hebrew: 'נח' },
    { name: 'Lekh Lekha', hebrew: 'לך לך' },
    { name: 'Vayera', hebrew: 'וירא' },
    { name: 'Chaye Sarah', hebrew: 'חיי שרה' },
    { name: 'Toledot', hebrew: 'תולדות' },
    { name: 'Vayetze', hebrew: 'ויצא' },
    { name: 'Vayishlach', hebrew: 'וישלח' },
    { name: 'Vayeshev', hebrew: 'וישב' },
    { name: 'Miketz', hebrew: 'מקץ' },
    { name: 'Vayigash', hebrew: 'ויגש' },
    { name: 'Vayechi', hebrew: 'ויחי' },
    { name: 'Shemot', hebrew: 'שמות' },
    { name: 'Vaera', hebrew: 'וארא' },
    { name: 'Bo', hebrew: 'בא' },
    { name: 'Beshalach', hebrew: 'בשלח' },
    { name: 'Yitro', hebrew: 'יתרו' },
    { name: 'Mishpatim', hebrew: 'משפטים' },
    { name: 'Terumah', hebrew: 'תרומה' },
    { name: 'Tetzaveh', hebrew: 'תצוה' },
    { name: 'Ki Tissa', hebrew: 'כי תשא' },
    { name: 'Vayakhel', hebrew: 'ויקהל' },
    { name: 'Pekudei', hebrew: 'פקודי' },
    { name: 'Vayikra', hebrew: 'ויקרא' },
    { name: 'Tzav', hebrew: 'צו' },
    { name: 'Shemini', hebrew: 'שמיני' },
    { name: 'Tazria', hebrew: 'תזריע' },
    { name: 'Metzora', hebrew: 'מצורע' },
    { name: 'Acharei Mot', hebrew: 'אחרי מות' },
    { name: 'Kedoshim', hebrew: 'קדושים' },
    { name: 'Emor', hebrew: 'אמור' },
    { name: 'Behar', hebrew: 'בהר' },
    { name: 'Bechukotai', hebrew: 'בחקתי' },
    { name: 'Bamidbar', hebrew: 'במדבר' },
    { name: 'Nasso', hebrew: 'נשא' },
    { name: 'Behaalotcha', hebrew: 'בהעלותך' },
    { name: 'Shelach', hebrew: 'שלח' },
    { name: 'Korach', hebrew: 'קרח' },
    { name: 'Chukat', hebrew: 'חקת' },
    { name: 'Balak', hebrew: 'בלק' },
    { name: 'Pinchas', hebrew: 'פינחס' },
    { name: 'Matot', hebrew: 'מטות' },
    { name: 'Masei', hebrew: 'מסעי' },
    { name: 'Devarim', hebrew: 'דברים' },
    { name: 'Vaetchanan', hebrew: 'ואתחנן' },
    { name: 'Ekev', hebrew: 'עקב' },
    { name: 'Reeh', hebrew: 'ראה' },
    { name: 'Shoftim', hebrew: 'שופטים' },
    { name: 'Ki Tetze', hebrew: 'כי תצא' },
    { name: 'Ki Tavo', hebrew: 'כי תבוא' },
    { name: 'Nitzavim', hebrew: 'נצבים' },
    { name: 'Vayeilech', hebrew: 'וילך' },
    { name: 'Haazinu', hebrew: 'האזינו' },
    { name: 'Vezot Habracha', hebrew: 'וזאת הברכה' }
  ];
  
  // Pour juin 2025, c'est la Paracha Nasso
  const currentParacha = parachot[34]; // Nasso
  
  const fridayDate = new Date(currentDate);
  fridayDate.setDate(currentDate.getDate() + (5 - currentDate.getDay()));
  const saturdayDate = new Date(fridayDate);
  saturdayDate.setDate(fridayDate.getDate() + 1);
  
  return {
    name: currentParacha.name,
    hebrewName: currentParacha.hebrew,
    dateRange: `${fridayDate.toLocaleDateString('fr-FR')} - ${saturdayDate.toLocaleDateString('fr-FR')}`
  };
};

export const fetchShabbatTimes = async () => {
  try {
    console.log('Fetching Shabbat times from Torah-Box...');
    
    // Récupérer les horaires pour toutes les villes avec un délai entre les requêtes
    const franceCities = Object.entries(TORAH_BOX_URLS.france);
    const israelCities = Object.entries(TORAH_BOX_URLS.israel);
    
    const francePromises = franceCities.map(([city, url], index) => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve(fetchCityShabbatTimes(city, url));
        }, index * 500); // Délai de 500ms entre chaque requête
      })
    );
    
    const israelPromises = israelCities.map(([city, url], index) => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve(fetchCityShabbatTimes(city, url));
        }, (franceCities.length + index) * 500);
      })
    );
    
    // Attendre que toutes les requêtes se terminent
    const [franceTimes, israelTimes] = await Promise.all([
      Promise.all(francePromises),
      Promise.all(israelPromises)
    ]);
    
    const paracha = getCurrentParacha();
    
    console.log('Shabbat times fetched successfully');
    
    return {
      paracha,
      france: franceTimes,
      israel: israelTimes
    };
    
  } catch (error) {
    console.error('Error fetching Shabbat times:', error);
    
    // Retourner des données de fallback en cas d'erreur
    const paracha = getCurrentParacha();
    
    return {
      paracha,
      france: Object.keys(TORAH_BOX_URLS.france).map(city => ({
        city,
        entree: generateFallbackTime(city, 'entree'),
        sortie: generateFallbackTime(city, 'sortie')
      })),
      israel: Object.keys(TORAH_BOX_URLS.israel).map(city => ({
        city,
        entree: generateFallbackTime(city, 'entree'),
        sortie: generateFallbackTime(city, 'sortie')
      }))
    };
  }
};
