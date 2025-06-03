
export const fetchShabbatTimes = async () => {
  try {
    console.log('Fetching Shabbat times...');
    
    // Données simulées pour les horaires de Chabbat - Paracha Nasso
    const mockData = {
      paracha: {
        name: 'Nasso',
        hebrewName: 'נָשֹׂא',
        dateRange: '1-7 Juin 2025'
      },
      france: [
        {
          city: 'Paris',
          entree: '21:04',
          sortie: '22:23'
        },
        {
          city: 'Lyon',
          entree: '20:53',
          sortie: '22:09'
        },
        {
          city: 'Marseille',
          entree: '20:32',
          sortie: '21:41'
        },
        {
          city: 'Toulouse',
          entree: '20:50',
          sortie: '22:02'
        },
        {
          city: 'Strasbourg',
          entree: '21:12',
          sortie: '22:35'
        }
      ],
      israel: [
        {
          city: 'Jérusalem',
          entree: '19:05',
          sortie: '20:21'
        },
        {
          city: 'Tel Aviv',
          entree: '19:22',
          sortie: '20:22'
        },
        {
          city: 'Haïfa',
          entree: '19:21',
          sortie: '20:24'
        },
        {
          city: 'Beer Sheva',
          entree: '19:16',
          sortie: '20:17'
        },
        {
          city: 'Netanya',
          entree: '19:21',
          sortie: '20:22'
        }
      ]
    };

    return mockData;
  } catch (error) {
    console.error('Error fetching Shabbat times:', error);
    return {
      paracha: { name: 'Nasso', hebrewName: 'נָשֹׂא', dateRange: '1-7 Juin 2025' },
      france: [],
      israel: []
    };
  }
};
