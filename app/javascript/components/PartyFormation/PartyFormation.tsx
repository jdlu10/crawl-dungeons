import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainMenuButton from "../MainMenu/MainMenuButton";
import Loading from "../Utils/Loading";

export default function PartyFormation() {
  const playerId = useAppStore((state) => state.playerId);

  return (
    <div className="bg-amber-950 border-3 border-black rounded-lg shadow-md text-gray-300 mx-auto w-full max-w-6xl relative min-h-96">
      <div className="rounded-t-lg overflow-hidden relative">
        <img
          className="w-full object-cover"
          src="/images/entrance-main-landscape.png"
          alt=""
        />
      </div>
      <section className="p-5 absolute inset-0 flex flex-col justify-center">
        <div className="min-h-80">
          <div className="grid grid-cols-5 grid-rows-5 gap-4">
            <div className="col-span-5">
              <h1 className="mb-2 text-4xl font-semibold tracking-tight">
                Form your party
              </h1>
            </div>
            <div className="col-span-3 row-start-2">
              Create your character or select from below
            </div>
            <div className="col-span-2 col-start-4 row-start-2">
              Current party
            </div>
            <div className="col-span-3 row-span-3 row-start-3">
              Available Roster
            </div>
            <div className="col-span-2 row-span-3 col-start-4 row-start-3">
              Party member list
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
