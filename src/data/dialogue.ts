export interface DialogueFrame {
  id: number;
  speaker: 'knight' | 'dragon' | 'narrator';
  text: string;
  portraitKey: string;
  backgroundKey: string;
}

export const INTRO_DIALOGUE: DialogueFrame[] = [
  {
    id: 1,
    speaker: 'narrator',
    text: 'In einem Land voller Dunkelheit und großer Gefahren begibt sich eine mutige Ritterin auf eine waghalsige Reise... Kann Lady Jana den Fluch der Dunklen Türme brechen und Sir Fabian befreien?',
    portraitKey: 'portrait-knight',
    backgroundKey: 'bg-intro',
  },
  {
    id: 2,
    speaker: 'knight',
    text: "Auf geht's, Tairn! Lass uns Sir Fabian aus dem dunklen Verlies der blassen Informatiker befreien!",
    portraitKey: 'portrait-knight',
    backgroundKey: 'bg-intro',
  },
  {
    id: 3,
    speaker: 'dragon',
    text: '*aufgerechtes Zwitschern* Bereit zum Fliegen!',
    portraitKey: 'portrait-dragon',
    backgroundKey: 'bg-intro',
  },
  {
    id: 4,
    speaker: 'narrator',
    text: 'Gemeinsam steigen Lady Jana und Tairn in die gefährlichen Lüfte auf. Weiche den uralten Säulen und dornigen Ranken aus!',
    portraitKey: 'portrait-knight',
    backgroundKey: 'bg-intro',
  },
];

export const ENDING_DIALOGUE: DialogueFrame[] = [
  {
    id: 1,
    speaker: 'narrator',
    text: 'Die Dunklen Türme stürzen ein, als der Fluch gebrochen wird. Das Licht kehrt ins Land zurück!',
    portraitKey: 'portrait-knight',
    backgroundKey: 'bg-ending',
  },
  {
    id: 2,
    speaker: 'knight',
    text: 'Wir haben es geschafft! Sir Fabian ist befreit.',
    portraitKey: 'portrait-knight',
    backgroundKey: 'bg-ending',
  },
  {
    id: 3,
    speaker: 'dragon',
    text: '*freudiges Brüllen* Geschafft!',
    portraitKey: 'portrait-dragon',
    backgroundKey: 'bg-ending',
  },
];
