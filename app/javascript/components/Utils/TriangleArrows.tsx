import React from "react";
import { FacingDirections } from "../../types/GameTypes";

export const ArrowUp = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-current"
  >
    <polygon points="5,2 2,8 8,8" fill="currentColor" />
  </svg>
);
export const ArrowDown = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-current"
  >
    <polygon points="2,2 8,2 5,8" fill="currentColor" />
  </svg>
);
export const ArrowLeft = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-current"
  >
    <polygon points="2,5 8,2 8,8" fill="currentColor" />
  </svg>
);
export const ArrowRight = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-current"
  >
    <polygon points="8,5 2,2 2,8" fill="currentColor" />
  </svg>
);

export default function TriangleArrows(props: {
  direction: FacingDirections | undefined;
}) {
  const { direction } = props;
  const vocationIcons: Record<FacingDirections, React.ReactElement> = {
    N: <ArrowUp />,
    E: <ArrowRight />,
    S: <ArrowDown />,
    W: <ArrowLeft />,
  };

  return vocationIcons[direction || "N"];
}
