import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Ability, Character, Inventory } from "../../types/CharacterTypes";

export function useEscapeClose(callback?: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "escape") {
        callback?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
}

type ContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
};
type TActionEntity = Inventory | Ability | undefined;

export function useContextMenu<T extends Character = Character>(
  options: T[],
  onSelect: (
    option: T,
    actionEntity: TActionEntity,
    sourceEntity: T | undefined
  ) => void
) {
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const [actionEntity, setActionEntity] = useState<TActionEntity>(undefined);
  const [sourceEntity, setSourceEntity] = useState<T | undefined>(undefined);

  const handleOptionClick = useCallback(
    (option: T) => {
      onSelect(option, actionEntity, sourceEntity);
      setContextMenuState((prev) => ({ ...prev, visible: false }));
    },
    [onSelect]
  );

  const showMenu = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      actionEntity: TActionEntity,
      sourceEntity: T | undefined
    ) => {
      event.preventDefault();
      console.log(actionEntity);
      setActionEntity(actionEntity);
      setSourceEntity(sourceEntity);
      setContextMenuState((prev) => ({
        ...prev,
        visible: true,
        x: event.clientX,
        y: event.clientY,
      }));
    },
    []
  );

  const hideMenu = useCallback(() => {
    setContextMenuState((prev) => ({ ...prev, visible: false }));
  }, []);

  const ContextMenu: ReactNode = contextMenuState.visible && (
    <>
      <ul
        className="fixed z-50 bg-gray-900 border-2 font-bold text-white"
        style={{
          top: contextMenuState.y,
          left: contextMenuState.x,
        }}
      >
        {options.map((opt) => (
          <li
            className="hover:bg-gray-800 cursor-pointer px-3 py-1.5"
            key={"context-menu-option-" + opt.id}
            onClick={() => handleOptionClick(opt)}
          >
            {opt.name}
          </li>
        ))}
      </ul>
      <div className="fixed z-40 inset-0" onClick={hideMenu}></div>
    </>
  );

  return { ContextMenu, hideMenu, showMenu };
}
