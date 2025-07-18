export interface ParachaData {
  name: string;
  hebrew: string;
  verses: string;
  summary: string;
  date: string;
  year: number;
}

// Service pour récupérer la paracha de la semaine depuis Hebcal
export const fetchCurrentParacha = async (): Promise<ParachaData | null> => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    
    // Utiliser l'API Hebcal pour récupérer la paracha actuelle
    const response = await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${today.getMonth() + 1}&gd=${today.getDate()}&g2h=1`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Hebcal API');
    }
    
    const data = await response.json();
    
    // Récupérer la paracha depuis l'API des lectures de la Torah
    const parashaResponse = await fetch(`https://www.hebcal.com/sedrot/${year}?cfg=json`);
    
    if (!parashaResponse.ok) {
      throw new Error('Failed to fetch parasha data');
    }
    
    const parashaData = await parashaResponse.json();
    
    // Trouver la paracha actuelle
    const currentDate = today.toISOString().split('T')[0];
    const currentParasha = parashaData.items?.find((item: any) => {
      const itemDate = new Date(item.date);
      const diffTime = Math.abs(today.getTime() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7; // Paracha de la semaine
    });
    
    if (currentParasha) {
      return {
        name: currentParasha.parsha || 'Paracha de la semaine',
        hebrew: currentParasha.hebrew || '',
        verses: currentParasha.verse || '',
        summary: `Paracha ${currentParasha.parsha}`,
        date: currentParasha.date,
        year: year
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching paracha:', error);
    
    // Fallback avec données par défaut - Paracha Pinhas
    return {
      name: 'Pinhas',
      hebrew: 'פינחס',
      verses: 'Nombres 25:10 - 30:1',
      summary: 'Pinhas reçoit l\'alliance de paix éternelle pour son zèle. Les filles de Tselofhad demandent leur héritage. Nomination de Josué comme successeur de Moïse.',
      date: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear()
    };
  }
};

// Service alternatif utilisant TorahBox API
export const fetchParachaFromTorahBox = async (): Promise<ParachaData | null> => {
  try {
    // TorahBox a une API pour la paracha
    const response = await fetch('https://www.torahbox.com/api/parasha/current');
    
    if (!response.ok) {
      return await fetchCurrentParacha(); // Fallback vers Hebcal
    }
    
    const data = await response.json();
    
    return {
      name: data.name || 'Paracha de la semaine',
      hebrew: data.hebrew || '',
      verses: data.verses || '',
      summary: data.summary || `Paracha ${data.name}`,
      date: data.date || new Date().toISOString().split('T')[0],
      year: new Date().getFullYear()
    };
  } catch (error) {
    console.error('Error fetching from TorahBox:', error);
    return await fetchCurrentParacha(); // Fallback vers Hebcal
  }
};