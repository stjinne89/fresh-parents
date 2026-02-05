export type Tip = {
  id: number;
  category: string;
  title: string;
  content: string;
  icon: string; // Emoji
};

export const privateTips = {
  sebas: [
    {
      id: 1,
      category: "Mentale Reset",
      title: "De 5-minuten douche",
      content: "Het is oké om de douche even niet te horen. Die 5 minuten zijn van jou. Zing hardop.",
      icon: "🚿"
    },
    {
      id: 2,
      category: "Teamwork",
      title: "De 'Ik weet het ook niet' kaart",
      content: "Je hoeft niet altijd de oplossing te hebben. Samen naar een huilende baby kijken en zuchten is ook bonding.",
      icon: "🤝"
    },
    {
      id: 3,
      category: "Energie",
      title: "Cafeïne management",
      content: "Na 16:00 geen koffie meer, anders lig je wakker in de 3 uur die je wél kunt slapen.",
      icon: "☕️"
    },
    // ... voeg hier meer tips toe
  ] as Tip[],
  
  janieke: [
    {
      id: 1,
      category: "Self-care",
      title: "Vraag om hulp",
      content: "Mensen willen helpen, maar weten niet hoe. Geef ze specifieke taken: 'Laad de vaatwasser uit'.",
      icon: "🗣️"
    },
    {
      id: 2,
      category: "Body",
      title: "Jouw tempo",
      content: "Je lichaam heeft net een mens gemaakt. Het hoeft niet morgen weer in shape te zijn. Of volgend jaar.",
      icon: "🧘‍♀️"
    },
     {
      id: 3,
      category: "Slaap",
      title: "Dutjes zijn heilig",
      content: "De was loopt niet weg. Echt niet. Ga liggen.",
      icon: "😴"
    },
    // ... voeg hier meer tips toe
  ] as Tip[]
};