import { useRef, useState } from "react";
import "./App.css";
import Game from "./components/Game";
import { FloatButton } from "antd";
import {
  SettingOutlined,
  NumberOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setAmount } from "./store/slices/gameSettingsSlice";
import { RootState } from "./store/store";

function App() {
  const gameRef: any | undefined = useRef();
  const dispatch = useDispatch();
  const gamePrefs = useSelector((state: RootState) => state.gameSettings);

  const [wordLengthStep, setWordLengthStep] = useState(1);

  const handleUserPreferencesWordLength = () => {
    let currentWordLength = gamePrefs.selectedWordLength;
    const ceiling = 10;
    const floor = 4;
    currentWordLength += wordLengthStep;
    if (currentWordLength === ceiling || currentWordLength === floor) {
      setWordLengthStep((step) => -step);
    }
    dispatch(setAmount(currentWordLength));
  };
  return (
    <>
      Hello Wordiness
      <FloatButton.Group
        trigger="click"
        type="primary"
        shape="square"
        style={{ right: 24 }}
        icon={<SettingOutlined />}
      >
        <FloatButton
          onClick={handleUserPreferencesWordLength}
          icon={
            gamePrefs.selectedWordLength === null ? (
              <NumberOutlined />
            ) : (
              <p>{gamePrefs.selectedWordLength}</p>
            )
          }
        />
        <FloatButton
          onClick={() => gameRef.current.restartGame()}
          icon={<BgColorsOutlined />}
        />
      </FloatButton.Group>
      <Game ref={gameRef} />
    </>
  );
}

export default App;
