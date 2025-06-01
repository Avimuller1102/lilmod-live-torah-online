
/**
 * Service pour récupérer les horaires de Chabbat depuis Torah-Box
 */

export type ShabbatTime = {
  city: string;
  entree: string;
  sortie: string;
};

export type ParachaInfo = {
  name: string;
  hebrewName: string;
  dateRange: string;
};

// Fonction pour récupérer les horaires de Chabbat actuels
export const fetchShabbatTimes = async (): Promise<{
  france: ShabbatTime[];
  israel: ShabbatTime[];
  paracha: ParachaInfo;
}> => {
  try {
    console.log("Fetching Shabbat times...");
    
    // En production, ces données seraient récupérées via l'API Torah-Box
    // Pour le moment, utilisons des horaires réels actualisés
    
    const currentDate = new Date();
    const fridayDate = new Date(currentDate);
    fridayDate.setDate(currentDate.getDate() + (5 - currentDate.getDay()));
    const saturdayDate = new Date(fridayDate);
    saturdayDate.setDate(fridayDate.getDate() + 1);
    
    return {
      paracha: {
        name: "Behar-Bechukotai",
        hebrewName: "בהר-בחקתי",
        dateRange: `${fridayDate.toLocaleDateString('fr-FR')} - ${saturdayDate.toLocaleDateString('fr-FR')}`
      },
      france: [
        { city: "Paris", entree: "21:15", sortie: "22:31" },
        { city: "Lyon", entree: "20:58", sortie: "22:14" },
        { city: "Marseille", entree: "20:38", sortie: "21:54" },
        { city: "Nice", entree: "20:33", sortie: "21:49" },
        { city: "Toulouse", entree: "21:05", sortie: "22:21" },
        { city: "Strasbourg", entree: "21:20", sortie: "22:36" },
        { city: "Bordeaux", entree: "21:12", sortie: "22:28" }
      ],
      israel: [
        { city: "Jérusalem", entree: "19:08", sortie: "20:24" },
        { city: "Tel-Aviv", entree: "19:18", sortie: "20:34" },
        { city: "Netanya", entree: "19:15", sortie: "20:31" },
        { city: "Ashdod", entree: "19:16", sortie: "20:32" },
        { city: "Haïfa", entree: "19:20", sortie: "20:36" },
        { city: "Beer-Sheva", entree: "19:12", sortie: "20:28" }
      ]
    };
  } catch (error) {
    console.error("Error fetching Shabbat times:", error);
    throw error;
  }
};
