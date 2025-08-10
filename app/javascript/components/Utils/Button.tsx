import React from "react";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  classNames?: string;
};

export default function Button(props: ButtonProps) {
  const [disabled, setDisabled] = React.useState(false);

  const handleClick = () => {
    if (!props.disabled && !disabled) {
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
      className={`
        ${
          props.disabled || disabled ? "cursor-not-allowed" : "cursor-pointer"
        } mb-5 inline-flex items-center px-5 py-3 uppercase text-lg font-semibold text-center bg-gray-800/[var(--bg-opacity)] [--bg-opacity:50%] hover:[--bg-opacity:80%] rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 
        ${props.classNames ? props.classNames : ""}`}
    >
      {props.children}
    </button>
  );
}
