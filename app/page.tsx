import Link from 'next/link';
import FriendNote from '@/components/FriendNote';
import RecipeCard from '@/components/RecipeCard';
import { ArrowRight, Plus } from 'lucide-react';
import { supabase } from '@/utils/supabase'; 

// Types definiëren voor data uit DB
type Recipe = {
  id: string;
  title: string;
  time: string;
  difficulty: string;
  image: string;
  one_liner: string;
};

type Tip = {
  id: string; // Supabase ID is string (uuid) of number
  author: string;
  message: string;
  emoji: string;
  target: string;
};

export default async function Home() {
  // 1. DATA OPHALEN: RECEPTEN
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, time, difficulty, image, one_liner')
    .order('created_at', { ascending: false });

  // 2. DATA OPHALEN: PUBLIEKE TIPS
  const { data: tips } = await supabase
    .from('tips')
    .select('*')
    .in('target', ['public_left', 'public_right'])
    .order('created_at', { ascending: false });

  // Fallbacks
  const displayRecipes: Recipe[] = (recipes as Recipe[]) || [];
  const allTips: Tip[] = (tips as Tip[]) || [];

  // Tips verdelen
  const leftFriends = allTips.filter(t => t.target === 'public_left');
  const rightFriends = allTips.filter(t => t.target === 'public_right');

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* GRID LAYOUT: Desktop (Sidebar - Content - Sidebar) */}
      <div className="lg:grid lg:grid-cols-[280px_1fr_280px] gap-8 max-w-[1600px] mx-auto">
        
        {/* --- LEFT RAIL (Desktop Only) --- */}
        <aside className="hidden lg:block pt-24 px-4">
          <div className="sticky top-8 space-y-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-6">Vriendenmuur</h3>
            {leftFriends.map((friend) => (
              <FriendNote key={friend.id} author={friend.author} message={friend.message} emoji={friend.emoji} />
            ))}
          </div>
        </aside>

        {/* --- CENTER CONTENT --- */}
        <div className="pb-20">
          
          {/* Header / Nav */}
          <header className="p-4 flex justify-between items-center mb-8">
            <div className="text-emerald-600 font-black text-xl tracking-tighter">
              Hello<span className="text-slate-800">FreshParents!</span>
            </div>
            <div className="flex gap-2">
               <Link href="/sebas" className="text-xs font-bold text-slate-500 hover:text-emerald-600 px-3 py-2 bg-white rounded-full border border-slate-200 transition-colors">
                 Sebas
               </Link>
               <Link href="/janieke" className="text-xs font-bold text-slate-500 hover:text-emerald-600 px-3 py-2 bg-white rounded-full border border-slate-200 transition-colors">
                 Janieke
               </Link>
            </div>
          </header>

          {/* Hero Section */}
          <section className="px-4 mb-12 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-4">
              ✨ Speciaal voor Bobby's ouders
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Snelle happen voor <br/>
              <span className="text-emerald-600">trage nachten.</span>
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto mb-8 text-lg">
              Geen culinaire hoogstandjes, maar voedzaam overleven. 
              Want koken met slaapgebrek is topsport.
            </p>
            
            <div className="flex justify-center gap-4">
              <Link href="#recepten" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition">
                Bekijk recepten
              </Link>
              <Link href="/add-recipe" className="flex items-center gap-2 bg-white text-emerald-600 border border-emerald-100 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-emerald-50 transition">
                <Plus size={18} /> Nieuw Recept
              </Link>
            </div>
          </section>

          {/* Mobile Friends Carousel (Alleen mobiel) */}
          <section className="lg:hidden mb-12 overflow-x-auto pb-4 px-4 snap-x flex gap-4 no-scrollbar">
            {allTips.map((friend) => (
              <div key={friend.id} className="min-w-[280px] snap-center">
                 <FriendNote author={friend.author} message={friend.message} emoji={friend.emoji} />
              </div>
            ))}
          </section>

          {/* Recipes Grid */}
          <section id="recepten" className="px-4">
             <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Populaire gerechten</h2>
                <span className="text-sm text-emerald-600 font-bold cursor-pointer hover:underline flex items-center gap-1">
                  Alles bekijken <ArrowRight size={16}/>
                </span>
             </div>
             
             {displayRecipes.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {displayRecipes.map((recipe) => (
                   <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="block group">
                      <RecipeCard 
                        title={recipe.title}
                        time={recipe.time}
                        difficulty={recipe.difficulty}
                        image={recipe.image}
                        oneLiner={recipe.one_liner} 
                      />
                   </Link>
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                 <p className="text-slate-400 mb-4">Nog geen recepten gevonden...</p>
                 <Link href="/add-recipe" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
                   <Plus size={18} /> Voeg de eerste toe!
                 </Link>
               </div>
             )}
          </section>

        </div>

        {/* --- RIGHT RAIL (Desktop Only) --- */}
        <aside className="hidden lg:block pt-32 px-4">
           <div className="sticky top-8 space-y-4">
            {rightFriends.map((friend) => (
              <FriendNote key={friend.id} author={friend.author} message={friend.message} emoji={friend.emoji} />
            ))}
             <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-100 mt-8">
               <p className="text-sm text-amber-800 font-bold mb-2">Heb jij ook een tip?</p>
               <Link href="/add-tip" className="inline-block text-xs bg-white text-amber-700 border border-amber-200 px-3 py-2 rounded shadow-sm hover:bg-amber-100 transition">
                 Stuur berichtje
               </Link>
             </div>
           </div>
        </aside>

      </div>
    </main>
  );
}