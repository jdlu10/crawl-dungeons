import React from "react";
import { createRoot } from "react-dom/client";

import Campaigns from "./campaigns";

// Clear the existing HTML content
// document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById("game"));
root.render(<Campaigns />);
