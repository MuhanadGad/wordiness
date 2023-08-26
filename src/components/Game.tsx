import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "../assets/scss/Game.scss";
import dictionary from "../assets/words/dictionary";
import JSONDATA from "../assets/words/data";
import leftCat from "../assets/images/nyan-cat.gif";
import BG from "../assets/images/pixel-art-of-80s-retro-sci-fi-background-herbert.jpg";
import Swal from "sweetalert2";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { guessedWords, markedLetters } from "../types/main";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { endState, startState } from "../store/slices/gameStateSlice";

const Game = forwardRef((_props, ref) => {
  useImperativeHandle(ref, () => ({
    restartGame() {
      startGame();
    },
  }));
  // DONE:  use ForwardRefs to call playAgain() from App.tsx on replay click

  // DONE:  Add Virtual Keyboard to mark correct,semi-correct,wrong letters

  // DONE:  Backspace on Virtual Keyboard to be fixed

  // TODO:  start setting up antdesign theme provider

  // TODO:  Move all states here to redux slice gameState

  const keyboardRef = useRef<KeyboardReactInterface | null>(null);
  const gamePrefs = useSelector((state: RootState) => state.gameSettings);
  const gameState = useSelector((state: RootState) => state.gameState);
  const [word, setWord] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [markedLetters, setMarkedLetters] = useState<markedLetters>({
    correct: [],
    contains: [],
    wrong: [],
  });
  const [guessedWords, setGuessedWords] = useState<guessedWords[]>(
    new Array(6).fill(undefined).map(() => ({
      word: "",
      letters: new Array(gamePrefs.selectedWordLength || 4)
        .fill(undefined)
        .map(() => ({
          letter: "",
          contains: false,
          correct: false,
        })),
    }))
  );
  const [guess, setGuess] = useState("");
  const dispatch = useDispatch();

  const startGame = () => {
    console.log("c");
    resetGame();
    selectRandomWord(gamePrefs.selectedWordLength);
  };

  const selectRandomWord = (wordLength: number) => {
    const words = JSONDATA.filter((num) => {
      return num.length === wordLength;
    });
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
  };

  const winGame = () => {
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
      focusConfirm: false,
      allowEnterKey: false,
      confirmButtonColor: "#00ff00cf",
      cancelButtonColor: "#f00000cf",
      confirmButtonText: "Play Again!",
      cancelButtonText: "View Results",
    }).then((result) => {
      if (result.isConfirmed) {
        startGame();
      }
    });
  };

  const loseGame = () => {
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
      allowEnterKey: false,
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        startGame();
      }
    });
  };

  const checkEndGame = (guess: string) => {
    if (guess === word) {
      winGame();
      dispatch(endState());
    } else if (guessCount === 5) {
      dispatch(endState());
      loseGame();
    }
  };

  const resetGame = () => {
    setWord("");
    setGuessCount(0);
    setGuessedWords(
      new Array(6).fill(undefined).map(() => ({
        word: "",
        letters: new Array(gamePrefs.selectedWordLength || 4)
          .fill(undefined)
          .map(() => ({
            letter: "",
            contains: false,
            correct: false,
          })),
      }))
    );
    resetKeyboard();
    dispatch(startState());
  };

  const checkWordCorrectness = (
    tempGuess: guessedWords,
    guessedWord: string
  ) => {
    tempGuess.word = guessedWord;
    tempGuess.letters.forEach((char, ind) => {
      char.letter = guessedWord[ind];
      if (word.includes(char.letter)) {
        char.contains = true;
        const temp = { ...markedLetters };
        temp.contains.push(char.letter);
        setMarkedLetters(temp);
        if (char.letter === word[ind]) {
          const temp = { ...markedLetters };
          temp.correct.push(char.letter);
          setMarkedLetters(temp);
          char.correct = true;
        }
      } else {
        const temp = { ...markedLetters };
        temp.wrong.push(char.letter);
        setMarkedLetters(temp);
      }
    });
    return tempGuess;
  };

  const handleWordGuess = (guess: string) => {
    guess = guess.toLowerCase();
    if (guess.length !== word.length) return;
    if (!dictionary.includes(guess)) return;
    const tempGuess: guessedWords = guessedWords[guessCount];
    setGuessCount((e) => e + 1);
    checkEndGame(guess);
    const checkedGuess = checkWordCorrectness(tempGuess, guess);
    const temp = guessedWords;
    temp[guessCount] = checkedGuess;
    setGuessedWords(temp);
    updateKeyboardColors();
    setGuess("");
  };

  const resetKeyboard = () => {
    const containsLetters = markedLetters.contains.join(" ");
    const correctLetters = markedLetters.correct.join(" ");
    const wrongLetters = markedLetters.wrong.join(" ");
    if (keyboardRef.current !== null) {
      keyboardRef.current.clearInput();
      keyboardRef.current.removeButtonTheme(wrongLetters, "wrong");
      keyboardRef.current.removeButtonTheme(correctLetters, "correct");
      keyboardRef.current.removeButtonTheme(containsLetters, "contains");
      setMarkedLetters({ correct: [], contains: [], wrong: [] });
    }
  };

  const updateKeyboardColors = () => {
    const containsLetters = markedLetters.contains.join(" ");
    const correctLetters = markedLetters.correct.join(" ");
    const wrongLetters = markedLetters.wrong.join(" ");
    if (keyboardRef.current !== null) {
      keyboardRef.current.clearInput();
      keyboardRef.current.addButtonTheme(wrongLetters, "wrong");
      keyboardRef.current.addButtonTheme(correctLetters, "correct");
      keyboardRef.current.addButtonTheme(containsLetters, "contains");
    }
  };

  const keyboardLayout = {
    default: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "{backspace} z x c v b n m {enter}",
    ],
  };

  const onKeyboardChange = (input: string) => {
    if (gameState.gamePlaying && input.length <= word.length) {
      setGuess(input);
    }
  };
  const onKeyboardPress = (button: string) => {
    if (button === "{enter}") {
      handleWordGuess(guess);
    }
  };

  return (
    <div className="game-wrapper">
      <div className="game-head">
        <button disabled={gameState.gamePlaying} onClick={startGame}>
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
          name="guess"
          style={{ pointerEvents: "none" }}
          onChange={(e) => setGuess(e.target.value)}
          readOnly
          type="text"
          maxLength={word.length}
          minLength={word.length}
        />
        <Keyboard
          // debug
          keyboardRef={(r) => (keyboardRef.current = r)}
          onChange={onKeyboardChange}
          onKeyPress={onKeyboardPress}
          layout={keyboardLayout}
          baseClass={"upper-kb"}
          display={{ "{bksp}": "Del", "{enter}": "Enter" }}
          mergeDisplay={true}
          physicalKeyboardHighlight={true}
          physicalKeyboardHighlightPress={true}
          disableCaretPositioning={true}
          inputName="guess"
          maxLength={word.length}
        />
      </div>
    </div>
  );
});

export default Game;
