import { useEffect, useState } from "react";
import dictionary from "../assets/words/dictionary";

const useDictionary = (guess: string) => {
  const [contains, setContains] = useState(false);
  const dict = dictionary;
  useEffect(() => {
    if (dict.indexOf(guess) > -1) setContains(true);
    setContains(false);
  }, [guess, dict]);

  return contains;
};

export default useDictionary;
