import React from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

function valuetext(value: number) {
  return `${value}°C`;
}

const maxDistance = 150;

function MyTimeline() {
  const [value, setValue] = React.useState<number[]>([20, 37]);

  const handleChange = (
    event: Event,
    newValue: number[],
    activeThumb: number
  ) => {
    setValue(newValue)
  };

  return (
    <Box sx={{ width: 1000, margin: 10 }}>
      <Slider
        className="slider"
        getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="on"
        getAriaValueText={valuetext}
        min={0}
        max={2030}
        disableSwap
      />
    </Box>
  );
}

export default MyTimeline;
