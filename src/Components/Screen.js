import React from "react";
import Canvas from "./Canvas.js";

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: 0,
      screens: [
        <Canvas
          settings={this.props.settings}
          changeSettingsFunction={this.props.changeSettingsFunction}
        />,
      ],
    };
  }

  render() {
    return (
      <div id="canvas-container">
        <div id="canvas-marker"></div>
        <div id="canvas-upperleft-label"></div>
        <div id="canvas-lowerleft-label"></div>
        <div id="canvas-upperright-label"></div>
        <div id="main-content">
          {this.state.screens[this.state.currentScreen]}
        </div>
        <button type="button" id="buttonid">
          ENTER
        </button>
      </div>
    );
  }
}

export default Screen;
