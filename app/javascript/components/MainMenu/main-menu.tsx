import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import Campaigns from "./Campagns";
import Games from "./Games";
import MainMenuButton from "./MainMenuButton";

import "./styles.css";

export default function MainMenu() {
  const theme = useAppStore((state) => state.theme);

  const [currentMenu, setCurrentMenu] = useState("main-menu");

  return (
    <div className="bg-amber-950 border-3 border-black rounded-lg shadow-md text-gray-300 mx-auto w-full max-w-6xl relative">
      <section className="rounded-t-lg overflow-hidden relative">
        <img
          className="w-full object-cover"
          src="/images/entrance-main-landscape.png"
          alt=""
        />
        <div className="flame1"></div>
        <div className="flame2"></div>
      </section>
      <div className="p-5 absolute inset-0 flex flex-col justify-center">
        {currentMenu === "campaigns" && (
          <Campaigns setCurrentMenu={setCurrentMenu} />
        )}
        {currentMenu === "continue" && (
          <Games setCurrentMenu={setCurrentMenu} />
        )}

        {currentMenu === "main-menu" && (
          <>
            <h1 className="mb-2 text-4xl font-semibold tracking-tight">
              Welcome to Crawl Dungeons
            </h1>
            <p className="mb-10 font-normal">
              Enjoy the diverse world of Crawl Dungeons, where you can explore,
              battle, and strategize in a variety of dungeons.
            </p>
            <div className="cta-buttons">
              <MainMenuButton onClick={() => setCurrentMenu("campaigns")}>
                New Game
              </MainMenuButton>
              <br />
              <MainMenuButton onClick={() => setCurrentMenu("continue")}>
                Continue
              </MainMenuButton>
              <br />
              <MainMenuButton
                onClick={() => setCurrentMenu("settings")}
                disabled={true}
              >
                Settings
              </MainMenuButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
