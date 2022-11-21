const canvas = document.getElementById('scene');


let width = canvas.offsetWidth;
let height = canvas.offsetHeight; 

const ctx = canvas.getContext('2d');

function onResize () {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    
    if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
    }
    else {
        canvas.width = width;
        canvas.height = height;
    }
}
window.addEventListener('resize', onResize);
onResize();

let PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
let PROJECTION_CENTER_X = width / 2; // x center of the canvas
let PROJECTION_CENTER_Y = height / 2-200; // y center of the canvas
const FOV = 100;
const scale = 200;
let vertex=[[0.000000,0.004141,-0.035145],
[0.030437,0.004141,-0.017573],
[0.030437,0.004141,0.017573],
[0.000000,0.004141,0.035145],
[-0.030437,0.004141,0.017573],
[-0.030437,0.004141,-0.017573],
[0.030436,1.579999,-0.017573],
[-0.000000,1.579999,-0.035145],
[0.030436,1.579999,0.017573],
[-0.000000,1.579999,0.035145],
[-0.030437,1.579999,0.017573],
[-0.030437,1.579999,-0.017573],
[-0.030027,1.424375,0.017573],
[-0.030027,1.424375,-0.017573],
[-0.030027,1.482743,0.017573],
[-0.030027,1.482743,-0.017573],
[-0.301164,1.308482,0.004422],
[-0.301164,1.308482,-0.004422],
[-0.301164,1.598636,-0.004422],
[-0.301164,1.598636,0.004422],
[-0.030027,1.463287,0.017573],
[-0.030027,1.443831,0.017573],
[-0.030027,1.463287,-0.017573],
[-0.030027,1.443831,-0.017573],
[-0.388505,1.501918,0.004422],
[-0.388505,1.405200,0.004422],
[-0.388505,1.501918,-0.004422],
[-0.388505,1.405200,-0.004422]];
let polygon=[
    [2, 7, 9],
    [9, 3, 2],
    [3, 9, 10 ],
    [10, 4, 3],
    [4, 10, 11],
    [4, 11, 5],
    [5, 11, 12],
    [5, 12, 6],
    [6, 12, 8],
    [6, 8, 1],
    [7, 10, 9],
    [10, 12, 11],
    [1, 8, 7],
    [1, 7, 2],
    [25, 20, 19],
    [25, 19, 27],
    [21, 15, 20],
    [21, 20, 25],
    [14, 13, 17],
    [14, 17, 18],
    [24, 14, 18],
    [24, 18, 28],
    [15, 16, 19],
    [15, 19, 20],
    [16, 23, 27],
    [16, 27, 19],
    [23, 24, 28],
    [23, 28, 27],
    [13, 22, 26],
    [13, 26, 17],
    [22, 21, 25],
    [22, 25, 26],
    [17, 26, 28],
    [17, 28, 18],
    [26, 25, 27],
    [26, 27, 28],
    [7, 8, 10],
    [10, 8, 12],
    [5, 1, 4],
    [2, 4, 1],
    [5, 6, 1],
    [2, 3, 4]];
//vjv u .obj imas v/v/v v/v/v v/v/v, moras ostavit prvi v od svakog trojca, ako ih je 4 imas pravokutnik
//iduce probaj prebacit koordinate iz kartezijevog u polarni sustav, tako ih mos lagano rotirat
class Dot {
    constructor(i) {
        this.v1 = vertex[polygon[i][0]-1];
        this.v2 = vertex[polygon[i][1]-1];
        this.v3 = vertex[polygon[i][2]-1];

        this.v1Projected = [];
        this.v2Projected = [];
        this.v3Projected = [];
    }
    project() {
            this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.v1[2]*FOV);
            this.v1Projected[0] = (this.v1[0] * this.scaleProjected)*scale + PROJECTION_CENTER_X;
            this.v1Projected[1] = (this.v1[1] * this.scaleProjected)*scale + PROJECTION_CENTER_Y;

            this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.v2[2]*FOV);
            this.v2Projected[0] = (this.v2[0] * this.scaleProjected)*scale + PROJECTION_CENTER_X;
            this.v2Projected[1] = (this.v2[1] * this.scaleProjected)*scale + PROJECTION_CENTER_Y;

            this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.v3[2]*FOV);
            this.v3Projected[0] = (this.v3[0] * this.scaleProjected)*scale + PROJECTION_CENTER_X;
            this.v3Projected[1] = (this.v3[1] * this.scaleProjected)*scale + PROJECTION_CENTER_Y;
    }
      // Draw the dot on the canvas
    draw() {    
        ctx.beginPath();
        ctx.fillStyle="#F00";
            ctx.moveTo(this.v1Projected[0], this.v1Projected[1]);
            ctx.lineTo(this.v2Projected[0], this.v2Projected[1]);
            ctx.lineTo(this.v3Projected[0], this.v3Projected[1]);
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.restore();
        ctx.closePath();
        ctx.fillStyle="#00FFFF";
        ctx.stroke();
        
    }
}
let dots=[];
for (let i = 0; i < polygon.length; i++) {
    dots.push(new Dot(i));
}

function render() {
    // Clear the scene from top left to bottom right
    ctx.clearRect(0, 0, width, height);
    
    /*for (var i = 0; i < dots.length; i++){
        dots[i].project();
    }ako cu animirati moram svaki frame projectat*/
    
    // Loop through the dots array and draw every dot
    for (var i = 0; i < dots.length; i++) {
      dots[i].draw();
    }
    // Request the browser the call render once its ready for a new frame

    //Isto sluzi za renderat svaki frame
    //window.requestAnimationFrame(render);
  }
for (var i = 0; i < dots.length; i++){
    dots[i].project();
}
dots.sort(function(dot1, dot2) {
    return (dot2.v1[2]+dot2.v2[2]+dot2.v3[2])-(dot1.v1[2]+dot1.v2[2]+dot1.v3[2]);
  });
render();