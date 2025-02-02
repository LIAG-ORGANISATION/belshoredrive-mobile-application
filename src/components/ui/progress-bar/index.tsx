import { View } from "react-native";
import cx from "classnames";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  fullWidth?: boolean;
};

export const ProgressBar = ({
  currentStep,
  totalSteps,
  fullWidth = false,
}: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  const classes = cx({
    "mx-auto h-1 bg-neutral-800 rounded-full": true,
    "w-full": fullWidth,
    "w-10/12": !fullWidth,
  });
  return (
    <View className={classes}>
      <View
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#4aa8ba",
        }}
      />
    </View>
  );
};
