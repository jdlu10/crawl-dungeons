import React from "react";

type EquipmentIcon = {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  classNames?: string;
  title?: string;
};

export default function EquipmentIcon(props: EquipmentIcon) {
  const [disabled, setDisabled] = React.useState(false);

  const handleClick = () => {
    if (!props.disabled && !disabled && props.onClick) {
      setDisabled(true);
      props.onClick();
      setTimeout(() => {
        setDisabled(false);
      }, 2000); // Disable for 1 second to prevent multiple clicks
    }
  };
  return (
    <button
      onClick={handleClick}
      disabled={props.disabled}
      title={props.title}
      className={`
        ${
          props.disabled || disabled ? "cursor-not-allowed" : "cursor-pointer"
        } inline-flex items-center bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 overflow-hidden min-w-10 min-h-10 lg:min-w-14 lg:min-h-14 rounded-full justify-center
        ${props.classNames ? props.classNames : ""}`}
    >
      {props.children}
    </button>
  );
}
