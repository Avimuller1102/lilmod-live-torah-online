
/**
 * Service pour récupérer les podcasts Spotify
 */

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    const showUrl = "https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR";
    
    try {
      // Utiliser un proxy CORS pour accéder à Spotify
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(showUrl)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Spotify data');
      }
      
      const data = await response.json();
      
      // Parser la réponse HTML pour extraire les informations des épisodes
      const html = data.contents;
      const episodeData = extractEpisodeInfo(html);
      
      return episodeData.slice(0, maxResults).map(episode => ({
        id: episode.id,
        title: episode.title,
        duration: episode.duration || "45:00",
        publishedAt: episode.publishedAt || new Date().toISOString(),
        teacher: episode.teacher || "Enseignant LILMOD",
        url: `https://open.spotify.com/episode/${episode.id}`,
        description: episode.description || "Cours hebdomadaire LILMOD",
        imageUrl: episode.imageUrl || "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      }));
    } catch (error) {
      console.error("Error fetching from Spotify API:", error);
      
      // En cas d'erreur, retourner des données simulées mais avec des titres plus actuels
      return [
        {
          id: "ep1",
          title: "Le Midrash et ses enseignements modernes",
          duration: "52:14",
          publishedAt: "2023-05-10",
          teacher: "Rav Botshko",
          url: showUrl,
          description: "Étude approfondie du Midrash et de ses applications dans le monde moderne",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        },
        {
          id: "ep2",
          title: "Paracha Behar - Les lois de l'agriculture en Israël",
          duration: "45:30",
          publishedAt: "2023-05-08",
          teacher: "Rav Elie KLING",
          url: showUrl,
          description: "Analyse des lois agricoles dans la paracha Behar",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        },
        {
          id: "ep3",
          title: "Lag Ba'Omer - La lumière du Zohar",
          duration: "60:12",
          publishedAt: "2023-05-06",
          teacher: "Rav Chouraqui",
          url: showUrl,
          description: "Enseignements profonds sur la signification de Lag Ba'Omer et la sagesse du Zohar",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        },
        {
          id: "ep4",
          title: "La Liberté selon la pensée juive",
          duration: "48:25",
          publishedAt: "2023-05-04",
          teacher: "Rav Ouziel",
          url: showUrl,
          description: "Comprendre le concept de liberté dans la tradition juive",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        },
        {
          id: "ep5",
          title: "Le rôle d'Israël dans le monde contemporain",
          duration: "55:18",
          publishedAt: "2023-05-02",
          teacher: "Ariel Assaf",
          url: showUrl,
          description: "Réflexion sur la place et la mission d'Israël dans le monde actuel",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        },
        {
          id: "ep6",
          title: "Les enseignements du Rav Kook sur l'unité du peuple juif",
          duration: "41:33",
          publishedAt: "2023-04-30",
          teacher: "Rav Ben Ichay",
          url: showUrl,
          description: "Étude des textes du Rav Kook sur l'importance de l'unité du peuple juif",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        },
        {
          id: "ep7",
          title: "La Techouva dans le monde moderne",
          duration: "53:45",
          publishedAt: "2023-04-28",
          teacher: "Georges Spira",
          url: showUrl,
          description: "Réflexion sur le concept de Techouva et son application dans le monde moderne",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        },
        {
          id: "ep8",
          title: "Le message des prophètes pour notre génération",
          duration: "58:20",
          publishedAt: "2023-04-26",
          teacher: "Rav Fizson",
          url: showUrl,
          description: "Étude des textes prophétiques et leur pertinence pour notre génération",
          imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
        }
      ];
    }
  } catch (error) {
    console.error("Error in Spotify service:", error);
    return [];
  }
};

// Fonction pour extraire les informations des épisodes à partir du HTML
function extractEpisodeInfo(html) {
  // Cette fonction est une simplification - en production, il faudrait utiliser un parseur HTML
  // et extraire correctement les données selon la structure de la page Spotify
  try {
    const episodeMatches = html.match(/episode\/(.*?)"/g) || [];
    const titleMatches = html.match(/<a[^>]*data-testid="episodeTitle"[^>]*>(.*?)<\/a>/g) || [];
    
    return episodeMatches.map((match, index) => {
      const id = match.match(/episode\/(.*?)"/)[1];
      let title = "Épisode LILMOD";
      
      if (titleMatches[index]) {
        const titleMatch = titleMatches[index].match(/>([^<]+)</);
        if (titleMatch) {
          title = titleMatch[1];
        }
      }
      
      return {
        id,
        title,
        duration: "45:00",
        publishedAt: new Date().toISOString(),
        teacher: "Enseignant LILMOD",
        url: `https://open.spotify.com/episode/${id}`,
        description: "Cours hebdomadaire LILMOD",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      };
    });
  } catch (error) {
    console.error("Error extracting episode info:", error);
    return [];
  }
}
