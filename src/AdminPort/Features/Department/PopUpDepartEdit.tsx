import { HexColorPicker } from "react-colorful";
import { useState } from "react";

export const MyComponent = () => {
  const [color, setColor] = useState("#aabbcc");

  return (
    <div>
      <HexColorPicker color={color} onChange={setColor} />
      <p style={{ color }}>Selected color: {color}</p>
    </div>
  );
};