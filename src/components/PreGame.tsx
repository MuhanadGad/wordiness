import { Button, Segmented, Typography } from "antd";
import { setAmount } from "../store/slices/gameSettingsSlice";
import { useDispatch } from "react-redux";
import { startState } from "../store/slices/gameStateSlice";

const PreGame = () => {
  const dispatch = useDispatch();

  const handleWordLength = (value) => {
    dispatch(setAmount(parseInt(value)));
  };
  return (
    <div>
      <Typography.Title>Welcome to Wordiness!</Typography.Title>
      <div className="stats">Here will be your stats</div>
      <div className="options">
        <div className="word-length">
          <Typography.Paragraph>Select Word Length</Typography.Paragraph>
          <Segmented
            onChange={handleWordLength}
            options={[
              {
                value: "4",
                label: "4",
              },
              {
                value: "5",
                label: "5",
              },
              {
                value: "6",
                label: "6",
              },
              {
                value: "7",
                label: "7",
              },
              {
                value: "8",
                label: "8",
              },
              {
                value: "9",
                label: "9",
              },
              {
                value: "10",
                label: "10",
              },
            ]}
          />
        </div>
      </div>
      <div className="start">
        <Button onClick={() => dispatch(startState())}>Start</Button>
      </div>
    </div>
  );
};

export default PreGame;
