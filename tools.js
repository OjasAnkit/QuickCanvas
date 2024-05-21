// insider querySelector to select a class use dot(.) and for an ID use #

// getting the tool bar
const toolBar = document.querySelector(".tool-bar");
const toolsArr = document.querySelectorAll(".tool");

// loading the canvas element from HTML
const canvas = document.querySelector("#canvas");

// assigning the height and width of the active window to the canvas. The inner height and inner width returns the height and width of the active window excluding the browser's user interface.
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// getting the rendering context
let tool;
if (canvas.getContext) {
  tool = canvas.getContext("2d");
  console.log("Getting the canvas context");
}

function toolSelect() {
  console.log("you selected a tool");
}

//  fetching the id of the tool element that was clicked
let currentTool = "black-pencil";

for (let i = 0; i < toolsArr.length; i++) {
  toolsArr[i].addEventListener("click", function (e) {
    const toolSelected = toolsArr[i].id;
    console.log(toolSelected);
    if (toolSelected == "black-pencil") {
      currentTool = "black-pencil";
      tool.strokeStyle = "black";
    } else if (toolSelected == "eraser") {
      currentTool = "eraser";
      tool.strokeStyle = "white";
      tool.lineWidth = "10";
    } else if (toolSelected == "addStickyNote") {
    } else if (toolSelected == "imageUpload") {
    } else if (toolSelected == "download") {
    } else if (toolSelected == "undo") {
    } else if (toolSelected == "redo") {
    } else if (toolSelected == "trash") {
    }
  });
}

// adding the draw functionality for pencil tool
// to implement pencil:
// mouse pressed on canvas => start point (coordinates)
// mouse lifted from canvas => end point (coordinates)

let drawingFlag = false;

canvas.addEventListener("mousedown", function (e) {
  let startX = e.clientX;
  let startY = e.clientY - toolBar.getBoundingClientRect().height; //subtracting the height of tool bar from Y coordinate

  drawingFlag = true;
  tool.beginPath();
  tool.moveTo(startX, startY);
});

canvas.addEventListener("mousemove", function (e) {
  if (drawingFlag == false) return;
  let endX = e.clientX;
  let endY = e.clientY - toolBar.getBoundingClientRect().height;

  tool.lineTo(endX, endY);
  tool.stroke();
});

canvas.addEventListener("mouseup", function (e) {
  if (drawingFlag == false) return;
  let endX = e.clientX;
  let endY = e.clientY - toolBar.getBoundingClientRect().height;

  tool.lineTo(endX, endY);
  tool.stroke();
  drawingFlag = false;
});

// ***** Personal Notes and Comments *******

// selecting the starting path of drawing
// tool.beginPath(); // this is to begin drawing on canvas, this is MANDATORY
// tool.moveTo(100, 100); // begin point from where you start drawing
// tool.lineTo(250, 500); // end point of your drawing
// tool.strokeStyle = "blue"; // this is basically setting the color of the stroke
// tool.stroke(); // after the move to and line to are defined, this is called to actually draw the line
// tool.strokeStyle = "red"; // this is basically setting the color of the stroke
// tool.closePath(); // this is optionally used to close the path

// tool.beginPath(); // this will create a new path altogether
// tool.moveTo(400, 500);
// tool.lineTo(567, 453);
// tool.lineTo(400, 650);
// tool.stroke();
