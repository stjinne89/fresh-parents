'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

type AuthGateProps = {
  targetName: 'sebas' | 'janieke'; 
  requiredCode: string; // <--- NIEUW: De code komt van buitenaf
  children: React.ReactNode;      
};

export default function AuthGate({ targetName, requiredCode, children }: AuthGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);
  
  // Check bij laden of ze al eens hebben ingelogd in deze sessie
  useEffect(() => {
    // We checken de localStorage specifiek voor deze persoon
    const status = localStorage.getItem(`unlocked_${targetName}`);
    if (status === 'true') {
      setIsUnlocked(true);
    }
  }, [targetName]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    // We vergelijken de invoer met de requiredCode prop
    if (inputCode === requiredCode) {
      setIsUnlocked(true);
      // Sla op dat deze specifieke gate open is
      localStorage.setItem(`unlocked_${targetName}`, 'true');
      setError(false);
    } else {
      setError(true);
      setInputCode('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  // Het Login Scherm
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Lock size={32} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-800 mb-2">
          Hoi {targetName.charAt(0).toUpperCase() + targetName.slice(1)}!
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          Dit gedeelte is strikt geheim. Vul je persoonlijke code in.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="tel" 
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full text-center text-3xl font-bold tracking-[0.5em] p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 outline-none transition-colors placeholder:tracking-normal"
            placeholder="****"
          />
          
          {error && (
            <p className="text-rose-500 text-xs font-bold animate-pulse">
              Foute code! Probeer het opnieuw.
            </p>
          )}

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            Open Kluis <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}