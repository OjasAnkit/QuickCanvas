// ************************* Initializing canvas and variables ************************* //

// insider querySelector to select a class use dot(.) and for an ID use #

// getting the tool bar
const toolBar = document.querySelector(".tool-bar");
const toolsArr = document.querySelectorAll(".tool");

// loading the canvas element from HTML
const canvas = document.querySelector("#canvas");
const canvasClass = document.querySelector(".canvas");

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

// ************************* Getting the tool selected by the user & calling functions ************************* //

let undoStack = [];
let redoStack = [];
let currentTool = "black-pencil";

//  fetching the id of the tool element that was clicked
for (let i = 0; i < toolsArr.length; i++) {
  toolsArr[i].addEventListener("click", function (e) {
    const toolSelected = toolsArr[i].id;
    console.log(toolSelected);
    if (toolSelected == "black-pencil") {
      currentTool = "black-pencil";
      tool.strokeStyle = "black";
      tool.lineWidth = "1";
      setCursor("pen-cursor");
      drawWithPencil();
    } else if (toolSelected == "eraser") {
      currentTool = "eraser";
      tool.strokeStyle = "white";
      tool.lineWidth = "15";
      setCursor("eraser-cursor");
      drawWithPencil();
    } else if (toolSelected == "addStickyNote") {
      currentTool = "addStickyNote";
      createSticky();
      setCursor();
    } else if (toolSelected == "imageUpload") {
      currentTool = "imageUpload";
      uploadImage();
      setCursor();
    } else if (toolSelected == "download") {
      currentTool = "download";
      downloadFile();
      setCursor();
    } else if (toolSelected == "undo") {
      currentTool = "undo";
      undoFunction();
      setCursor();
    } else if (toolSelected == "redo") {
      currentTool = "redo";
      redoFunction();
      setCursor();
    } else if (toolSelected == "trash") {
      currentTool = "trash";
      // clearing out the canvas
      tool.clearRect(0, 0, canvas.width, canvas.height);

      // checking if there are any sticky elements to clear
      let sticky = document.getElementsByClassName("sticky");
      while (sticky[0]) {
        sticky[0].parentNode.removeChild(sticky[0]);
      }

      setCursor();
    }
  });
}

// ************************* Defining tool functionalities ************************* //

function drawWithPencil() {
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

    let pointHistory = {
      x: startX,
      y: e.clientY - toolBar.getBoundingClientRect().height,
      desc: "md",
    };

    if (currentTool == "black-pencil") undoStack.push(pointHistory);
  });

  canvas.addEventListener("mousemove", function (e) {
    if (drawingFlag == false) return;
    let endX = e.clientX;
    let endY = e.clientY - toolBar.getBoundingClientRect().height;

    tool.lineTo(endX, endY);
    tool.stroke();

    let pointHistory = {
      x: endX,
      y: e.clientY - toolBar.getBoundingClientRect().height,
      desc: "mm",
    };
    if (currentTool == "black-pencil") undoStack.push(pointHistory);
  });

  canvas.addEventListener("mouseup", function (e) {
    if (drawingFlag == false) return;
    let endX = e.clientX;
    let endY = e.clientY - toolBar.getBoundingClientRect().height;

    tool.lineTo(endX, endY);
    tool.stroke();
    drawingFlag = false;
  });
}

function createOuterSticky() {
  // creating the structure for sticky notes
  let sticky = document.createElement("div");
  let stickyNavigation = document.createElement("div");
  let minimize = document.createElement("div");
  let close = document.createElement("div");

  // adding class for styling
  sticky.setAttribute("class", "sticky");
  stickyNavigation.setAttribute("class", "sticky-navigation");

  close.setAttribute("class", "close");
  minimize.setAttribute("class", "minimize");

  // creating the tree structure
  sticky.appendChild(stickyNavigation);
  stickyNavigation.appendChild(minimize);
  stickyNavigation.appendChild(close);

  // adding sticky to page
  document.body.appendChild(sticky);

  // adding close div functionality
  close.addEventListener("click", function () {
    sticky.remove();
  });

  // adding the functionality for moving the sticky note around
  let isMouseDown = false;

  stickyNavigation.addEventListener("mousedown", function (e) {
    // initial points
    initialX = e.clientX;
    initialY = e.clientY;
    isMouseDown = true;
  });

  stickyNavigation.addEventListener("mousemove", function (e) {
    if (isMouseDown == true) {
      // final points
      let finalX = e.clientX;
      let finalY = e.clientY;
      console.log(finalX, finalY);
      // distance moved
      let dx = finalX - initialX;
      let dy = finalY - initialY;

      let { top, left } = sticky.getBoundingClientRect();
      sticky.style.top = top + dy + "px";
      sticky.style.left = left + dx + "px";

      initialX = finalX;
      initialY = finalY;
    }
  });

  stickyNavigation.addEventListener("mouseup", function (e) {
    isMouseDown = false;
  });

  return sticky;
}

function createSticky() {
  let isMinimized = false;

  let sticky = createOuterSticky();
  let minimize = sticky.querySelector(".minimize");
  let textArea = document.createElement("textarea");
  textArea.setAttribute("class", "text-area");
  sticky.appendChild(textArea);

  minimize.addEventListener("click", function () {
    textArea.style.display = isMinimized == true ? "block" : "none"; // if minimized -> maximize, if maximized -> minimize
    isMinimized = !isMinimized;
  });
}

function uploadImage() {
  // whenever the user clicks the upload button this function will be invoked.
  // Inside this fn we have defined the input tag to be input element from HTML,
  // and we have added the command to click on the input button

  let inputTag = document.querySelector(".input-tag");
  console.log("Inside upload image function");
  inputTag.click();

  // checking for when the user uploads a file
  inputTag.addEventListener("change", function () {
    console.log(inputTag.files[0].name);
    let data = inputTag.files[0]; // accessing the image that was uploaded (it is present at the 0 index)
    let img = document.createElement("img");
    img.class = "img";
    let file_url = URL.createObjectURL(data); // getting the base 64 url for the image that was uploaded
    img.src = file_url; //assigning the source of the img as the base 64 url of the uploaded image

    img.setAttribute("class", "uploaded-img");
    let sticky = createOuterSticky();
    let minimize = document.querySelector(".minimize");
    sticky.appendChild(img);
    let isMinimized = false;

    minimize.addEventListener("click", function () {
      img.style.display = isMinimized == true ? "block" : "none"; // if minimized -> maximize, if maximized -> minimize
      isMinimized = !isMinimized;
    });
  });
}

function downloadFile() {
  // creating anchor element
  let a = document.createElement("a");

  // making it a download anchor element, and setting the file name for the downloaded file
  a.download = "file.png";

  // convert board to base64 URL
  let urlBoard = canvas.toDataURL("image/jpeg;base64");

  //  set href of anchor as url
  a.href = urlBoard;

  // triggering download
  a.click();

  // removing anchor
  a.remove();
}

function redraw() {
  for (let i = 0; i < undoStack.length; i++) {
    let { x, y, desc } = undoStack[i];
    if (desc == "md") {
      tool.beginPath();
      tool.moveTo(x, y);
    } else if (desc == "mm") {
      tool.lineTo(x, y);
      tool.stroke();
    }
  }
}

function undoFunction() {
  // we will basically clear the whole canvas and then redraw the entire thing just without the last point,
  // we will keep popping things whenever the undo button is hit until the stack becomes upto

  if (undoStack.length > 0) {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    redoStack.push(undoStack.pop());

    // redrawing the canvas
    redraw();
  }
}

function redoFunction() {
  if (redoStack.length > 0) {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    undoStack.push(redoStack.pop());

    // redrawing the canvas
    redraw();
  }
}

function setCursor(tool = "default") {
  console.log("inside cursor fn : ", tool);
  canvasClass.classList.remove("pen-cursor", "eraser-cursor", "default");
  canvasClass.classList.add(tool);
  console.log(canvasClass.classList);
  return;
}

// ***** Personal Notes and Comments ******* //

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

// for undo we can use a stack. There is no undo functionality given by the canvas
