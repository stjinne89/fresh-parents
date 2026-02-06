import React from 'react';
import Link from 'next/link';
import { ChefHat, Wind, BookOpen, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/utils/supabase';

// Zorgt dat nieuwe berichten/recepten direct zichtbaar zijn
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Haal alle RECEPTEN op
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Haal alle PUBLIEKE TIPS op (links en rechts)
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .in('target', ['public_left', 'public_right']) 
    .order('created_at', { ascending: false });

  const leftTips = (tips || []).filter(t => t.target === 'public_left');
  const rightTips = (tips || []).filter(t => t.target === 'public_right');

  const TipCard = ({ tip }: { tip: any }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-4 break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-start gap-3">
        <span className="text-2xl pt-1 filter drop-shadow-sm">{tip.emoji}</span>
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">{tip.author}</h4>
          <p className="text-slate-600 text-sm leading-relaxed italic">"{tip.message}"</p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm/50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <ChefHat className="text-emerald-700" size={20} />
            </div>
            {/* HIER STAAT HIJ WEER: Hello Fresh Parents */}
            <span className="font-black text-slate-800 tracking-tight hidden xs:block">Hello Fresh Parents</span>
          </div>
          <div className="flex gap-2">
            <Link href="/sebas" className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100 text-xs font-bold uppercase rounded-lg transition-colors">
              Sebas
            </Link>
            <Link href="/janieke" className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 text-xs font-bold uppercase rounded-lg transition-colors">
              Janieke
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* INTRO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            Survival Gids & <span className="text-emerald-600">Recepten</span>
          </h1>
          <p className="text-slate-600 font-medium max-w-lg mx-auto">
            Voor Sebas & Janieke. Omdat koken met een baby topsport is.
          </p>
        </div>

        {/* --- DE ACTIE KNOPPEN (FIX VOOR MOBIEL) --- */}
        {/* flex-col = onder elkaar op mobiel. sm:flex-row = naast elkaar op pc */}
        <div className="mb-10 flex flex-col sm:flex-row justify-center items-center gap-4">
           
           {/* KNOP 1: Recept */}
           <Link 
            href="/add-recipe"
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:scale-105 transition-all"
          >
            <BookOpen size={18} />
            <span>Nieuw Recept</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </Link>

          {/* KNOP 2: Berichtje */}
          <Link 
            href="/add-tip"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-800 hover:text-slate-900 transition-all"
          >
            <Send size={18} />
            <span>Berichtje Achterlaten</span>
          </Link>

        </div>

        {/* --- DE MASONRY GRID (3 KOLOMMEN) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">

          {/* KOLOM 1: TIPS LINKS */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 px-1 opacity-50">
               <MessageCircle size={14} />
               <span className="text-xs font-black uppercase tracking-widest">Support Links</span>
            </div>
            {leftTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
             {/* Fallback als er niks is */}
            {leftTips.length === 0 && <div className="hidden lg:block text-center text-slate-300 text-sm py-10 italic">Nog stil hier...</div>}
          </div>

          {/* KOLOM 2: RECEPTEN (MIDDEN) */}
          <div className="flex flex-col gap-6 order-first lg:order-none"> 
             <div className="flex items-center gap-2 mb-2 px-1 opacity-50">
               <Wind size={14} />
               <span className="text-xs font-black uppercase tracking-widest">Recepten</span>
            </div>
            
            {(recipes || []).map((recipe: any) => (
              <Link href={`/recipe/${recipe.id}`} key={recipe.id} className="block group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-500 transition-all">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {recipe.image ? (
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300"><ChefHat size={40}/></div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm border border-slate-100 flex items-center gap-1">
                      ⏱ {recipe.time}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {recipe.one_liner}
                    </p>
                  </div>
                </article>
              </Link>
            ))}

            {(!recipes || recipes.length === 0) && (
              <div className="text-center p-10 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400 font-medium">Nog geen recepten...</p>
              </div>
            )}
          </div>

          {/* KOLOM 3: TIPS RECHTS */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 px-1 opacity-50">
               <MessageCircle size={14} />
               <span className="text-xs font-black uppercase tracking-widest">Support Rechts</span>
            </div>
            {rightTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
             {rightTips.length === 0 && <div className="hidden lg:block text-center text-slate-300 text-sm py-10 italic">Nog stil hier...</div>}
          </div>

        </div>
      </div>
    </main>
  );
}