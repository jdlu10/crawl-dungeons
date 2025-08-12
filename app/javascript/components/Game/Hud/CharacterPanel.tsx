import React, { useCallback, useEffect, useState } from "react";
import { Character, Inventory } from "../../../types/CharacterTypes";
import { useEscapeClose } from "../../../utils/hooks/utilityHooks";
import ElementIcons from "../../Utils/ElementIcons";
import { ElementName, Party, VocationName } from "../../../types/GameTypes";
import VocationIcons from "../../Utils/VocationIcons";
import EquipmentIcon from "../../Utils/EquipmentIcon";
import { useQueryInventoryActions } from "../../../utils/hooks/characterHooks";
import { useAppStore } from "../../../store/AppStore";
import { useQueryClient } from "@tanstack/react-query";
import { useContextMenu } from "../../../utils/hooks/utilityHooks";

type EquippableSlot = {
  [key: string]: { inventoryId: number; imageUrl: string; itemName: string };
};

export default function CharacterPanel(params: {
  characterId: number;
  party: Party | undefined;
  setCharacterSheetId:
    | React.Dispatch<React.SetStateAction<number | undefined>>
    | undefined;
}) {
  const { party, characterId, setCharacterSheetId } = params;
  const character =
    party?.characters.find((character) => character.id === characterId) ||
    ({} as Character);
  const [equippedItems, setEquippedItems] = useState<Inventory[]>([]);
  const game = useAppStore((s) => s.game);
  const playerId = useAppStore((s) => s.playerId);
  const queryClient = useQueryClient();

  const getEquippedItem = (
    equippedItems: Inventory[],
    equippableSlotKey: string
  ): Inventory | undefined => {
    return equippedItems.find(
      (inventory) => inventory.item?.equippable_slot?.key === equippableSlotKey
    );
  };

  const closePanel = useCallback(() => {
    if (typeof setCharacterSheetId === "function")
      setCharacterSheetId(undefined);
  }, [setCharacterSheetId]);

  const { mutateAsync: inventoryAction, isPending } = useQueryInventoryActions({
    onSuccess: (data, action, targetCharacterId) => {
      queryClient.invalidateQueries({ queryKey: ["party", game.id, playerId] });
      if (targetCharacterId) {
        setCharacterSheetId?.(targetCharacterId);
      }
    },
    onError: (error) => {
      console.error("Error with the item action:", error);
    },
  });

  const { ContextMenu, showMenu, hideMenu } = useContextMenu(
    party?.characters || [],
    (targetCharacter, inventory_item, sourceCharacter) => {
      const inventoryItem = inventory_item as Inventory;
      inventoryAction({
        game_id: game.id,
        player_id: playerId,
        character_id: targetCharacter?.id,
        inventory_id: inventoryItem?.id,
        action: "use",
      });
    }
  );

  const EquipmentSlot = (params: { equipmentSlotKey: string }) => {
    const equippedItem = getEquippedItem(
      equippedItems,
      params.equipmentSlotKey
    );

    return equippedItem ? (
      <EquipmentIcon
        disabled={isPending}
        onClick={() => {
          inventoryAction({
            game_id: game.id,
            player_id: playerId,
            character_id: character?.id,
            inventory_id: equippedItem.id,
            action: "equip",
          });
        }}
        title={equippedItem?.item.name}
      >
        {equippedItem && (
          <img
            className="max-w-14 max-h-14"
            src={equippedItem.item.visual_render.url}
          />
        )}
      </EquipmentIcon>
    ) : (
      <EquipmentIcon />
    );
  };

  const ItemActions = (params: {
    inventory_item: Inventory;
    character?: Character;
  }) => {
    const { inventory_item, character } = params;

    return (
      <>
        {inventory_item.item.equippable_slot && (
          <button
            disabled={isPending}
            onClick={() => {
              inventoryAction({
                game_id: game.id,
                player_id: playerId,
                character_id: character?.id,
                inventory_id: inventory_item.id,
                action: "equip",
              });
            }}
            className="item-action border-2 px-2.5 cursor-pointer text-sm hover:bg-green-700 active:bg-green-800 font-bold disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            Equip
          </button>
        )}
        {inventory_item.item.usable && (
          <button
            disabled={isPending}
            onClick={(e) => {
              showMenu(e, inventory_item, undefined);
              // inventoryAction({
              //   game_id: game.id,
              //   player_id: playerId,
              //   character_id: character?.id,
              //   inventory_id: inventory_item.id,
              //   action: "use",
              // });
            }}
            className="item-action border-2 px-2.5 cursor-pointer text-sm hover:bg-green-700 active:bg-green-800 font-bold disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            Use
          </button>
        )}
        {
          <button
            disabled={isPending}
            onClick={() => {
              inventoryAction({
                game_id: game.id,
                player_id: playerId,
                character_id: character?.id,
                inventory_id: inventory_item.id,
                action: "move",
              });
            }}
            className="item-action border-2 px-2.5 cursor-pointer text-sm hover:bg-green-700 active:bg-green-800 font-bold disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            Move
          </button>
        }
        <button
          disabled={isPending}
          onClick={() => {
            let confirmDiscard = window.confirm(
              `Are you sure you want to discard ${inventory_item.item.name}? This action cannot be undone.`
            );
            if (confirmDiscard) {
              inventoryAction({
                game_id: game.id,
                player_id: playerId,
                character_id: character?.id,
                inventory_id: inventory_item.id,
                action: "discard",
              });
            } else {
              console.log("Discard action cancelled by user.");
            }
          }}
          className="item-discard border-2 px-2.5 cursor-pointer text-sm hover:bg-red-800 active:bg-red-900 font-bold disabled:bg-gray-800 disabled:cursor-not-allowed"
        >
          Discard
        </button>
      </>
    );
  };

  useEscapeClose(() => {
    closePanel();
  });

  useEffect(() => {
    setEquippedItems(
      character.filtered_inventories.filter(
        (inventory) => inventory.equipped === true
      )
    );
  }, [character.filtered_inventories]);

  return (
    <section className="character-panel grid grid-cols-8 grid-rows-8 absolute inset-0 overflow-hidden gap-2.5 p-2.5 bg-black">
      <div className="paper-doll row-span-4 col-span-4 bg-[url('/images/characters/character-sheet.png')] bg-no-repeat bg-contain bg-center border-2 py-7 px-40 grid grid-cols-2 grid-rows-5">
        <div className="head ml-5">
          <EquipmentSlot equipmentSlotKey="head" />
        </div>
        <div className="neck justify-self-end mr-5">
          <EquipmentSlot equipmentSlotKey="neck" />
        </div>
        <div className="body -ml-5">
          <EquipmentSlot equipmentSlotKey="body" />
        </div>
        <div className="back justify-self-end -mr-5">
          <EquipmentSlot equipmentSlotKey="back" />
        </div>
        <div className="left-hand -ml-15">
          <EquipmentSlot equipmentSlotKey="left_hand_one" />
        </div>
        <div className="right-hand justify-self-end -mr-15">
          <EquipmentSlot equipmentSlotKey="right_hand_one" />
        </div>
        <div className="waist -ml-5">
          <EquipmentSlot equipmentSlotKey="waist" />
        </div>
        <div className="hands justify-self-end -mr-5">
          <EquipmentSlot equipmentSlotKey="hands" />
        </div>
        <div className="left-ring ml-5">
          <EquipmentSlot equipmentSlotKey="left_ring" />
        </div>
        <div className="feet justify-self-end me-5">
          <EquipmentSlot equipmentSlotKey="feet" />
        </div>
      </div>
      <div className="name-and-race row-span-2 col-span-4 flex gap-5 border-2">
        <div className="portrait">
          <img
            src={character.visual_render.url}
            className="h-full"
            title={`${character.name} - ${character.description}`}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 pt-2.5">
          <h1 className="text-3xl font-bold">{character.name}</h1>
          <h2 className="text-2xl">
            Level {character.level} {character.race.name}{" "}
            {character.vocation.name}
          </h2>
          <div className="character-icons flex gap-2.5">
            <div
              className={`w-7 h-7 icon-element-${character.element.key}`}
              title={character.element.description}
            >
              <ElementIcons
                name={character.element.visual_render.name as ElementName}
              />
            </div>
            <div
              className={`w-7 h-7 icon-vocation-${character.vocation.name}`}
              title={`${character.vocation.name}`}
            >
              <VocationIcons
                name={character.vocation.icon.name as VocationName}
              />
            </div>
          </div>
        </div>
        <div className="flex align-top pt-2.5 pr-2.5">
          <button
            className="cursor-pointer w-8 h-8 border-2 turn-right"
            onClick={closePanel}
            title="Close"
          >
            X
          </button>
        </div>
      </div>
      <div className="status row-span-2 col-span-2 border-2 grid grid-cols-[auto_1fr] grid-rows-3 gap-0.5 bg-gray-100">
        <div className="hit-points text-lg font-bold text-center bg-black content-center px-2.5">
          HP
        </div>
        <div className="hit-points-value bg-red-950 relative">
          <div
            className="hp-bar status-bar block h-full bg-red-800 absolute"
            style={{
              width:
                Math.floor(
                  (character.hit_points / character.max_hit_points) * 100
                ) + "%",
            }}
          ></div>
          <div className="absolute inset-0 content-center font-bold text-2xl text-center">
            {character.hit_points} / {character.max_hit_points}
          </div>
        </div>
        <div className="power-points text-lg font-bold text-center bg-black content-center px-2.5">
          PP
        </div>
        <div className="power-points-value bg-blue-950 relative">
          <div
            className="pp-bar status-bar block h-full bg-blue-800 absolute"
            style={{
              width:
                Math.floor(
                  (character.power_points / character.max_power_points) * 100
                ) + "%",
            }}
          ></div>
          <div className="absolute inset-0 content-center font-bold text-2xl text-center">
            {character.power_points} / {character.max_power_points}
          </div>
        </div>
        <div className="experience-points text-lg font-bold text-center bg-black content-center px-2.5">
          XP
        </div>
        <div className="experience-points-value bg-yellow-950 relative">
          <div
            className="xp-bar status-bar block h-full bg-yellow-800 absolute"
            style={{
              width:
                Math.floor((character.experience_points / 10000) * 100) + "%",
            }}
          ></div>
          <div className="absolute inset-0 content-center font-bold text-2xl text-center">
            {character.experience_points} / 10000
          </div>
        </div>
      </div>
      <div className="attributes row-span-2 col-span-2 border-2 grid grid-cols-2 grid-rows-3 gap-0.5 bg-gray-100">
        <div className="attribute-strength flex flex-row bg-black items-center">
          <h3
            title="Strength"
            className="text-lg font-bold pb-1 pt-1 w-1/2 border-b-white border-r-2 text-center content-center"
          >
            STR
          </h3>
          <div className="attribute-value flex-1 text-2xl content-center text-center w-1/2 font-bold">
            {character.strength}
          </div>
        </div>
        <div className="attribute-intelligence flex flex-row bg-black items-center">
          <h3
            title="Intellignce"
            className="text-lg font-bold pb-1 pt-1  w-1/2 border-b-white border-r-2 text-center content-center"
          >
            INT
          </h3>
          <div className="attribute-value flex-1 text-2xl content-center text-center w-1/2 font-bold">
            {character.intelligence}
          </div>
        </div>
        <div className="attribute-dexterity flex flex-row bg-black items-center">
          <h3
            title="Dexterity"
            className="text-lg font-bold pb-1 pt-1  w-1/2 border-b-white border-r-2 text-center content-center"
          >
            DEX
          </h3>
          <div className="attribute-value flex-1 text-2xl content-center text-center w-1/2 font-bold">
            {character.dexterity}
          </div>
        </div>
        <div className="attribute-wisdom flex flex-row bg-black items-center">
          <h3
            title="Wisdom"
            className="text-lg font-bold pb-1 pt-1  w-1/2 border-b-white border-r-2 text-center content-center"
          >
            WIS
          </h3>
          <div className="attribute-value flex-1 text-2xl content-center text-center w-1/2 font-bold">
            {character.wisdom}
          </div>
        </div>
        <div className="attribute-constitution flex flex-row bg-black items-center">
          <h3
            title="Constitution"
            className="text-lg font-bold pb-1 pt-1  w-1/2 border-b-white border-r-2 text-center content-center"
          >
            CON
          </h3>
          <div className="attribute-value flex-1 text-2xl content-center text-center w-1/2 font-bold">
            {character.constitution}
          </div>
        </div>
        <div className="attribute-charisma flex flex-row bg-black items-center">
          <h3
            title="Charisma"
            className="text-lg font-bold pb-1 pt-1  w-1/2 border-b-white border-r-2 text-center content-center"
          >
            CHA
          </h3>
          <div className="attribute-value flex-1 text-2xl content-center text-center w-1/2 font-bold">
            {character.charisma}
          </div>
        </div>
      </div>
      <div className="inventory row-start-5 row-span-4 col-span-3 border-2 pl-2.5 pr-2.5 pb-2.5 overflow-auto relative">
        <h3 className="border-b-2 sticky top-0 font-bold text-lg pt-2.5 bg-black">
          Character Inventory
        </h3>
        <ul className="flex flex-col gap-2.5 pt-2.5">
          {character.filtered_inventories.map((inventory) => {
            if (!inventory.equipped) {
              return (
                <li
                  key={`inventory-${inventory.id}`}
                  className="flex gap-2.5 align-middle hover:bg-gray-800"
                >
                  <span
                    className="item-name flex-1"
                    title={inventory.item.description}
                  >
                    {inventory.item.name}
                  </span>
                  <ItemActions inventory_item={inventory} />
                </li>
              );
            }
          })}
        </ul>
      </div>
      <div className="inventory row-start-5 row-span-4 col-span-3 border-2 pl-2.5 pr-2.5 pb-2.5 overflow-auto relative">
        <h3 className="border-b-2 sticky top-0 font-bold text-lg pt-2.5 bg-black">
          Party Inventory
        </h3>
        <ul className="flex flex-col gap-2.5 pt-2.5">
          {party?.filtered_inventories.map((inventory) => {
            if (!inventory.equipped) {
              return (
                <li
                  key={`inventory-${inventory.id}`}
                  className="flex gap-2.5 align-middle hover:bg-gray-800"
                >
                  <span
                    className="item-name flex-1"
                    title={inventory.item.description}
                  >
                    {inventory.item.name}
                  </span>
                  <ItemActions
                    inventory_item={inventory}
                    character={character}
                  />
                </li>
              );
            }
          })}
        </ul>
      </div>

      <div className="skills row-span-2 col-span-2 border-2 pl-2.5 pr-2.5 pb-2.5 overflow-auto">
        <h3 className="border-b-2 sticky top-0 font-bold text-lg pt-2.5 bg-black">
          Skills
        </h3>
        <ul className="flex flex-col gap-2.5 pt-2.5">
          {character.vocation.vocation_abilities.map((vocation_ability) => {
            if (vocation_ability.ability.ability_type !== "simple") {
              return (
                <li
                  key={`inventory-${vocation_ability.id}`}
                  className="flex gap-2.5 align-middle hover:bg-gray-800"
                >
                  <span
                    className="ability-name flex-1"
                    title={vocation_ability.ability.description}
                  >
                    {vocation_ability.ability.name}
                  </span>
                  {vocation_ability.ability.usable_outside_combat && (
                    <button className="ability-use border-2 px-2.5 cursor-pointer text-sm hover:bg-green-700 active:bg-green-800 font-bold">
                      Use
                    </button>
                  )}
                </li>
              );
            }
          })}
        </ul>
      </div>
      <div className="notes row-span-2 col-span-2 border-2 p-2.5 overflow-auto">
        {character.description}
      </div>
      {ContextMenu}
    </section>
  );
}
