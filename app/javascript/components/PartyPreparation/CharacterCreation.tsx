import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useAppStore } from "../../store/AppStore";
import Button from "../Utils/Button";
import Loading from "../Utils/Loading";
import {
  useGetElements,
  useGetPortraits,
  useGetRaces,
  useGetVocations,
} from "../../utils/hooks/gameHooks";
import {
  abilityScoreKeys,
  CharacterForm,
  TAbilityScoreKey,
} from "../../types/CharacterTypes";
import {
  useQueryCharacterTemplate,
  useQueryCreateCharacter,
} from "../../utils/hooks/characterHooks";
import VocationIcons from "../Utils/VocationIcons";
import ElementIcons from "../Utils/ElementIcons";
import { ElementName, VocationName } from "../../types/GameTypes";
import { CaretLeft, CaretRight } from "../Utils/Carets";

type TAbilityScores = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  totalScore: number;
  maxTotalScore: number;
};

type PartyFormationProps = {
  setCurrentMenu: (menu: string) => void;
};

export default function CharacterCreation(props: PartyFormationProps) {
  const playerId = useAppStore((state) => state.playerId);
  const game = useAppStore((state) => state.game);
  const [portraitIndex, setPortraitIndex] = useState(0);
  const [abilityScores, setAbilityScores] = useState<TAbilityScores>({
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    totalScore: 0,
    maxTotalScore: 0,
  });

  const {
    data: characterPortraits,
    isLoading: isLoadingCharacterPortraits,
    isError: isErrorCharacterPortraits,
  } = useGetPortraits();
  const {
    data: characterRaces,
    isLoading: isLoadingCharacterRaces,
    isError: isErrorCharacterRaces,
  } = useGetRaces();
  const {
    data: characterVocations,
    isLoading: isLoadingCharacterVocations,
    isError: isErrorCharacterVocations,
  } = useGetVocations();
  const {
    data: characterElements,
    isLoading: isLoadingCharacterElements,
    isError: isErrorCharacterElements,
  } = useGetElements();

  const updateAbilityScore = (
    abilityScore: TAbilityScoreKey,
    value: number
  ) => {
    const difference = value - abilityScores[abilityScore];
    setAbilityScores((prevState) => ({
      ...prevState,
      [abilityScore]: value,
      totalScore: prevState.totalScore + difference,
    }));
    setValue(abilityScore, value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<CharacterForm>();

  const vocationId = watch("vocation_id");
  const { data: fetchedCharacterTemplate, refetch: refetchCharacterTemplate } =
    useQueryCharacterTemplate(vocationId);

  const { mutateAsync: createCharacterQuery } = useQueryCreateCharacter({
    onSuccess: () => {
      props.setCurrentMenu("party-formation");
    },
    onError: (error) => {
      console.error("Error creating character:", error);
      alert("Failed to create a new character. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<CharacterForm> = async (data) => {
    await createCharacterQuery(data);
  };

  useEffect(() => {
    refetchCharacterTemplate();
  }, [vocationId]);

  useEffect(() => {
    if (fetchedCharacterTemplate) {
      resetAbilityTotalScores();
      abilityScoreKeys.forEach((abilityScoreKey) => {
        const scoreValue = fetchedCharacterTemplate[abilityScoreKey];
        if (scoreValue) {
          setAbilityScore(abilityScoreKey, scoreValue);
        }
      });
      if (fetchedCharacterTemplate.hit_points) {
        setValue("hit_points", fetchedCharacterTemplate.hit_points);
        setValue("max_hit_points", fetchedCharacterTemplate.max_hit_points);
        setValue("power_points", fetchedCharacterTemplate.power_points);
        setValue("max_power_points", fetchedCharacterTemplate.max_power_points);
        setValue("description", fetchedCharacterTemplate.description);
      }
    }
  }, [fetchedCharacterTemplate]);

  const abilityScoreMinus = (abilityScoreKey: TAbilityScoreKey) => (
    <button
      className="w-full cursor-pointer active:bg-gray-600"
      type="button"
      disabled={abilityScores[abilityScoreKey] <= 1}
      onClick={() => {
        updateAbilityScore(abilityScoreKey, abilityScores[abilityScoreKey] - 1);
      }}
    >
      -
    </button>
  );
  const abilityScorePlus = (abilityScoreKey: TAbilityScoreKey) => (
    <button
      className="w-full cursor-pointer active:bg-gray-600"
      type="button"
      disabled={abilityScores.maxTotalScore - abilityScores.totalScore <= 0}
      onClick={() => {
        updateAbilityScore(abilityScoreKey, abilityScores[abilityScoreKey] + 1);
      }}
    >
      +
    </button>
  );

  const resetAbilityTotalScores = () => {
    setAbilityScores((prevState) => ({
      ...prevState,
      totalScore: 0,
      maxTotalScore: 0,
    }));
  };

  const setAbilityScore = (
    abilityScoreKey: TAbilityScoreKey,
    value: number
  ) => {
    setAbilityScores((prevState) => ({
      ...prevState,
      [abilityScoreKey]: value,
      totalScore: prevState.totalScore + value,
      maxTotalScore: prevState.maxTotalScore + value,
    }));
    setValue(abilityScoreKey, value);
  };

  const rerollAbilityScores = () => {
    resetAbilityTotalScores();
    abilityScoreKeys.forEach((abilityScoreKey) => {
      setAbilityScore(abilityScoreKey, Math.floor(Math.random() * 5) + 1);
    });
  };

  const renderAbilityScoreButton = (abilityScoreKey: TAbilityScoreKey) => (
    <div className="ability-score flex flex-wrap">
      <input
        {...register(abilityScoreKey)}
        type="hidden"
        value={abilityScores[abilityScoreKey]}
      />
      <div className="w-full py-3 text-4xl text-center content-center border-2 border-gray-200">
        {abilityScores[abilityScoreKey]}
      </div>
      <div
        title={abilityScoreKey}
        className="w-full bg-gray-800 text-center content-center border-2 border-gray-200 py-2 px-3 uppercase font-bold"
      >
        {abilityScoreKey.substring(0, 3)}
      </div>
      <div className="w-1/2 text-2xl font-bold text-center content-center border-2 border-gray-200">
        {abilityScoreMinus(abilityScoreKey)}
      </div>
      <div className="w-1/2 text-2xl font-bold text-center content-center border-2 border-gray-200">
        {abilityScorePlus(abilityScoreKey)}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("player_id")}
        name="player_id"
        type="hidden"
        value={playerId || 0}
      />
      <input
        {...register("game_id")}
        name="game_id"
        type="hidden"
        value={game.id || 0}
      />
      <div
        id="create-character-form"
        className="form-create-character grid gap-4 grid-cols-6 items-start"
      >
        <h1 className="mb-3 text-4xl font-semibold tracking-tight col-span-6">
          Create Your Character
        </h1>

        <section className="character-portrait row-start-2 relative w-36 h-36 overflow-hidden">
          {isLoadingCharacterPortraits && <Loading />}
          {characterPortraits && (
            <>
              <img
                src={characterPortraits[portraitIndex].url}
                className="object-cover"
              />
              <input
                {...register("visual_render_id", {
                  required: "Character portrait is required",
                })}
                type="hidden"
                value={characterPortraits[portraitIndex].id}
              />
              <button
                type="button"
                onClick={() => {
                  const leftIndex =
                    portraitIndex - 1 < 0
                      ? characterPortraits.length - 1
                      : portraitIndex - 1;
                  setPortraitIndex(leftIndex);
                  setValue(
                    "visual_render_id",
                    characterPortraits[leftIndex].id
                  );
                }}
                className={`cursor-pointer absolute top-5 left-0 bottom-5 w-6`}
              >
                <CaretLeft />
              </button>
              <button
                type="button"
                onClick={() => {
                  const RightIndex =
                    portraitIndex + 1 >= characterPortraits.length
                      ? 0
                      : portraitIndex + 1;
                  setPortraitIndex(RightIndex);
                  setValue(
                    "visual_render_id",
                    characterPortraits[RightIndex].id
                  );
                }}
                className={`cursor-pointer absolute top-5 right-0 bottom-5 w-6`}
              >
                <CaretRight />
              </button>
            </>
          )}
        </section>

        <section className="character-name row-start-2 col-span-2">
          <label
            htmlFor="name"
            className="w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Character Name:{" "}
          </label>
          <input
            id="name"
            {...register("name", {
              required: "Character name is required",
              maxLength: {
                value: 24,
                message: "Max length is 24 characters",
              },
            })}
            maxLength={24}
            type="text"
            placeholder="Character Name"
            className="mb-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.name && (
            <div className="form-errors text-red-700">{`${errors.name.message}`}</div>
          )}
          {isLoadingCharacterRaces && <Loading />}
          <label
            htmlFor="race"
            className="w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Character Race:
          </label>
          {characterRaces && (
            <select
              id="race"
              {...register("race_id", {
                required: "Character race is required",
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {characterRaces &&
                characterRaces.map((race) => (
                  <option key={race.key} value={race.id}>
                    {race.name}
                  </option>
                ))}
            </select>
          )}
        </section>

        <section className="character-element row-start-3 col-span-3 flex flex-wrap gap-2">
          <h3 className="w-full mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Element:
          </h3>
          {isLoadingCharacterElements && <Loading />}
          {characterElements &&
            characterElements.map((characterElement, index) => (
              <label
                key={`element-radio-${index}`}
                htmlFor={`element-radio-${index}`}
                className="cursor-pointer relative"
              >
                <input
                  defaultChecked={index === 0}
                  type="radio"
                  value={characterElement.id}
                  id={`element-radio-${index}`}
                  {...register("element_id")}
                  className={`peer w-0 h-0 absolute pointer-events-none`}
                />
                <div
                  className="w-8 h-8 peer-checked:text-yellow-500"
                  title={characterElement.description}
                >
                  <ElementIcons
                    name={characterElement.visual_render.name as ElementName}
                  />
                </div>
              </label>
            ))}
        </section>

        <section className="character-vocation row-start-4 flex flex-wrap gap-2">
          <h3 className="w-full mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Vocation:
          </h3>
          {isLoadingCharacterVocations && <Loading />}
          {characterVocations &&
            characterVocations.map((characterVocation, index) => (
              <label
                key={`vocation-radio-${index}`}
                htmlFor={`vocation-radio-${index}`}
                className="cursor-pointer relative"
              >
                <input
                  defaultChecked={index === 0}
                  type="radio"
                  value={characterVocation.id}
                  id={`vocation-radio-${index}`}
                  {...register("vocation_id")}
                  className={`peer w-0 h-0 absolute pointer-events-none`}
                />
                <div
                  className="w-8 h-8 peer-checked:text-yellow-500"
                  title={characterVocation.description}
                >
                  <VocationIcons
                    name={characterVocation.icon.name as VocationName}
                  />
                </div>
              </label>
            ))}
        </section>

        <section className="character-skills row-start-4 col-span-2">
          <h3 className="w-full mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Vocation Skills:
          </h3>

          <ul className="h-20 overflow-y-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {fetchedCharacterTemplate &&
              fetchedCharacterTemplate.vocation_abilities?.map(
                (vocation_ability) => {
                  if (vocation_ability.ability?.group !== "basic_actions") {
                    return (
                      <li
                        key={`vocation-skill-${vocation_ability.id}`}
                        title={vocation_ability.ability?.description}
                      >
                        {vocation_ability.ability?.name} at level{" "}
                        {vocation_ability.ability?.level_requirement}
                      </li>
                    );
                  }
                }
              )}
          </ul>
        </section>

        <section className="attributes row-start-2 col-span-3 row-span-2 text-lg">
          <div className="flex flex-wrap">
            <p className="character-level block w-1/2">
              Level: {fetchedCharacterTemplate?.level}
            </p>
            <p className="character-hit-points block w-1/2">
              <input
                {...register("hit_points")}
                type="hidden"
                value={fetchedCharacterTemplate?.hit_points || 0}
              />
              <input
                {...register("max_hit_points")}
                type="hidden"
                value={fetchedCharacterTemplate?.max_hit_points || 0}
              />
              Hit Points: {fetchedCharacterTemplate?.hit_points} /{" "}
              {fetchedCharacterTemplate?.max_hit_points}
            </p>
            <p className="character-experience-points block w-1/2">
              Experience Points: {fetchedCharacterTemplate?.experience_points}
            </p>

            <p className="character-power-points mb-2.5 block w-1/2">
              <input
                {...register("power_points")}
                type="hidden"
                value={fetchedCharacterTemplate?.power_points || 0}
              />
              <input
                {...register("max_power_points")}
                type="hidden"
                value={fetchedCharacterTemplate?.max_power_points || 0}
              />
              Power Points: {fetchedCharacterTemplate?.power_points} /{" "}
              {fetchedCharacterTemplate?.max_power_points}
            </p>
          </div>

          <div className="ability-scores grid grid-cols-6 mb-5">
            {renderAbilityScoreButton("strength")}

            {renderAbilityScoreButton("dexterity")}

            {renderAbilityScoreButton("constitution")}

            {renderAbilityScoreButton("intelligence")}

            {renderAbilityScoreButton("wisdom")}

            {renderAbilityScoreButton("charisma")}
          </div>
          <strong>
            Unallocated bonus points:{" "}
            <span>
              {abilityScores.maxTotalScore - abilityScores.totalScore}
            </span>
          </strong>
          <button
            onClick={rerollAbilityScores}
            type="button"
            className="bg-blue-800 disabled:bg-gray-600 rounded cursor-pointer inline-flex items-center py-2 px-4 ml-5 uppercase text-lg font-semibold text-center"
          >
            Reroll
          </button>
        </section>

        <section className="character-notes row-start-4 col-span-3">
          <h3 className="w-full mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Notes:
          </h3>
          <textarea
            className="h-20 overflow-y-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("description")}
          ></textarea>
        </section>

        <section className="back-to-party-formation row-start-5 col-span-4">
          <Button onClick={() => props.setCurrentMenu("party-formation")}>
            Back to Party Formation
          </Button>
        </section>

        <section className="character-create row-start-5 col-start-5 col-span-2">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              abilityScores.maxTotalScore - abilityScores.totalScore > 0
            }
            className="bg-blue-800 disabled:bg-gray-600 rounded cursor-pointer min-w-40 inline-flex items-center px-4 py-3 uppercase text-lg font-semibold text-center"
          >
            Create Character
          </button>
        </section>
      </div>
    </form>
  );
}
