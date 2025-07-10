import React, { useState } from "react";
import { useAppStore } from "../../store/AppStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainMenuButton from "../MainMenu/MainMenuButton";
import Loading from "../Utils/Loading";

export default function CharacterCreation() {
  const playerId = useAppStore((state) => state.playerId);

  return (
    <>
      <h1 className="mb-10 text-4xl font-semibold tracking-tight">
        Create Your Character
      </h1>
      <div className="cta-buttons"></div>
    </>
  );
}
