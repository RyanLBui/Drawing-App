let canvas;
let ctx;
let savedImageData;
let dragging = false;
let strokeColor = 'black';
let fillcolor = 'black';
let lineWidth = 2;
let polygonSides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;


class ShapeBoundingBox
{
    constructor(left, top, width, height)
    {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

class MouseDownPos
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

class Location
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

class PolygonPoint
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}

let shapeBoundingBox = new ShapeBoundingBox(0, 0, 0, 0);
let mouseDown = new MouseDownPos(0,0);
let loc = new Location(0,0);

// call function to setup canvas when page loads
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas()
{
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    canvas.addEventListener("mousedown", ReactToMouseDown);
    canvas.addEventListener("mousemove", ReactToMouseMove);
    canvas.addEventListener("mouseup", ReactToMouseUp);
}

function ChangeTool(toolClicked)
{
    document.getElementById('open').className = "";
    document.getElementById('save').className = "";
    document.getElementById('brush').className = "";
    document.getElementById('line').className = "";
    document.getElementById('rectangle').className = "";
    document.getElementById('circle').className = "";
    document.getElementById('ellipse').className = "";
    document.getElementById('polygon').className = "";
    
    // highlight last selected toool
    document.getElementById(toolClicked).className = 'selected';
    currentTool = toolClicked;
    
}

// get mouse position
function GetMousePosition(x,y)
{
    // return text rectangle object
    let canvasSizeData = canvas.getBoundingClientRect();
    
    return
    {
        x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height)
    };
}

// save canvas image
function SaveCanvasImage()
{
    savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// redraw canvas image
function RedrawCanvasImage()
{
    ctx.putImageData(savedImageData);
}


// update rubberband size data
function UpdateRubberbandSizeData(loc)
{
    // width where clicked vs current position
    shapeBoundingBox.width = Math.abs(loc.x - mouseDown.x);
    
    shapeBoundingBox.height = Math.abs(loc.y - mouseDown.y);
    
    //how to draw rect dpeending on dirrection dragged
    if(loc.x > mouseDown.x)
    {
        shapeBoundingBox.left = mouseDown.x;
    }
    else
    {
        shapeBoundingBox.left = loc.x;
    }
    
    if(loc.y > mouseDown.y)
    {
        shapeBoundingBox.top = mouseDown.y;
    }
    else
    {
        shapeBoundingBox.top = loc.y;
    }
    
}

// get angle using x and y position trig
// x = adjacent
// y = opposite
// tan(angle) = opposite / adjacent
// angle = arcTan(opposite/adjacent)
function getAngleUsingXandY(mouselocX, mouselocY)
{
    let adjacent = mouseDown.x - mouselocX;
    let opposite = mouseDown.y - mouselocY;
    
    //atan2 calculates arctangent
    return radiansToDegrees(Math.atan2(opposite, adjacent));
}

// radians to degrees
function radiansToDegrees(rad)
{
    // reutrn degree value with 2 decimal points.
    return (rad * (180/Math.PI)).toFixed(2);
}

// degrees to radians
function degreesToRadians(degrees)
{
    return degrees * (Math.PI/180);
}

// draw rubberband shape


// update rubberband on move

// react to mouse down
// pass e - event
function reactToMouseDown(e)
{
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    SaveCanvasImage();
    mouseDown.x = loc.x;
    mouseDown.y = loc.y;
    dragging = true;
    
    // TODO HANDLE BRUSH
}

// react to mouse move
function reactToMouseMove(e)
{
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    //TODO HAndle BRush
}

// react to mouse up
function reactToMouseUp(e)
{
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}

// save image
function saveImage()
{
    var imageFile = document.getElementById('img-file');
    imageFile.setAttribute('download', 'image.png');
    imageFile.setAttribute('href', canvas.toDataURL());
}

// open image
function OpenImage()
{
    let img = new Image();
    img.onload = function()
    {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0,0);
    }
    img.src = 'image.png';
}



