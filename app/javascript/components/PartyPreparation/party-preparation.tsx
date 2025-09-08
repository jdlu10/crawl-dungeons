import React, { useState } from "react";
import PartyFormation from "./PartyFormation";
import CharacterCreation from "./CharacterCreation";
import Modal from "../Utils/Modal";

export default function PartyPreparation() {
  const [currentMenu, setCurrentMenu] = useState("party-formation");

  return (
    <div className="bg-amber-950 border-3 border-black rounded-lg shadow-md text-gray-300 mx-auto w-full max-w-6xl relative h-dvh lg:max-h-150">
      <div className="rounded-t-lg overflow-hidden relative h-full rounded-lg">
        <img
          className="w-full object-cover h-full"
          src="/images/tavern.png"
          alt=""
        />
      </div>
      <section className="p-5 absolute inset-0 flex flex-col justify-center">
        <div className="min-h-80">
          {currentMenu === "party-formation" && (
            <PartyFormation setCurrentMenu={setCurrentMenu} />
          )}
          {currentMenu === "character-creation" && (
            <CharacterCreation setCurrentMenu={setCurrentMenu} />
          )}
        </div>
      </section>
      {<Modal />}
    </div>
  );
}
