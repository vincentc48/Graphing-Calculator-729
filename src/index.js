import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <App
    settings={{
      screenWidth: 700,
      screenHeight: 400,
      resolution: 10000, //how many points on the graph you want, separated by a constant x value
      graphWidthUnits: 10, //how mnay units on the x axis for this display
      graphHeightUnits: 11,
      xOffset: -3, //offset from center in GRAPH UNITS, not pixels, in positive x direction in graph. can be a decimal
      yOffset: 3, //postive y direction is UP.
      zoomFactor: 1,
      calcPrecision: 10000, //Used when calculating intersection, how many x values you want to check
      arrowIncrements: 100, //when press left/right arrow, what fraction of the screen to increment
      colorArray: ["blue", "red", "green", "purple"],
    }}
  />,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
