import React from "react";
import { useAppStore } from "../../store/AppStore";

export default function CampaignsPage() {
  const theme = useAppStore((state) => state.theme);

  return (
    <>
      <header></header>
      <main>
        <section className={`main ${theme}`}>
          <div className="page text-white"></div>
        </section>
      </main>
      <footer></footer>
    </>
  );
}
