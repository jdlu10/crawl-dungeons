import React from "react";
import { useAppStore } from "../store/AppStore";

export default function Campaigns() {
  const theme = useAppStore((state) => state.theme);
  const mode = useAppStore((state) => state.mode);
  const readability = useAppStore((state) => state.readability);

  const pageMode = mode === "3D" ? "three-d" : "";
  const readable = readability ? "readable" : "";

  return (
    <>
      <header></header>
      <main>
        <section className={`main ${theme} ${pageMode} ${readable}`}>
          <div className="page text-white">{mode}</div>
        </section>
      </main>
      <footer></footer>
    </>
  );
}
