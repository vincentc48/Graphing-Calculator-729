import React from "react";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: this.props.settings,
      equations: [(x) => x * x - 2, (x) => Math.cos(x - 2)],
      selectedEquation: 0,
      xLocation: 0,
    };
  }

  componentDidMount() {
    let canvas = document.querySelector("#canvas");
    canvas.height = this.state.settings.screenHeight;
    canvas.width = this.state.settings.screenWidth;

    let canvasContainer = document.getElementById("canvas-container");
    canvasContainer.style.height = canvas.height + "px";
    canvasContainer.style.width = canvas.width + "px";
    canvasContainer.style.backgroundColor = "lightgrey";

    var ctx = canvas.getContext("2d");

    /******SETTINGS, Reset as variables from the state.settings object, must do this to avoid binding to state******/

    var resolution = this.state.settings.resolution; //how many points on the graph you want, separated by a constant x value
    var graphWidthUnits = this.state.settings.graphWidthUnits; //how mnay units on the x axis for this display
    var graphHeightUnits = this.state.settings.graphHeightUnits;

    var ppuX = canvas.width / graphWidthUnits; //PIXELS PER UNIT. use width as baseline for this.
    var ppuY = canvas.height / graphHeightUnits;

    var xOffset = this.state.settings.xOffset; //offset from center in GRAPH UNITS, not pixels, in positive x direction in graph. can be a decimal
    var yOffset = this.state.settings.yOffset; //postive y direction is UP.
    var zoomFactor = this.state.settings.zoomFactor;
    var calcPrecision = this.state.settings.calcPrecision; //Used when calculating intersection, how many x values you want to check
    var arrowIncrements = this.state.settings.arrowIncrements; //when press left/right arrow, what fraction of the screen to increment
    var colorArray = this.state.settings.colorArray;

    //REMEMBER x Axis is offset by y value, and y axis is offset by x value.
    var xAxis = canvas.height * 0.5 - yOffset * ppuY; //MINUS because positive y in cartesian coordinate units is negative in html canvas pixels
    var yAxis = canvas.width * 0.5 + xOffset * ppuX;

    /*****SETUP *****/

    //Add x axis
    ctx.moveTo(0, xAxis);
    ctx.lineTo(canvas.width, xAxis);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();

    //Add y axis
    ctx.moveTo(yAxis, 0);
    ctx.lineTo(yAxis, canvas.height);
    ctx.stroke();

    //Draw unit markers on both axes
    const markerLength = canvas.width / 90;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.lineCap = "round";
    var startingXUnits = Math.round(-graphWidthUnits / 2 - xOffset); //only mark on whole number, round off to nearest int.
    //MINUS xOffset because you start lower if you offset to the positive direction
    console.log(startingXUnits);
    for (var i = 0; i < graphWidthUnits; i++) {
      var currentXPixels = yAxis + (startingXUnits + i) * ppuX;
      ctx.beginPath();
      ctx.moveTo(currentXPixels, xAxis);
      ctx.lineTo(currentXPixels, xAxis - markerLength);
      ctx.stroke();
    }
    var startingYUnits = Math.round(-graphHeightUnits / 2 - yOffset);
    //MINUS yOffset, because if you offset up, you start lower. this is in units, so worry about pixels and direction in the for loop
    for (var i = 0; i < graphHeightUnits; i++) {
      var currentYPixels = xAxis - (startingYUnits + i) * ppuY; //MINUS HERE because positive y in pixels is down.
      ctx.beginPath();
      ctx.moveTo(yAxis, currentYPixels);
      ctx.lineTo(yAxis + markerLength, currentYPixels);
      ctx.stroke();
    }

    /*******GRAPHING AND EQUATIONS */

    //**STATE */
    var equations = this.state.equations;
    var selectedEquation = 0; //index of equations array
    var xLocation = 0; //in Coordinates

    for (var i in equations) {
      graph(equations[i], resolution, chooseColor(i), 3);
    }

    //**ALL FUNCTIONS (Move to different document) */
    function graph(equationParam, resolutionParam, color, weight) {
      var increment = canvas.width / resolutionParam;
      var currentXUnits = -graphWidthUnits / 2 - xOffset; //this will give you the rightmost x value to display.
      console.log(currentXUnits);
      var currentXPixels = 0;
      var currentYPixels = 0; //this will change depending on X and the function, '0' is just a placeholder and doesn't start at 0

      ctx.beginPath();
      //start drawing;
      ctx.lineWidth = weight;
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      while (currentXPixels <= canvas.width) {
        //first put into the equation to get y units, then convert to pixels and then MINUS from axis position, because - is up.
        currentYPixels = xAxis - equationParam(currentXUnits) * ppuY;
        ctx.lineTo(currentXPixels, currentYPixels);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(currentXPixels, currentYPixels);
        currentXUnits += graphWidthUnits / resolutionParam;
        currentXPixels = yAxis + currentXUnits * ppuX;
      }
    }

    function roundTo(numberParam, exponentParam) {
      var newNum = Math.round(numberParam / Math.pow(10, exponentParam));
      return newNum * 10 ** exponentParam;
    }

    //returns array of length 2: [x in pixels, y in pixels]
    function toPixels(xCoord, yCoord) {
      return [yAxis + xCoord * ppuX, xAxis - yCoord * ppuY];
    }

    //returns array of length 2: [x in coordinates, y in coordinates]
    function toCoordinates(xPixels, yPixels) {
      return [(xPixels - yAxis) / ppuX, -(yPixels - xAxis) / ppuY];
    }

    function askIntersection() {
      var arr = [0, 0, 0, 0]; // indices: 0: first equation, 1: second equation, 2: left x, 3: right x
      var instructions = [
        "Choose First Curve",
        "Choose Second Curve",
        "To the Left",
        "To The Right",
        "Press 'ENTER' to Calculate",
      ]; //instructions indexed by step
      var index = 0;
      document.getElementById("canvas-upperright-label").textContent =
        instructions[index];
      document.getElementById("buttonid").addEventListener("click", () => {
        if (index < 4) {
          if (index < 2) arr[index] = equations[selectedEquation];
          else arr[index] = xLocation;
          index++;
          document.getElementById("canvas-upperright-label").textContent =
            instructions[index];
        } else {
          var intersect = intersection(
            arr[2],
            arr[3],
            arr[0],
            arr[1],
            calcPrecision
          );
          document.getElementById("canvas-lowerleft-label").textContent =
            "X: " + intersect[0] + " Y:" + intersect[1];
          movePointerTo(pointer, arr[0], intersect[0]);
          return;
        }
      });
    }

    function intersection(
      leftX,
      rightX,
      functionOne,
      functionTwo,
      calcPrecision
    ) {
      var increment = Math.abs(rightX - leftX) / calcPrecision;
      var mindist = null;
      var xIntersect = leftX;
      for (var x = leftX; x <= rightX; x += increment) {
        var currentDist = Math.abs(functionOne(x) - functionTwo(x));
        if (mindist == null || currentDist < mindist) {
          mindist = currentDist;
          xIntersect = x;
        }
      }
      return [xIntersect, functionOne(xIntersect)];
    }

    //change in react
    function switchEquation(updown) {
      if (updown) {
        if (selectedEquation >= equations.length - 1) selectedEquation = 0;
        else selectedEquation++;
      } else {
        if (selectedEquation <= 0) selectedEquation = equations.length - 1;
        else selectedEquation--;
      }
      document.querySelector("#canvas-upperleft-label").textContent =
        equations[selectedEquation];
    }

    //check restrictions so the pointer doesn't go off the page or into restricted domain
    function canIncrement(futureXValue, functionParam) {
      return !(
        futureXValue < -graphWidthUnits / 2 - xOffset ||
        futureXValue > graphWidthUnits / 2 - xOffset ||
        !functionParam(futureXValue) ||
        functionParam(futureXValue) < -graphHeightUnits / 2 - yOffset ||
        functionParam(futureXValue) > graphHeightUnits / 2 - yOffset
      );
    }

    //move pointer for an increment
    function movePointerTo(pointerParam, functionParam, xParam) {
      var pixels = toPixels(xParam, functionParam(xParam));
      if (!pixels[1]) return (pointerParam.style.display = "none"); //check if in the domain, if not, hide the pointer
      if (pointerParam.style.display == "none")
        // if hidden and back in domain, show again
        pointerParam.style.display = "block";
      pointerParam.style.left = pixels[0] + "px";
      pointerParam.style.top = pixels[1] + "px";
    }

    function chooseColor(index) {
      return colorArray[index % colorArray.length];
    }

    function pressArrow(e) {
      switch (e.keyCode) {
        //left
        case 37:
          //check if you do increment it, will it be valid. if not return, if so, actually increment it
          if (
            !canIncrement(
              xLocation - canvas.width / arrowIncrements / ppuX,
              equations[selectedEquation]
            )
          )
            return;
          xLocation -= canvas.width / arrowIncrements / ppuX;
          break;
        //up
        case 38:
          switchEquation(true);
          break;
        //right
        case 39:
          if (
            !canIncrement(
              xLocation + canvas.width / arrowIncrements / ppuX,
              equations[selectedEquation]
            )
          )
            return;
          xLocation += canvas.width / arrowIncrements / ppuY;
          break;
        //down
        case 40:
          switchEquation(false);
          break;
      }
      movePointerTo(pointer, equations[selectedEquation], xLocation);
    }

    //**ALL FUNCTIONS END*** //

    let pointer = document.getElementById("canvas-marker");

    canvas.addEventListener("mousedown", (e) => {
      pointer.style.display = "block";
      pointer.style.top = e.offsetY + "px";
      pointer.style.left = e.offsetX + "px";
      var coords = toCoordinates(e.offsetX, e.offsetY);
      document.getElementById("gs-container").textContent =
        coords[0].toFixed(1) + "," + coords[1].toFixed(1);
      xLocation = coords[0];
    });

    document.onkeydown = pressArrow;

    askIntersection();
    askIntersection();
  }

  clickButton = () => {};

  render() {
    return <canvas id="canvas"></canvas>;
  }
}

export default Canvas;
