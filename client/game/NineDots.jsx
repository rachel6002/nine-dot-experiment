import React, { useRef, useEffect } from "react";
import './NineDotsDesign.css';

const canvasID = "nine-dots-canvas";
var message = "";
var roundsLeft = 5;
var currGame;

function Body (prop) {
    this.canvas = prop;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
}

Body.prototype = {
    getCanvas: function () {
        return this.canvas;
    },

    getBodyContext: function() {
        return this.canvas.getContext("2d");
    },

    get: function(x) {
        return this[x];
    }
}

function Coordinate (x, y, context) {
    this.x = x;
    this.y = y;
    this.radius = 4;
    this.context = context;
    this.visited = false;
    this.dot = false;
    this.color = "white";
}

Coordinate.prototype = {

    getX: function() {
        const spacing = this.context.get("height") / (Screen.prototype.size + 1);
        return spacing + this.x * spacing;
    },

    getY: function() {
        const spacing = this.context.get("height") / (Screen.prototype.size + 1);
        return spacing + this.y * spacing; 
    },

    updateVisited: function(visited) {
        this.visited = true;
        this.color = this.visited? "green" : "red";
    },

    drawDot: function() {
        if (this.dot) {
            const dotContext = this.context.getBodyContext();

            dotContext.strokeStyle = this.color;
            dotContext.fillStyle = this.color;
            dotContext.lineWidth = 1;
            dotContext.beginPath();
            dotContext.arc(this.getX(), this.getY(), this.radius, 0, 2 * Math.PI);
            dotContext.fill();
            dotContext.stroke();
        }
    },

    isEqual: function(other) {
        return this.x === other.x && this.y === other.y && other;
    } 
}

function Screen (context) {
    size: 9,
    this.context = context;
    this.coordinates = new Array(9);

    for (i = 0; i < 9; ++i) {
        this.coordinates[i] = new Array(9);
        for (j = 0; j < 9; ++j) {
            this.coordinates[i][j] = new Coordinate(i, j, context);
        }
    }
    
    for (dot of this.getDots()) {
        dot.dot = true;
    }
    
}

Screen.prototype = {
    getDots: function() {
        const dots = new Array(9);
        const spacing = 2;
        var index = 0;
        for (i = 0; i < 3; ++i) {
            for (j = 0; j < 3; ++j) {
                dots[index] = this.coordinates[spacing + spacing * i][spacing + spacing * j];
                index++;
            }
        }
        return dots;
    },

    printScreen: function() {
        var row;
        var col; 

        for (row of this.coordinates) {
            for (col of row) {
                col.drawDot();
            }
        }
    },

    getCoordinates: function(screenPos) {
        var spacing = this.context.height / (Screen.prototype.size + 1);
        var screenCoordinates = Math.round((screenPos - spacing)/spacing);
        screenCoordinates = Math.max (0, screenCoordinates);
        screenCoordinates = Math.min(screenCoordinates, Screen.prototype.size - 1);
        return screenCoordinates;
    },

    getCoordinate: function(x, y) {
        return this.coordinates[this.getCoordinates(x)][this.getCoordinates(y)];
    },

    getVisited: function() {
        return this.getDots().every(dot => dot.visited);
    },

    swap: function(v1, v2) {
        var temp = v2;
        v2 = v1;
        v1 = temp;
    },

    realign: function(v1, v2) {
        if (v1.x == v2.x) {
            if (v1.y > v2.y) {
                this.swap(v1, v2);
            }

            var y;
            var x = v1.x;

            for (y = v1.y; y <= v2.y; y++) {
                this.coordinates[x][y].updatePos(true);
            }
        } else {
            if (v1.x > v2.x) {
                this.swap(v1, v2);
            }

            var m = (v2.y - v1.y) / (v2.x - v2.x);
            var y = v1.y;
            var x;

            for (x = v1.x; x <= v2.x; x++) {
                if (Math.abs(Math.round(y) - y) < 0.0001) {
                    this.coordinates[x][Math.round(y)].updatePos(true);
                }
                y += m;
            }
        }
    },

    updatePos: function(line) {
        this.getDots().forEach(dot => dot.updateVisited(false));

        if(line.numVertices == 0) {
            line.currVertex.updateVisited(true);
        } else {
            var index;

            for (index = 0; index < line.numVertices - 1; index++) {
                this.realign(line.vertices[index], line.vertices[index+1]);
            }
            this.realign(line.vertices[line.numVertices - 1], line.currVertex);
        }
    }

}

function Line (context) {
    this.context = context;
    this.vertices = new Array(this.maxVertices);
    this.numVertices = 0;
    this.currVertex = null;
}

Line.prototype = {

    maxVertices: 5,

    hasReachedMax: function() {
        return Line.prototype.maxVertices == this.numVertices;
    },
    
    expand: function(currVertex, newVertex) {
        this.currVertex = newVertex;
        if ((!this.vertices[this.numVertices-1].isEqual(newVertex) || this.numVertices == 0) && !newVertex) {
            this.vertices[this.numVertices] = newVertex;
            this.numVertices++;
        }
        
    },

    draw: function () {
        if (this.numVertices <= 0) {
            return;
        }
        var i;
        var canvas = this.context.getBodyContext();
        
        canvas.strokeStyle = 'green';
        canvas.lineWidth = 2;
        canvas.beginPath();

        for (i = 0; i < this.numVertices; i++) {
            if (i == 0) {
                canvas.moveTo(this.vertices[i].getX(), this.vertices[i].getY());
            } else {
                canvas.lineTo(this.vertices[i].getX(), this.vertices[i].getY())
            }
        }
        canvas.lineTo(this.currVertex.getX(), this.currVertex.getY());
        canvas.fill();
        canvas.stroke();
    }
}

function NineDots (game) {
    this.context = game;
    this.canvas = this.context.canvas;
    this.drawingCanvas = this.context.getBodyContext();
    this.width = this.context.width;
    this.height = this.context.height;
    this.canvas.style.cursor = "default";
    this.canvas.addEventListener("click", this.handleOnClick.bind(this));
    this.canvas.addEventListener("cursor", this.handleCursorMove.bind(this));
    message = "";
    this.roundLeft = 5;
}

NineDots.prototype = {
    start: function () {
        this.screen = new Screen(this.context);
        this.line = new Line(this.context);
        this.gameEnded = false;
        this.isSolved = false;
        this.roundLeft -= 1;
        roundsLeft = this.roundLeft;
        this.loadScreen();
    },
    loadScreen: function () {
        this.drawingCanvas.fillStyle = "gray";
        this.drawingCanvas.fillRect(0,0, this.width, this.height);
        this.screen.printScreen();
        this.line.draw();
    },
    handleCursorMove: function(e) {
        if (!this.gameEnded) {
            var point = this.screen.getCoordinate(this.getMoveX(e), this.getMoveY(e));
            this.line.expand(point, true);
            this.screen.updateVisited(this.line);
            this.loadScreen();
        }
    },
    handleOnClick: function(e) {
        if (!this.gameEnded) {
            var point = this.screen.getCoordinate(this.getMoveX(e), this.getMoveY(e));

            this.line.expand(point);
            this.screen.updatePos(this.line);
            this.loadScreen();

            if(this.line.hasReachedMax()) {
                this.gameEnded = true;
                this.isSolved = this.screen.visited();
            }
        }
    },

    displayMessage: function(solved) {
        if (solved) {
            message = "Congratulations, you have solved the problem.";
        } else {
            message = "Maximum attempt reached. The dots are not fully connected.";
        }
    },

    getMoveX: function (e) {
        return e.clientX - this.canvas.getBoundingClientRect().left;
    },

    getMoveY: function (e) {
        return e.clientY - this.canvas.getBoundingClientRect().top;
    },
}

export default function GameRunner() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const context = canvasRef.current;
        if (roundsLeft > 4) {
            (new NineDots(new Body(context))).start();
        }
    },[]);
    return (
        <div className="NineDotsMain">
            <canvas ref={canvasRef} height={300} width={300}/>
            
            <h4 className="linesLeftReminder">
                Remaining Lines: {Math.max(4,roundsLeft)}
            </h4>
            <h4 className="gameMessage">
                {message}
                </h4>   
        </div>
          
    ); 
}