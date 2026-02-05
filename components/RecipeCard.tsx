import React from 'react';
import { Clock, ChefHat } from 'lucide-react';
import Image from 'next/image';

type RecipeProps = {
  title: string;
  time: string;
  difficulty: string;
  image: string;
  oneLiner: string;
};

export default function RecipeCard({ title, time, difficulty, image, oneLiner }: RecipeProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100">
      <div className="relative h-48 w-full">
        <Image 
  src={image} 
  alt={title} 
  fill 
  unoptimized={true} // <--- Voeg dit toe. Dit forceert de afbeelding altijd te laden.
  className="object-cover group-hover:scale-105 transition-transform duration-500"
/>
        {/* Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-emerald-700 shadow-sm">
          {difficulty}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{oneLiner}</p>
        
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {time}
          </div>
          <div className="flex items-center gap-1">
            <ChefHat size={14} />
            Vers Ouderschap
          </div>
        </div>
      </div>
    </div>
  );
}