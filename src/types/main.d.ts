
 export interface guessedWords {
    word: string;
    letters: guessedWord[];
  }
  
 export interface guessedWord {
    letter: string;
    contains: boolean;
    correct: boolean;
  }

export interface gameSettingsState {
    selectedWordLength: number,
    dark:boolean
  }
  
  export interface markedLetters {
    correct:string[],
    contains:string[],
    wrong:string[],
  }