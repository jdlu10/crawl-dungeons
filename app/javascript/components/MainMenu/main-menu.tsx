import React from "react";
import { useAppStore } from "../../store/AppStore";

export default function MainMenu() {
  const theme = useAppStore((state) => state.theme);

  // const pageMode = mode === "3D" ? "three-d" : "";
  // const readable = readability ? "readable" : "";

  return (
    <>
      <p className="text-amber-900 text-2xl">blah</p>
    </>
  );
}
