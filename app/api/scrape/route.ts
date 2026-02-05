import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Geen URL opgegeven' }, { status: 400 });
    }

    // 1. Haal de HTML op (met een fake User-Agent)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error('Kon de pagina niet laden');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 2. Zoek naar JSON-LD script tags (gestructureerde data)
    let recipeData: any = null;

    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const content = $(element).html();
        if (!content) return;
        
        const json = JSON.parse(content);
        
        // Helper functie om het recept object te vinden in de JSON structuren
        const findRecipe = (data: any): any => {
          if (Array.isArray(data)) {
            return data.find(item => item['@type'] === 'Recipe' || item['@type']?.includes('Recipe'));
          }
          if (data['@graph']) {
            return findRecipe(data['@graph']);
          }
          if (data['@type'] === 'Recipe' || data['@type']?.includes('Recipe')) {
            return data;
          }
          return null;
        };

        const found = findRecipe(json);
        if (found) {
          recipeData = found;
          return false; // Stop de loop als we iets hebben
        }
      } catch (e) {
        // Negeer parse errors
      }
    });

    // 3. Fallback: Als we geen JSON-LD vinden, probeer meta tags
    if (!recipeData) {
      recipeData = {
        name: $('meta[property="og:title"]').attr('content') || $('h1').first().text().trim(),
        image: $('meta[property="og:image"]').attr('content'),
        description: $('meta[property="og:description"]').attr('content'),
      };
    }

    if (!recipeData || !recipeData.name) {
      return NextResponse.json({ error: 'Geen recept gevonden op deze pagina' }, { status: 404 });
    }

    // 4. Data formatteren en schoonmaken
    
    // Tijd omzetten (PT1H30M -> 1u 30m)
    const parseDuration = (duration: string) => {
      if (!duration || typeof duration !== 'string' || !duration.startsWith('P')) return '';
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      if (!match) return '';
      const h = match[1] ? `${match[1]}u ` : '';
      const m = match[2] ? `${match[2]}m` : '';
      return (h + m).trim();
    };

    // Instructies verwerken
    let stepsRaw = recipeData.recipeInstructions || [];
    let steps: string[] = [];
    
    if (typeof stepsRaw === 'string') {
      steps = [stepsRaw];
    } else if (Array.isArray(stepsRaw)) {
      steps = stepsRaw.map((s: any) => {
        if (typeof s === 'string') return s;
        if (s.text) return s.text;
        if (s.itemListElement) return s.itemListElement.map((i:any) => i.text).join('\n');
        return '';
      }).flat().filter(s => s);
    }

    // Ingrediënten verwerken
    let ingredients = recipeData.recipeIngredient || [];
    if (typeof ingredients === 'string') ingredients = ingredients.split(',');

    // Afbeelding verwerken
    let image = recipeData.image;
    if (Array.isArray(image)) image = image[0];
    if (typeof image === 'object' && image.url) image = image.url;

    // Response bouwen
    const cleanedData = {
      title: recipeData.name || '',
      image: image || '',
      description: recipeData.description || '',
      time: parseDuration(recipeData.totalTime) || parseDuration(recipeData.cookTime) || '',
      ingredients: ingredients,
      steps: steps
    };

    return NextResponse.json(cleanedData);

  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: 'Er ging iets mis bij het scrapen.' }, { status: 500 });
  }
}