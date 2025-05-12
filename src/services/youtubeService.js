
/**
 * Service pour récupérer les vidéos YouTube
 */

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (maxResults = 7) => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    const channelId = "UCPmcgKv8vaN9TR7uEGBLPgw"; // ID de la chaîne LILMOD
    const youtubeUrl = "https://www.youtube.com/@Lilmodfr/videos";
    
    try {
      // Utiliser un proxy CORS pour accéder à YouTube
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/@Lilmodfr/videos`)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube data');
      }
      
      const data = await response.json();
      
      // Parser la réponse HTML pour extraire les informations des vidéos
      const html = data.contents;
      const videoData = extractVideoInfo(html);
      
      return videoData.slice(0, maxResults).map(video => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail || "/placeholder.svg",
        publishedAt: video.publishedAt || new Date().toISOString(),
        channelTitle: video.channelTitle || "LILMOD",
        url: `https://www.youtube.com/watch?v=${video.id}`
      }));
    } catch (error) {
      console.error("Error fetching from API:", error);
      
      // En cas d'erreur, retourner des données simulées
      return [
        {
          id: "2OOAvik_LLc",
          title: "Paracha Behar-Beh'oukotaï - Lancer la séquence grande finale",
          thumbnail: "/placeholder.svg",
          publishedAt: "2023-05-11T18:00:00Z",
          channelTitle: "Rav Chalom Zribi",
          url: "https://www.youtube.com/watch?v=2OOAvik_LLc"
        },
        {
          id: "TkqoOoCymYc",
          title: "Après le Omnivers, quoi? - Hasgah'a (1/3)",
          thumbnail: "/placeholder.svg",
          publishedAt: "2023-05-09T18:30:00Z",
          channelTitle: "Rav David Ichay",
          url: "https://www.youtube.com/watch?v=TkqoOoCymYc"
        },
        {
          id: "DPwMMHsvFiI",
          title: "Cours annuel d'hommage à Manitou - Partie 1",
          thumbnail: "/placeholder.svg",
          publishedAt: "2023-05-07T19:00:00Z",
          channelTitle: "Rav Elie MAMOU",
          url: "https://www.youtube.com/watch?v=DPwMMHsvFiI"
        },
        {
          id: "eY3HfnV5Ruc",
          title: "Introduction au Rav Kook - Le mysticisme national",
          thumbnail: "/placeholder.svg",
          publishedAt: "2023-05-05T10:00:00Z",
          channelTitle: "Rav Ben Ishay",
          url: "https://www.youtube.com/watch?v=eY3HfnV5Ruc"
        },
        {
          id: "1zpHJ1MQpA8",
          title: "Paracha Emor - Le jugement a déjà commencé",
          thumbnail: "/placeholder.svg",
          publishedAt: "2023-05-04T18:00:00Z",
          channelTitle: "Rav Chalom Zribi",
          url: "https://www.youtube.com/watch?v=1zpHJ1MQpA8"
        },
        {
          id: "RmSB1hBHokk",
          title: "Les secrets de Lag Baomer",
          thumbnail: "/placeholder.svg",
          publishedAt: "2023-05-02T18:00:00Z",
          channelTitle: "Rav Botshko",
          url: "https://www.youtube.com/watch?v=RmSB1hBHokk"
        },
        {
          id: "ysdO3MHp3xw",
          title: "Le mystère du retour en Terre Sainte",
          thumbnail: "/placeholder.svg",
          publishedAt: "2023-05-01T18:00:00Z",
          channelTitle: "Rav Elie KLING",
          url: "https://www.youtube.com/watch?v=ysdO3MHp3xw"
        }
      ];
    }
  } catch (error) {
    console.error("Error in YouTube service:", error);
    return [];
  }
};

// Fonction pour extraire les informations des vidéos à partir du HTML
function extractVideoInfo(html) {
  // Cette fonction est une simplification - en production, il faudrait utiliser un parseur HTML
  // et extraire correctement les données selon la structure de la page YouTube
  try {
    const videoMatches = html.match(/videoId":"(.*?)"/g) || [];
    const titleMatches = html.match(/"title":{"runs":\[{"text":"(.*?)"}\]}/g) || [];
    
    return videoMatches.map((match, index) => {
      const id = match.match(/videoId":"(.*?)"/)[1];
      let title = "";
      
      if (titleMatches[index]) {
        title = titleMatches[index].match(/"text":"(.*?)"/)[1];
      }
      
      return {
        id,
        title,
        thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
        publishedAt: new Date().toISOString(),
        channelTitle: "LILMOD",
        url: `https://www.youtube.com/watch?v=${id}`
      };
    });
  } catch (error) {
    console.error("Error extracting video info:", error);
    return [];
  }
}
