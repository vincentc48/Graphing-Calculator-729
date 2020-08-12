import React from "react";
import Screen from "./Components/Screen.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        screenWidth: 700,
        screenHeight: 400,
        resolution: 10000, //how many points on the graph you want, separated by a constant x value
        graphWidthUnits: 10, //how mnay units on the x axis for this display
        graphHeightUnits: 11,
        xOffset: -3, //offset from center in GRAPH UNITS, not pixels, in positive x direction in graph. can be a decimal
        yOffset: 3, //postive y direction is UP.
        zoomFactor: 1,
        calcPrecision: 100000, //Used when calculating intersection, how many x values you want to check
        arrowIncrements: 100, //when press left/right arrow, what fraction of the screen to increment
        colorArray: ["blue", "red", "green", "purple"],
      },
    };
  }

  setCanvasSetting = (name, value) => {
    const { settings } = { ...this.state };
    const currentState = settings;
    currentState[name] = value;
    this.setState({ settings: currentState });
  };

  render() {
    return (
      <div>
        <Screen
          settings={this.state.settings}
          changeSettingsFunction={this.setCanvasSetting}
        />
        <div id="gs-container"></div>
      </div>
    );
  }
}

export default App;
