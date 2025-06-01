
/**
 * Service pour récupérer les horaires de Chabbat depuis les sites fournis
 */

// Fonction pour récupérer la paracha actuelle
const getCurrentParacha = () => {
  // En production, ceci devrait récupérer depuis les sites fournis
  // Pour l'instant, nous utilisons une logique de calcul basique
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  
  // Liste des parachot dans l'ordre (exemple pour 2025)
  const parachot = [
    "Berechit", "Noah", "Lech Lecha", "Vayera", "Chayei Sarah", "Toldot",
    "Vayetse", "Vayishlach", "Vayeshev", "Miketz", "Vayigash", "Vayechi",
    "Shemot", "Vaera", "Bo", "Beshalach", "Yitro", "Mishpatim", "Teruma",
    "Tetzave", "Ki Tissa", "Vayakhel", "Pekudei", "Vayikra", "Tzav",
    "Shemini", "Tazria", "Metzora", "Achrei Mot", "Kedoshim", "Emor",
    "Behar", "Bechukotai", "Bamidbar", "Nasso", "Beha'alotcha", "Shlach",
    "Korach", "Chukat", "Balak", "Pinchas", "Matot", "Masei", "Devarim",
    "Vaetchanan", "Ekev", "Re'eh", "Shoftim", "Ki Tetze", "Ki Tavo", "Nitzavim"
  ];
  
  // Calculer quelle paracha nous sommes (approximatif)
  // En juin 2025, nous devrions être autour de Nasso
  const parachaIndex = (weekNumber + 33) % parachot.length; // Ajustement pour juin
  return parachot[parachaIndex] || "Nasso";
};

// Fonction pour récupérer les horaires de Chabbat actuels
export const fetchShabbatTimes = async () => {
  try {
    console.log("Fetching Shabbat times...");
    
    // En production, ces données seraient récupérées via les APIs des sites fournis
    // https://calendrier-hebraique.fr/horaire-chabbat/ pour la France
    // https://www.torah-box.com/calendrier/chabbat/toulouse-france_6.html pour Toulouse
    
    const currentDate = new Date();
    const fridayDate = new Date(currentDate);
    fridayDate.setDate(currentDate.getDate() + (5 - currentDate.getDay()));
    const saturdayDate = new Date(fridayDate);
    saturdayDate.setDate(fridayDate.getDate() + 1);
    
    const paracha = getCurrentParacha();
    
    return {
      paracha: {
        name: paracha,
        hebrewName: getHebrewName(paracha),
        dateRange: `${fridayDate.toLocaleDateString('fr-FR')} - ${saturdayDate.toLocaleDateString('fr-FR')}`
      },
      france: [
        { city: "Paris", entree: "21:15", sortie: "22:31" },
        { city: "Lyon", entree: "20:58", sortie: "22:14" },
        { city: "Marseille", entree: "20:38", sortie: "21:54" },
        { city: "Nice", entree: "20:33", sortie: "21:49" },
        { city: "Toulouse", entree: "21:05", sortie: "22:21" },
        { city: "Strasbourg", entree: "21:20", sortie: "22:36" },
        { city: "Bordeaux", entree: "21:12", sortie: "22:28" },
        { city: "Lille", entree: "21:25", sortie: "22:41" }
      ],
      israel: [
        { city: "Jérusalem", entree: "19:08", sortie: "20:24" },
        { city: "Tel-Aviv", entree: "19:18", sortie: "20:34" },
        { city: "Netanya", entree: "19:15", sortie: "20:31" },
        { city: "Ashdod", entree: "19:16", sortie: "20:32" },
        { city: "Haïfa", entree: "19:20", sortie: "20:36" },
        { city: "Beer-Sheva", entree: "19:12", sortie: "20:28" },
        { city: "Eilat", entree: "19:05", sortie: "20:21" }
      ]
    };
  } catch (error) {
    console.error("Error fetching Shabbat times:", error);
    throw error;
  }
};

// Fonction utilitaire pour obtenir le nom hébreu de la paracha
const getHebrewName = (parachaName) => {
  const hebrewNames = {
    "Berechit": "בראשית",
    "Noah": "נח",
    "Lech Lecha": "לך לך",
    "Vayera": "וירא",
    "Chayei Sarah": "חיי שרה",
    "Toldot": "תולדות",
    "Vayetse": "ויצא",
    "Vayishlach": "וישלח",
    "Vayeshev": "וישב",
    "Miketz": "מקץ",
    "Vayigash": "ויגש",
    "Vayechi": "ויחי",
    "Shemot": "שמות",
    "Vaera": "וארא",
    "Bo": "בא",
    "Beshalach": "בשלח",
    "Yitro": "יתרו",
    "Mishpatim": "משפטים",
    "Teruma": "תרומה",
    "Tetzave": "תצוה",
    "Ki Tissa": "כי תשא",
    "Vayakhel": "ויקהל",
    "Pekudei": "פקודי",
    "Vayikra": "ויקרא",
    "Tzav": "צו",
    "Shemini": "שמיני",
    "Tazria": "תזריע",
    "Metzora": "מצורע",
    "Achrei Mot": "אחרי מות",
    "Kedoshim": "קדושים",
    "Emor": "אמור",
    "Behar": "בהר",
    "Bechukotai": "בחקתי",
    "Bamidbar": "במדבר",
    "Nasso": "נשא",
    "Beha'alotcha": "בהעלתך",
    "Shlach": "שלח",
    "Korach": "קרח",
    "Chukat": "חקת",
    "Balak": "בלק",
    "Pinchas": "פינחס",
    "Matot": "מטות",
    "Masei": "מסעי",
    "Devarim": "דברים",
    "Vaetchanan": "ואתחנן",
    "Ekev": "עקב",
    "Re'eh": "ראה",
    "Shoftim": "שופטים",
    "Ki Tetze": "כי תצא",
    "Ki Tavo": "כי תבוא",
    "Nitzavim": "נצבים"
  };
  
  return hebrewNames[parachaName] || parachaName;
};
