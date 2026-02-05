import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import AuthGate from '@/components/AuthGate';
import { supabase } from '@/utils/supabase';
import { privateTips } from '@/data/privateTips';

export const dynamic = 'force-dynamic'; // <--- DEZE REGEL TOEVOEGEN

export default async function JaniekePage() {
  // 1. Haal data op
  const { data: dbTips } = await supabase
    .from('tips')
    .select('*')
    .eq('target', 'janieke')
    .order('created_at', { ascending: false });

  // 2. Map data
  const dynamicTips = (dbTips || []).map((t: any) => ({
    id: t.id,
    category: `Bericht van ${t.author}`,
    title: t.title,
    content: t.message,
    icon: t.emoji
  }));

  // 3. Samenvoegen
  const allTips = [...dynamicTips, ...privateTips.janieke];

  return (
    <AuthGate targetName="janieke" requiredCode="5678">
      {/* ACHTERGROND: Lichtgrijs (Slate-50) */}
      <main className="min-h-screen bg-slate-50 pb-20"> 
        
        {/* Header: Wit met grijze rand */}
        <header className="bg-white sticky top-0 z-10 border-b border-slate-200">
          <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-slate-500 hover:text-slate-900">
              <ArrowLeft size={24} />
            </Link>
            <span className="font-bold text-slate-900">Janieke's Lounge</span>
            <Heart className="text-slate-900" size={24} />
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-3">Mom's Only</h1>
            <p className="text-slate-600 text-lg font-medium">
              Omdat je het geweldig doet, ook als het niet zo voelt.
            </p>
          </div>

          <div className="space-y-6">
            {allTips.map((tip) => (
              <div 
                key={tip.id} 
                className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{tip.icon}</div>
                  <div>
                    {/* LABEL: Grijs met zwarte tekst (Hoog Contrast) */}
                    <span className="inline-block px-2 py-1 bg-slate-200 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                      {tip.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {tip.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

           <div className="mt-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
            You got this 💪
          </div>
        </div>

      </main>
    </AuthGate>
  );
}