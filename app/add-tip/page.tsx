'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, User, Lock, Globe } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function AddTipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    author: '',
    target: 'public_random', // default
    title: '', // Alleen nodig voor privé
    message: '',
    emoji: '👋'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Randomize publieke kant als de gebruiker niet specifiek koos
    let finalTarget = formData.target;
    if (formData.target === 'public_random') {
      finalTarget = Math.random() > 0.5 ? 'public_left' : 'public_right';
    }

    const { error } = await supabase
      .from('tips')
      .insert([
        {
          author: formData.author,
          target: finalTarget,
          title: formData.title || 'Berichtje', // Fallback
          message: formData.message,
          emoji: formData.emoji
        }
      ]);

    if (error) {
      alert('Er ging iets mis. Probeer het opnieuw.');
      console.error(error);
    } else {
      alert('Bericht verstuurd! Bedankt 💌');
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isPrivate = formData.target === 'sebas' || formData.target === 'janieke';

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-sm">
            <ArrowLeft size={18} /> Terug
          </Link>
          <h1 className="font-bold text-slate-800">Nieuw Bericht</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Voor wie? */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Voor wie is dit?</label>
              <div className="grid grid-cols-1 gap-3">
                
                {/* Publiek Optie */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.target.includes('public') ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input type="radio" name="target" value="public_random" checked={formData.target === 'public_random' || formData.target.includes('public_')} onChange={handleChange} className="hidden" />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.target.includes('public') ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">De Vriendenmuur</span>
                    <span className="text-xs text-slate-500">Zichtbaar voor iedereen op de homepage</span>
                  </div>
                </label>

                {/* Sebas Optie */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.target === 'sebas' ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input type="radio" name="target" value="sebas" checked={formData.target === 'sebas'} onChange={handleChange} className="hidden" />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.target === 'sebas' ? 'bg-sky-200 text-sky-800' : 'bg-slate-100 text-slate-400'}`}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Alleen voor Sebas</span>
                    <span className="text-xs text-slate-500">Verschijnt in zijn afgeschermde omgeving</span>
                  </div>
                </label>

                {/* Janieke Optie */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.target === 'janieke' ? 'border-rose-500 bg-rose-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input type="radio" name="target" value="janieke" checked={formData.target === 'janieke'} onChange={handleChange} className="hidden" />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.target === 'janieke' ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-400'}`}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Alleen voor Janieke</span>
                    <span className="text-xs text-slate-500">Verschijnt in haar afgeschermde omgeving</span>
                  </div>
                </label>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* 2. Inhoud */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Je Naam</label>
                <input required name="author" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-slate-400" placeholder="Ome Henk" />
              </div>

              {/* Titel alleen tonen bij privé bericht */}
              {isPrivate && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Onderwerp / Titel</label>
                  <input required name="title" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-slate-400" placeholder="Even een hart onder de riem..." />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Je Boodschap</label>
                <textarea required name="message" rows={3} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-slate-400" placeholder="Typ hier je tip of wens..." />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kies een Emoji</label>
                <select name="emoji" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-xl">
                  <option>👋</option>
                  <option>❤️</option>
                  <option>👶</option>
                  <option>🍼</option>
                  <option>😴</option>
                  <option>💪</option>
                  <option>🍷</option>
                  <option>☕️</option>
                  <option>🍕</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Versturen...' : <><Send size={18} /> Verstuur Bericht</>}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}