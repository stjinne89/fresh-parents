'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles, Download, Plus } from 'lucide-react';
import { supabase } from '@/utils/supabase';

// --- VOORGEDEFINIEERDE SUGGESTIES ---
const SUGGESTIONS = {
  quickFix: [
    "Gebruik voorgesneden groente uit zak",
    "Koop kant-en-klare saus",
    "Gebruik vleesvervangers (hoeven niet gaar)",
    "Sla de bijgerechten over",
    "Gebruik de snelkookpan"
  ],
  babyCrying: [
    "Zet vuur uit, deksel erop (blijft 20 min warm)",
    "Zet oven op 60 graden (warmhoudstand)",
    "Draagzak om en doorgaan",
    "Partner roept: 'Ik neem het over!'",
    "Zet tv aan voor de oudste"
  ],
  dishwashing: [
    "Alles in één pan (One-pot)",
    "Gebruik bakpapier op de bakplaat",
    "Eet met je handen (wraps/pita)",
    "Gebruik de staafmixer in de pan",
    "Eet direct uit de pan"
  ]
};

export default function AddRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    difficulty: 'Simpel',
    image: '', 
    oneLiner: '',
    ingredients: '', 
    steps: '', 
    tipQuickFix: '',
    tipBabyCrying: '',
    tipDishwashing: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper om een suggestie in het veld te zetten
  const applySuggestion = (field: string, text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
  };

  // --- SCRAPER FUNCTIE ---
  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setScraping(true);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl }),
      });

      const data = await res.json();

      if (data.error) {
        alert('Kon recept niet laden: ' + data.error);
      } else {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          image: data.image || prev.image,
          oneLiner: data.description ? data.description.slice(0, 100) + '...' : prev.oneLiner,
          time: data.time || prev.time,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients.join('\n') : prev.ingredients,
          steps: Array.isArray(data.steps) ? data.steps.join('\n') : prev.steps,
        }));
        alert('Recept data ingeladen!');
      }
    } catch (err) {
      console.error(err);
      alert('Er ging iets mis met ophalen.');
    } finally {
      setScraping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.floor(Math.random() * 1000); 

      const { error } = await supabase
        .from('recipes')
        .insert([
          {
            id: slug,
            title: formData.title,
            time: formData.time,
            difficulty: formData.difficulty,
            image: formData.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
            one_liner: formData.oneLiner, 
            ingredients: formData.ingredients.split('\n').filter(line => line.trim() !== ''),
            steps: formData.steps.split('\n').filter(line => line.trim() !== ''),
            parent_tips: {
              quickFix: formData.tipQuickFix,
              babyCrying: formData.tipBabyCrying,
              dishwashing: formData.tipDishwashing
            }
          }
        ]);

      if (error) throw error;
      alert('Recept succesvol toegevoegd! 🎉');
      router.push('/'); 
      router.refresh(); 

    } catch (error) {
      console.error('Error:', error);
      alert('Er ging iets mis bij het opslaan.');
    } finally {
      setLoading(false);
    }
  };

  // --- STYLING CONSTANTS ---
  const inputClass = "w-full p-3 bg-white rounded-lg border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition-colors";
  const labelClass = "block text-xs font-bold text-slate-700 uppercase mb-1 tracking-wide";
  const chipClass = "inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 cursor-pointer transition-all";

  // Helper component voor de Tip velden
  const renderTipField = (label: string, name: 'tipQuickFix' | 'tipBabyCrying' | 'tipDishwashing', placeholder: string, suggestions: string[]) => (
    <div>
      <label className="block text-xs font-bold text-slate-800 uppercase mb-1">{label}</label>
      <input 
        name={name} 
        value={formData[name]} 
        onChange={handleChange} 
        className={inputClass} 
        placeholder={placeholder} 
      />
      {/* Suggestie Chips */}
      <div className="mt-2 flex flex-wrap gap-2">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applySuggestion(name, suggestion)}
            className={chipClass}
          >
            <Plus size={12} /> {suggestion}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20"> 
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft size={18} /> Terug
          </Link>
          <h1 className="font-bold text-slate-900">Nieuw Recept</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        
        {/* --- IMPORT BLOK --- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-slate-900 font-bold flex items-center gap-2 mb-2 text-lg">
            <Sparkles size={20} className="text-slate-900" /> Geen zin om te typen?
          </h2>
          <p className="text-slate-600 text-sm mb-4 font-medium">
            Plak een link van Allerhande, 24Kitchen, etc. en wij vullen de rest.
          </p>
          <div className="flex gap-2">
            <input 
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder="https://www.ah.nl/allerhande/recept/..."
              className={inputClass}
            />
            <button 
              onClick={handleScrape}
              disabled={scraping || !scrapeUrl}
              className="bg-slate-800 text-white px-6 rounded-xl font-bold text-sm hover:bg-slate-900 disabled:opacity-50 flex items-center gap-2"
            >
              {scraping ? 'Laden...' : <><Download size={18} /> Importeer</>}
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Sectie 1: Basis Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-2">1. De Basis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className={labelClass}>Naam Recept</label>
                <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="Bijv. Snelle Pasta" />
              </div>
              
              <div>
                <label className={labelClass}>Tijd (tekst)</label>
                <input required name="time" value={formData.time} onChange={handleChange} className={inputClass} placeholder="15 min" />
              </div>

              <div>
                <label className={labelClass}>Moeilijkheid</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClass}>
                  <option>Simpel</option>
                  <option>Gemiddeld</option>
                  <option>Uitdagend</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Afbeelding URL</label>
                <input name="image" value={formData.image} onChange={handleChange} className={inputClass} placeholder="https://..." />
                {formData.image && (
                   <div className="mt-4 h-48 w-full relative rounded-xl overflow-hidden border border-slate-200">
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                   </div>
                )}
              </div>

              <div className="col-span-2">
                <label className={labelClass}>De 'Hook' (One-liner)</label>
                <input required name="oneLiner" value={formData.oneLiner} onChange={handleChange} className={inputClass} placeholder="Waarom redt dit je leven?" />
              </div>
            </div>
          </div>

          {/* Sectie 2: Koken */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-2">2. Het Recept</h2>
            
            <div className="mb-6">
              <label className={labelClass}>Ingrediënten</label>
              <textarea required name="ingredients" value={formData.ingredients} onChange={handleChange} rows={6} className={inputClass} placeholder="Elk ingrediënt op een nieuwe regel..." />
            </div>

            <div>
              <label className={labelClass}>Bereiding</label>
              <textarea required name="steps" value={formData.steps} onChange={handleChange} rows={6} className={inputClass} placeholder="Elke stap op een nieuwe regel..." />
            </div>
          </div>

          {/* Sectie 3: Ouder Tips (MET SUGGESTIES) */}
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-xl font-black text-slate-900 mb-2">3. Parents Survival Mode</h2>
            <p className="text-slate-700 font-bold text-sm mb-6">Wat maakt dit recept geschikt voor Sebas & Janieke?</p>
            
            <div className="space-y-6">
              {renderTipField(
                "⚡️ Snelle Variant Tip",
                "tipQuickFix",
                "Wat kun je skippen of kant-en-klaar kopen?",
                SUGGESTIONS.quickFix
              )}

              {renderTipField(
                "😭 Als Bobby huilt...",
                "tipBabyCrying",
                "Hoe zet je dit recept op 'pauze'?",
                SUGGESTIONS.babyCrying
              )}

              {renderTipField(
                "💧 Afwas Hack",
                "tipDishwashing",
                "Hoe maak je minder vies?",
                SUGGESTIONS.dishwashing
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Bezig met versturen...' : <><Save size={22} /> RECEPT INSTUREN</>}
          </button>

        </form>
      </div>
    </main>
  );
}