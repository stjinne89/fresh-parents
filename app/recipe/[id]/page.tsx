import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, ChefHat, AlertCircle, Droplets, Zap } from 'lucide-react';
import { supabase } from '@/utils/supabase'; // Zorg dat dit pad klopt

// Dit is nodig voor Next.js 15+ om params correct te typen
type Props = {
  params: Promise<{ id: string }>;
};

// We definiëren hier even het type van de data uit Supabase
// zodat TypeScript niet klaagt over de velden.
type RecipeData = {
  id: string;
  title: string;
  image: string;
  time: string;
  difficulty: string;
  one_liner: string; // Let op: snake_case uit DB
  ingredients: string[];
  steps: string[];
  parent_tips: {     // Let op: snake_case uit DB
    quickFix: string;
    babyCrying: string;
    dishwashing: string;
  };
};

export default async function RecipeDetail({ params }: Props) {
  // 1. Haal de ID uit de URL
  const { id } = await params;

  // 2. Haal het recept op uit Supabase
  const { data: recipeData, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Niet gevonden of error? Toon 404
  if (error || !recipeData) {
    console.error('Recept niet gevonden:', error);
    return notFound();
  }

  // We casten de data even naar ons type voor handige autocomplete
  const recipe = recipeData as RecipeData;

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* --- HERO IMAGE --- */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        {/* We gebruiken hier unoptimized={true} voor de zekerheid,
            zodat afbeeldingen altijd laden, ook als config hapert */}
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          unoptimized={true} 
          className="object-cover"
          priority
        />
        {/* Back button overlay */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 bg-white/90 backdrop-blur p-3 rounded-full text-slate-800 hover:bg-white shadow-lg transition-transform hover:scale-105"
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* --- TITLE & META --- */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{recipe.title}</h1>
          {/* Let op: recipe.one_liner met underscore */}
          <p className="text-slate-500 text-lg mb-6 italic">{recipe.one_liner}</p>
          
          <div className="flex gap-6 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2">
              <Clock className="text-emerald-500" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Tijd</p>
                <p className="font-semibold text-slate-700">{recipe.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="text-amber-500" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Niveau</p>
                <p className="font-semibold text-slate-700">{recipe.difficulty}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12">
          
          {/* --- LEFT: INGREDIENTS --- */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              Ingrediënten <span className="text-sm font-normal text-slate-500">(2 pers)</span>
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients?.map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* Sticky "Parent Hack" block for Desktop */}
            <div className="hidden md:block mt-8 bg-amber-50 p-6 rounded-2xl border border-amber-100">
               <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                 <Zap size={20} /> Snelle Variant
               </div>
               {/* Let op: recipe.parent_tips met underscore */}
               <p className="text-sm text-amber-900/80">{recipe.parent_tips?.quickFix}</p>
            </div>
          </div>

          {/* --- RIGHT: STEPS & TIPS --- */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Aan de slag</h3>
              <div className="space-y-8">
                {recipe.steps?.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed mt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- NEW PARENTS SURVIVAL GUIDE --- */}
            <div className="border-t-2 border-dashed border-slate-200 pt-8 mt-12">
              <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                New Parents Survival Guide
              </h3>

              <div className="grid gap-4">
                {/* 1. Crying Baby Tip */}
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <AlertCircle size={100} className="text-rose-500" />
                   </div>
                   <h4 className="font-bold text-rose-700 mb-1 flex items-center gap-2 relative z-10">
                     <AlertCircle size={18} /> Als Bobby huilt...
                   </h4>
                   <p className="text-rose-900/80 text-sm relative z-10">
                     {recipe.parent_tips?.babyCrying}
                   </p>
                </div>

                {/* 2. Dishwashing Tip */}
                <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Droplets size={100} className="text-sky-500" />
                   </div>
                   <h4 className="font-bold text-sky-700 mb-1 flex items-center gap-2 relative z-10">
                     <Droplets size={18} /> Afwas strategie
                   </h4>
                   <p className="text-sky-900/80 text-sm relative z-10">
                     {recipe.parent_tips?.dishwashing}
                   </p>
                </div>

                {/* 3. Quick Fix (Mobile Only fallback) */}
                <div className="md:hidden bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                   <h4 className="font-bold text-amber-700 mb-1 flex items-center gap-2">
                     <Zap size={18} /> Snelle cheat
                   </h4>
                   <p className="text-amber-900/80 text-sm">
                     {recipe.parent_tips?.quickFix}
                   </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}