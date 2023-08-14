import { useState } from "react";
import "../assets/scss/Game.scss";
import JSONDATA from "../assets/words/data";
import leftCat from "../assets/images/nyan-cat.gif";
import BG from "../assets/images/pixel-art-of-80s-retro-sci-fi-background-herbert.jpg";
import Swal from "sweetalert2";

interface guessedWords {
  word: string;
  letters: guessedWord[];
}

interface guessedWord {
  letter: string;
  contains: boolean;
  correct: boolean;
}

const Game = () => {
  const [gamePlaying, setGamePlaying] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [word, setWord] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [guessedWords, setGuessedWords] = useState<guessedWords[]>(
    new Array(6).fill(undefined).map(() => ({
      word: "",
      letters: new Array(4).fill(undefined).map(() => ({
        letter: "",
        contains: false,
        correct: false,
      })),
    }))
  );
  const [guess, setGuess] = useState("");

  const words = JSONDATA;

  const startGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log(Math.floor(Math.random() * words.length));
    setGuessCount(0);
    // setGuessedWords([]);
    setGamePlaying(true);
    setWord(randomWord);
  };

  const checkEndGame = (guess: string) => {
    if (guessCount !== 5) {
      console.log("dah", guess, word);
      if (guess === word) {
        setGameEnded(true);
        Swal.fire({
          title: "You Won!",
          html: `<b>${word}</b> is the correct answer! `,
          width: 600,
          padding: "3em",
          color: "#fff",
          background: `#fff url(${BG})`,
          backdrop: `
            rgba(0,0,123,0.4)
            url(${leftCat})
            left center
            no-repeat
          `,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonColor: "#00ff00cf",
          cancelButtonColor: "#f00000cf",
          confirmButtonText: "Play Again!",
          cancelButtonText: "View Results",
        }).then((result) => {
          if (result.isConfirmed) {
            playAgain();
          }
        });
      }
    } else {
      setGameEnded(true);
      Swal.fire({
        title: "You LOST!",
        html: ` The correct answer was <b>${word}</b>! `,
        width: 600,
        padding: "3em",
        color: "#fff",
        background: `#fff url(${BG})`,
        showConfirmButton: true,
        // showCancelButton: true,
        confirmButtonColor: "#00ff00cf",
        cancelButtonColor: "#f00000cf",
        confirmButtonText: "Play Again!",
        cancelButtonText: "View Results",
      }).then((result) => {
        if (result.isConfirmed) {
          playAgain();
        }
      });
    }
  };

  const playAgain = () => {
    setGameEnded(false);
    setWord("");
    setGuessCount(0);
    setGuessedWords(
      new Array(6).fill(undefined).map(() => ({
        word: "",
        letters: new Array(4).fill(undefined).map(() => ({
          letter: "",
          contains: false,
          correct: false,
        })),
      }))
    );
    startGame();
  };

  const checkWordCorrectness = (
    tempGuess: guessedWords,
    guessedWord: string
  ) => {
    tempGuess.word = guessedWord;
    tempGuess.letters.forEach((char, ind) => {
      char.letter = guessedWord[ind];
      if (word.includes(char.letter)) {
        // console.log(word.includes(char.letter));
        char.contains = true;
        if (char.letter === word[ind]) {
          // console.log(char.letter, word[ind]);
          char.correct = true;
        }
      }
    });
    return tempGuess;
  };

  const handleWordGuess = (guess: string) => {
    const tempGuess: guessedWords = guessedWords[guessCount];
    setGuessCount((e) => e + 1);
    checkEndGame(guess);
    const checkedGuess = checkWordCorrectness(tempGuess, guess);
    const temp = guessedWords;
    temp[guessCount] = checkedGuess;
    setGuessedWords(temp);
    setGuess("");
  };

  return (
    <div className="game-wrapper">
      <div className="game-head">
        <button disabled={gamePlaying} onClick={startGame}>
          Start Game
        </button>
      </div>
      <div className="game-body">
        {guessedWords.map((guess, ix) => {
          return (
            <div key={ix} className="single-guess">
              {guess.letters.map((char, ix) => (
                <div
                  key={ix}
                  className={
                    char.correct
                      ? "letter correct"
                      : char.contains
                      ? "contains letter"
                      : "letter"
                  }
                >
                  {char.letter}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="game-actions">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          type="text"
          maxLength={word.length}
          minLength={word.length}
        />

        <button disabled={gameEnded} onClick={() => handleWordGuess(guess)}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Game;
