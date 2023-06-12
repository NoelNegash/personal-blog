var buzz
var currentContainer = 0

function drawGrid(p, scale = 160, x = 200, y = 200, spacing = 0.2, l=1) {

    var i = 0;
    var c = 0
    while(i*scale+x > 0) {
        i -= spacing
        c -= spacing
        if (c <= -l) c = 0
    }
    while(i*scale+x < p.width) {
        i += spacing
        c += spacing
        if (c >= l || Math.round(c*1000) == 0) {
            p.strokeWeight(Math.round(i*1000) ? 0.3 : 1)
            p.stroke(0)
            c = 0
        } else {
            p.strokeWeight(0.3)
            p.stroke(150, 150, 255)
        }
        p.line(i*scale+x, 0, i*scale+x, p.height)
    }


    var i = 0;
    var c = 0
    while(i*scale+y > 0) {
        i -= spacing
        c -= spacing
        if (c <= -l) c = 0
    }
    while(i*scale+y < p.height) {
        i += spacing
        c += spacing
        if (c >= l || Math.round(c*1000) == 0) {
            p.strokeWeight(Math.round(i*1000) ? 0.3 : 1)
            p.stroke(0)
            c = 0
        } else {
            p.strokeWeight(0.3)
            p.stroke(150, 150, 255)
        }
        p.line(0, i*scale+y, p.width, i*scale+y)
    }
}
function drawPoint(p, rx, ry, scale=160, x = 200, y = 200) {
    p.point(x+rx*scale, y-ry*scale)
}
function drawRect(p, rx, ry, w, h, scale=160, x = 200, y = 200) {
    p.rect(x+rx*scale, y-ry*scale, w*scale, h*scale)
}
function drawGraph(p, g, scale = 160, x = 200, y = 200) {

    for(var i = 1; i < g.length; i++) {
        p.line(x+g[i-1][0]*scale, y-g[i-1][1]*scale, x+g[i][0]*scale, y-g[i][1]*scale)
    }
}
function drawLine(p, rx1, ry1, rx2, ry2, scale = 160, x = 200, y = 200) {
    drawGraph(p, [[rx1, ry1], [rx2, ry2]], scale, x, y)
}

function drawImage(p, img, rx, ry,w = undefined, h = undefined, scale = 160, x = 200, y = 200) {
    if(w) p.image(img, x+rx*scale, y-ry*scale, w, h)
    else p.image(img, x+rx*scale, y-ry*scale)
}
function drawBuzz(p, rx, ry, slope = 0, dir = 1, scale = 160, x = 200, y = 200) {

    var angle = dir == 1 ? -Math.atan2(slope, 1)+Math.PI/2 : -Math.atan2(-slope, -1)+Math.PI/2
    
    p.imageMode(p.CENTER)

    p.push()
    p.translate(x+rx*scale, y-ry*scale)
    p.rotate(angle)
    p.image(buzz, 0, 0, 80, 80)
    p.pop()
}

function resetCanvas(i) {
    
    var p = containers[i]
    p.remove()
    containers[i] = new p5(window['container'+i], document.getElementById("canvas-container-"+i))
}
function resetPerceptron(i) {
    var p = containers[i]
    p.perceptron = [p.random(-1,1), p.random(-1,1),p.random(-1,1), p.random(-1,1),p.random(-1,1), p.random(-1,1),p.random(-1,1), p.random(-1,1)]

    currentContainer = i
}

function changeData(i, t) {
    var p = containers[i]
    p.data = []
    if (t == "lin") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,i])
        }
    } else if (t == "lindev") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,i+p.random(-0.05,0.05)])
        }
    } else if (t == "quad") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,i*i])
        }
    } else if (t == "quaddev") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,i*i+p.random(-0.05,0.05)])
        }
    } else if (t == "cub") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,i*i*i])
        }
    } else if (t == "cubdev") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,i*i*i+p.random(-0.05,0.05)])
        }
    } else if (t == "sin") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,Math.sin(i*Math.PI)])
        }
    } else if (t == "sindev") {
        for (var i = -1; i <= 1; i += 0.1) {
            p.data.push([i,Math.sin(i*Math.PI-0.5)+p.random(-0.05,0.05)])
        }
    } else if (t == "clust") {
        var angle = Math.random()*2*Math.PI
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.35
            p.data.push([Math.cos(angle)*0.75 + Math.cos(a)*r, Math.sin(angle)*0.75 + Math.sin(a)*r, 1])
        }
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.35
            p.data.push([Math.cos(angle+Math.PI)*0.75 + Math.cos(a)*r, Math.sin(angle+Math.PI)*0.75 + Math.sin(a)*r, 0])
        }
    } else if (t == "clustin") {
        var angle = Math.random()*2*Math.PI
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.65
            p.data.push([Math.cos(angle)*0.35 + Math.cos(a)*r, Math.sin(angle)*0.35 + Math.sin(a)*r, 1])
        }
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.65
            p.data.push([Math.cos(angle+Math.PI)*0.35 + Math.cos(a)*r, Math.sin(angle+Math.PI)*0.35 + Math.sin(a)*r, 0])
        }
    } else if (t == "3clust") {
        
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.33
            p.data.push([Math.cos(a)*r, Math.sin(a)*r, 1])
        }

        var angle = Math.random()*2*Math.PI
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.33
            p.data.push([Math.cos(angle)*0.66 + Math.cos(a)*r, Math.sin(angle)*0.66 + Math.sin(a)*r, 0])
        }
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.33
            p.data.push([Math.cos(angle+Math.PI*2/3)*0.66 + Math.cos(a)*r, Math.sin(angle+Math.PI*2/3)*0.66 + Math.sin(a)*r, 0])
        }
    } else if (t == "3clustin") {
        
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.45
            p.data.push([Math.cos(a)*r, Math.sin(a)*r, 1])
        }

        var angle = Math.random()*2*Math.PI
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.45
            p.data.push([Math.cos(angle)*0.66 + Math.cos(a)*r, Math.sin(angle)*0.66 + Math.sin(a)*r, 0])
        }
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.45
            p.data.push([Math.cos(angle+Math.PI*2/3)*0.66 + Math.cos(a)*r, Math.sin(angle+Math.PI*2/3)*0.66 + Math.sin(a)*r, 0])
        }
    } else if (t == "rings") {
        
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.25
            p.data.push([Math.cos(a)*r, Math.sin(a)*r, 1])

        }

        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.25+0.25
            p.data.push([Math.cos(a)*r, Math.sin(a)*r, 0])
            
        }

    } else if (t == "3rings") {
        
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.25
            p.data.push([Math.cos(a)*r, Math.sin(a)*r, 1])
        }
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.25+0.25
            p.data.push([Math.cos(a)*r, Math.sin(a)*r, 0])
        }
        for (var i = 0; i <= 10; i ++) {
            var a = Math.random()*2*Math.PI
            var r = Math.random()*0.25+0.5
            p.data.push([Math.cos(a)*r, Math.sin(a)*r, 1])
        }

    }

}



function calculatePerceptron(p, x) {
    return p.perceptron[0]*x+p.perceptron[1]
}
function calculatePerceptronQuad(p,x) {
    return p.perceptron[0]*x*x + p.perceptron[1]*x + p.perceptron[2]
}
function calculatePerceptronCub(p,x) {
    return p.perceptron[0]*x*x*x + p.perceptron[1]*x*x + p.perceptron[2]*x + p.perceptron[3]
}
function calculatePerceptronSin(p,x) {
    return p.perceptron[0]*Math.sin(p.perceptron[1]*x+p.perceptron[2]) + p.perceptron[3]
}

function calculatePerceptronLogit(p,x) {
    return p.perceptron[0]*x[0]+p.perceptron[1]*x[1]+p.perceptron[2]
}
function calculatePerceptronQuadLogit (p,x) {
    return p.perceptron[0]*x[0]*x[0]+p.perceptron[1]*x[0]+p.perceptron[2]*x[1]*x[1]+p.perceptron[3]*x[1]+p.perceptron[4]
}
function calculatePerceptronCubLogit(p,x) {
    return p.perceptron[0]*x[0]*x[0]*x[0]+p.perceptron[1]*x[0]*x[0]+p.perceptron[2]*x[0]+p.perceptron[3]*x[1]*x[1]*x[1]+p.perceptron[4]*x[1]*x[1] + p.perceptron[5]*x[1] + p.perceptron[6]
}
function calculatePerceptronSinLogit(p,x) {
    return p.perceptron[0]*Math.sin(p.perceptron[1]*x[0]+p.perceptron[2]*x[1]+p.perceptron[3]) + p.perceptron[4]
}
function calculatePerceptronSinQuadLogit(p,x) {
    return p.perceptron[0]*Math.sin(p.perceptron[1]*x[0]*x[0]+p.perceptron[2]*x[0]+p.perceptron[3]*x[1]*x[1]+p.perceptron[4]*x[1] + p.perceptron[5]) + p.perceptron[6]
}

function calculatePerceptronSigmoid(p,x) {
    return sigmoid(calculatePerceptronLogit(p,x))
}
function calculatePerceptronQuadSigmoid(p,x) {
    return sigmoid(calculatePerceptronQuadLogit(p,x))
}
function calculatePerceptronCubSigmoid(p,x) {
    return sigmoid(calculatePerceptronCubLogit(p,x))
}
function calculatePerceptronSinSigmoid(p,x) {
    return sigmoid(calculatePerceptronSinLogit(p,x))
}
function calculatePerceptronSinQuadSigmoid(p,x) {
    return sigmoid(calculatePerceptronSinQuadLogit(p,x))
}


function cost(p, x,y) {
    return (p.cp ? p.cp(p, x) - y : calculatePerceptron(p,x)-y)**2
}

function cost_deriv(p, x,y) {
    return 2 * (p.cp ? p.cp(p, x) - y : calculatePerceptron(p,x)-y)
}

function costneglog(p, x, y) {
    var x = p.cp ? p.cp(p,x) : calculatePerceptronSigmoid(p,x)
    //y = y || x[x.length-1]
    if (y) {
        return -Math.log(x)
    }
    return -Math.log(1-x)
}
function costneglog_deriv(p, x, y) {
    var x = p.cp ? p.cp(p,x) : calculatePerceptronSigmoid(p,x)
    //y = y || x[x.length-1]
    if (y) {
        return -1/x
    }
    return 1/(1-x) 
}

function sigmoid(x) {
    return 1/(1+Math.exp(-x))
}
function sigmoid_deriv(x) {
    return sigmoid(x)*(1-sigmoid(x))
}


function container0 (p) {
    
    p.preload = function () {
        p.loadImage("/assets/images/calculus_tutorial/buzz.png", img => {buzz = img})
    }
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1],[0.2,0.2],[0.3,0.3],[0.4,0.4],[0.5,0.5],[0.6,0.6]]
    
    p.draw = function() {

        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += cost(p, p.data[i][0], p.data[i][1])
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost0").innerHTML = "Total Cost: "+c
        
        for (var i = 0; i < p.data.length; i++) {
            p.stroke(0,255,0)
            p.strokeWeight(6)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], calculatePerceptron(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)
        drawLine(p, -1, calculatePerceptron(p, -1), 1, calculatePerceptron(p, 1))
        //drawBuzz(p, p.x, p.x, 1, Math.abs(p.speed)/p.speed)
    }
    
}
function container1 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1],[0.2,0.2],[0.3,0.3],[0.4,0.4],[0.5,0.5],[0.6,0.6]]
    
    p.draw = function() {
        
        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        var adj = [0,0]
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += cost(p, p.data[i][0], p.data[i][1])
            adj[0] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]
            adj[1] -= cost_deriv(p, p.data[i][0], p.data[i][1])
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost1").innerHTML = "Total Cost: "+c
        
        p.perceptron[0] += 0.3*adj[0]/p.data.length
        p.perceptron[1] += 0.04*adj[1]/p.data.length
        
        for (var i = 0; i < p.data.length; i++) {
            p.stroke(0,255,0)
            p.strokeWeight(6)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], calculatePerceptron(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)
        drawLine(p, -1, calculatePerceptron(p, -1), 1, calculatePerceptron(p, 1))
    }
    
}
function container2 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1],[0.2,0.2],[0.3,0.3],[0.4,0.4],[0.5,0.5],[0.6,0.6]]
    
    p.draw = function() {
        

        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        var adj = [0,0]
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += cost(p, p.data[i][0], p.data[i][1])
            adj[0] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]
            adj[1] -= cost_deriv(p, p.data[i][0], p.data[i][1])
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost2").innerHTML = "Total Cost: "+c
        
        p.perceptron[0] += 0.3*adj[0]/p.data.length
        p.perceptron[1] += 0.04*adj[1]/p.data.length
        
        for (var i = 0; i < p.data.length; i++) {
            p.stroke(0,255,0)
            p.strokeWeight(6)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], calculatePerceptron(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)
        drawLine(p, -1, calculatePerceptron(p, -1), 1, calculatePerceptron(p, 1))
    }
    
}
function container3 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1), p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1],[0.2,0.2],[0.3,0.3],[0.4,0.4],[0.5,0.5],[0.6,0.6]]
    

    p.cp = calculatePerceptron

    p.draw = function() {
        
        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        var adj = [0,0,0,0]
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += cost(p, p.data[i][0], p.data[i][1])

            if (p.cp == calculatePerceptron) {
                adj[0] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]
                adj[1] -= cost_deriv(p, p.data[i][0], p.data[i][1])
            } else if (p.cp == calculatePerceptronQuad) {
                adj[0] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]*p.data[i][0]
                adj[1] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]
                adj[2] -= cost_deriv(p, p.data[i][0], p.data[i][1])
            } else if (p.cp == calculatePerceptronCub) {
                adj[0] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]*p.data[i][0]*p.data[i][0]
                adj[1] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]*p.data[i][0]
                adj[2] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.data[i][0]
                adj[3] -= cost_deriv(p, p.data[i][0], p.data[i][1])
            } else if (p.cp == calculatePerceptronSin) {
                adj[0] -= cost_deriv(p, p.data[i][0], p.data[i][1])*Math.sin(p.perceptron[1]*p.data[i][0]+p.perceptron[2])
                adj[1] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.perceptron[0]*Math.cos(p.perceptron[1]*p.data[i][0]+p.perceptron[2])*p.data[i][0]
                adj[2] -= cost_deriv(p, p.data[i][0], p.data[i][1])*p.perceptron[0]*Math.cos(p.perceptron[1]*p.data[i][0]+p.perceptron[2])
                adj[3] -= cost_deriv(p, p.data[i][0], p.data[i][1])
            } 
            
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost3").innerHTML = "Total Cost: "+c
        

        // TODO
        if (p.cp == calculatePerceptron) {
            p.perceptron[0] += 0.3*adj[0]/p.data.length
            p.perceptron[1] += 0.04*adj[1]/p.data.length
        } else if (p.cp == calculatePerceptronQuad) {
            p.perceptron[0] += 0.1*adj[0]/p.data.length
            p.perceptron[1] += 0.3*adj[1]/p.data.length
            p.perceptron[2] += 0.04*adj[2]/p.data.length
        } else if (p.cp == calculatePerceptronCub) {
            p.perceptron[0] += 0.1*adj[0]/p.data.length
            p.perceptron[1] += 0.1*adj[1]/p.data.length
            p.perceptron[2] += 0.3*adj[2]/p.data.length
            p.perceptron[3] += 0.04*adj[3]/p.data.length
        } else if (p.cp == calculatePerceptronSin) {
            p.perceptron[0] += 0.3*adj[0]/p.data.length
            p.perceptron[1] += 0.3*adj[1]/p.data.length
            p.perceptron[2] += 0.3*adj[2]/p.data.length
            p.perceptron[3] += 0.04*adj[3]/p.data.length
        }
        for (var i = 0; i < p.data.length; i++) {
            p.stroke(0,255,0)
            p.strokeWeight(6)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], p.cp(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)

        var g = []
        for (var i = -1; i <= 1; i+= 0.02) {
            g.push([i,p.cp(p,i)])
        }

        //drawLine(p, -1, calculatePerceptron(p, -1), 1, calculatePerceptron(p, 1))
        drawGraph(p, g)
    }
    
}

function container4 (p) {
    
    p.setup = function(){
        p.createCanvas(800, 400);
        p.background(255,255,255);
    }
    
    p.draw = function() {
        
        p.background(255,255,255)
        drawGrid(p, 80, 400, 200)
        
        
        var l = []
        var g = []
        for (var i = -4; i <= 4; i+= 0.1) {
            g.push([i,sigmoid(i)])
            l.push([i,i])
        }

        p.strokeWeight(2)

        p.stroke(255,150,0)
        drawGraph(p, l,80, 400)

        p.stroke(255,0,0)
        drawGraph(p, g,80, 400)
    }
    
}
function container5 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.draw = function() {
        
        p.background(255,255,255)
        drawGrid(p, 160, 140, 350)
        
        
        var l = []
        var g = []
        for (var i = 0; i <= 1; i+= 0.1) {
            g.push([i,-Math.log(i)])
            l.push([i,(i-1)**2])
        }

        p.strokeWeight(2)

        p.stroke(255,150,0)
        drawGraph(p, l, 160, 140, 350)

        p.stroke(255,0,0)
        drawGraph(p, g, 160, 140, 350)
    }
    
}

function container6 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.draw = function() {
        
        p.background(255,255,255)
        drawGrid(p, 160, 140, 350)
        
        
        var l = []
        var g = []
        for (var i = 0; i <= 1; i+= 0.1) {
            g.push([i,-Math.log(1-i)])
            l.push([i,i**2])
        }

        p.strokeWeight(2)

        p.stroke(255,150,0)
        drawGraph(p, l, 160, 140, 350)

        p.stroke(255,0,0)
        drawGraph(p, g, 160, 140, 350)
    }
    
}


function container7 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1), p.random(-1,1), p.random(-1,1),p.random(-1,1), p.random(-1,1), p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1,0],[0.2,0.2,0],[0.3,0.3,0],[0.4,0.4,1],[0.5,0.5,1],[0.6,0.6,1]]
    

    p.cp = calculatePerceptronSigmoid

    p.draw = function() {
        
        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        var adj = [0,0,0,0]
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += costneglog(p, p.data[i], p.data[i][2])

            adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][0]
            adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][1]
            adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))    
            
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost7").innerHTML = "Total Cost: "+c
        

        // TODO
        p.perceptron[0] += 0.3*adj[0]/p.data.length
        p.perceptron[1] += 0.3*adj[1]/p.data.length
        p.perceptron[2] += 0.3*adj[2]/p.data.length


        for (var i = 0; i < p.data.length; i++) {
            if (p.data[i][2])
                p.stroke(0,255,0)
            else 
                p.stroke(255,155,0)
            p.strokeWeight(6)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], p.cp(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)

        var b = p.perceptron[2]
        var mx = p.perceptron[0], my = p.perceptron[1]

        var g = []
        for (var i = -1; i <= 1; i+= 0.02) {
            g.push([i,-(mx*i+b)/my])
        }

        //drawLine(p, -1, calculatePerceptron(p, -1), 1, calculatePerceptron(p, 1))
        drawGraph(p, g)
    }
    
}
function container8 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1), p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1,0],[0.2,0.2,0],[0.3,0.3,0],[0.4,0.4,1],[0.5,0.5,1],[0.6,0.6,1]]
    

    p.cp = calculatePerceptronSigmoid

    p.draw = function() {

        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        var adj = [0,0,0,0]
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += costneglog(p, p.data[i], p.data[i][2])

            adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][0]
            adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][1]
            adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))    
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost8").innerHTML = "Total Cost: "+c
        

        // TODO
        p.perceptron[0] += 0.6*adj[0]/p.data.length
        p.perceptron[1] += 0.6*adj[1]/p.data.length
        p.perceptron[2] += 0.6*adj[2]/p.data.length
        
        p.rectMode(p.CENTER)
        p.noStroke()
        var step = 0.05
        for (var i = -1.3; i <= 1.3; i+=step) {
            for (var j = -1.3; j <= 1.3; j+=step) {
                var z = calculatePerceptronSigmoid(p,[i,j]) > 0.5
                z *= 1

                if (z)
                    p.fill(0,255,0, 50)
                else 
                    p.fill(255,155,0, 50)
                drawRect(p, i, j, step, step)
            }            
        }

        for (var i = 0; i < p.data.length; i++) {
            if (p.data[i][2])
                p.stroke(0,255,0)
            else 
                p.stroke(255,155,0)
            p.strokeWeight(10)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], p.cp(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)

        var b = p.perceptron[2]
        var mx = p.perceptron[0], my = p.perceptron[1]

    }
    
}
function container9 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1), p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1,0],[0.2,0.2,0],[0.3,0.3,0],[0.4,0.4,1],[0.5,0.5,1],[0.6,0.6,1]]
    

    p.cp = calculatePerceptronSigmoid

    p.draw = function() {
        
        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        var adj = [0,0,0,0]
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += costneglog(p, p.data[i], p.data[i][2])

            adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][0]
            adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][1]
            adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))    
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost9").innerHTML = "Total Cost: "+c
        

        // TODO
        p.perceptron[0] += 0.6*adj[0]/p.data.length
        p.perceptron[1] += 0.6*adj[1]/p.data.length
        p.perceptron[2] += 0.6*adj[2]/p.data.length
        
        p.rectMode(p.CENTER)
        p.noStroke()
        var step = 0.05
        for (var i = -1.3; i <= 1.3; i+=step) {
            for (var j = -1.3; j <= 1.3; j+=step) {
                var z = calculatePerceptronSigmoid(p,[i,j]) > 0.5
                z *= 1

                if (z)
                    p.fill(0,255,0, 50)
                else 
                    p.fill(255,155,0, 50)
                drawRect(p, i, j, step, step)
            }            
        }

        for (var i = 0; i < p.data.length; i++) {
            if (p.data[i][2])
                p.stroke(0,255,0)
            else 
                p.stroke(255,155,0)
            p.strokeWeight(10)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], p.cp(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)

        var b = p.perceptron[2]
        var mx = p.perceptron[0], my = p.perceptron[1]

    }
    
}

function container10 (p) {
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.perceptron = [p.random(-1,1), p.random(-1,1), p.random(-1,1), p.random(-1,1),p.random(-1,1), p.random(-1,1), p.random(-1,1), p.random(-1,1)]
    p.data = [[0.1,0.1,0],[0.2,0.2,0],[0.3,0.3,0],[0.4,0.4,1],[0.5,0.5,1],[0.6,0.6,1]]
    

    p.cp = calculatePerceptronSigmoid

    p.draw = function() {
        
        if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true
        
        p.background(255,255,255)
        drawGrid(p)
        
        var adj = [0,0,0,0,0,0,0,0]
        var c = 0
        for (var i = 0; i < p.data.length; i++) {
            c += costneglog(p, p.data[i], p.data[i][2])

            if (p.cp == calculatePerceptronSigmoid) {
                adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][0]
                adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))*p.data[i][1]
                adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronLogit(p,p.data[i]))    
            } else if (p.cp == calculatePerceptronQuadSigmoid) {
                adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronQuadLogit(p,p.data[i]))*p.data[i][0]*p.data[i][0]
                adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronQuadLogit(p,p.data[i]))*p.data[i][0]
                adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronQuadLogit(p,p.data[i]))*p.data[i][1]*p.data[i][1]
                adj[3] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronQuadLogit(p,p.data[i]))*p.data[i][1]
                adj[4] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronQuadLogit(p,p.data[i]))
            } else if (p.cp == calculatePerceptronCubSigmoid) {
                adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronCubLogit(p,p.data[i]))*p.data[i][0]*p.data[i][0]*p.data[i][0]
                adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronCubLogit(p,p.data[i]))*p.data[i][0]*p.data[i][0]
                adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronCubLogit(p,p.data[i]))*p.data[i][0]
                adj[3] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronCubLogit(p,p.data[i]))*p.data[i][1]*p.data[i][1]*p.data[i][1]
                adj[4] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronCubLogit(p,p.data[i]))*p.data[i][1]*p.data[i][1]
                adj[5] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronCubLogit(p,p.data[i]))*p.data[i][1]
                adj[6] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronCubLogit(p,p.data[i]))
            } else if (p.cp == calculatePerceptronSinSigmoid) {
                adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.sin(p.perceptron[1]*p.data[i][0]+p.perceptron[2]*p.data[i][1]+p.perceptron[3])
                adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]+p.perceptron[2]*p.data[i][1]+p.perceptron[3])*p.data[i][0]
                adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]+p.perceptron[2]*p.data[i][1]+p.perceptron[3])*p.data[i][1]
                adj[3] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]+p.perceptron[2]*p.data[i][1]+p.perceptron[3])
                adj[4] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))
            
            } else if (p.cp == calculatePerceptronSinQuadSigmoid) {
                adj[0] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.sin(p.perceptron[1]*p.data[i][0]*p.data[i][0]+p.perceptron[2]*p.data[i][0]+p.perceptron[3]*p.data[i][1]*p.data[i][1]+p.perceptron[4]*p.data[i][1]+p.perceptron[5])
                adj[1] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]*p.data[i][0]+p.perceptron[2]*p.data[i][0]+p.perceptron[3]*p.data[i][1]*p.data[i][1]+p.perceptron[4]*p.data[i][1]+p.perceptron[5])*p.data[i][0]*p.data[i][0]
                adj[2] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]*p.data[i][0]+p.perceptron[2]*p.data[i][0]+p.perceptron[3]*p.data[i][1]*p.data[i][1]+p.perceptron[4]*p.data[i][1]+p.perceptron[5])*p.data[i][0]
                adj[3] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]*p.data[i][0]+p.perceptron[2]*p.data[i][0]+p.perceptron[3]*p.data[i][1]*p.data[i][1]+p.perceptron[4]*p.data[i][1]+p.perceptron[5])*p.data[i][1]*p.data[i][1]
                adj[4] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]*p.data[i][0]+p.perceptron[2]*p.data[i][0]+p.perceptron[3]*p.data[i][1]*p.data[i][1]+p.perceptron[4]*p.data[i][1]+p.perceptron[5])*p.data[i][1]
                adj[5] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))*Math.cos(p.perceptron[1]*p.data[i][0]*p.data[i][0]+p.perceptron[2]*p.data[i][0]+p.perceptron[3]*p.data[i][1]*p.data[i][1]+p.perceptron[4]*p.data[i][1]+p.perceptron[5])
                adj[6] -= costneglog_deriv(p, p.data[i], p.data[i][2])*sigmoid_deriv(calculatePerceptronSinLogit(p,p.data[i]))
            
            }
        }
        c = Math.round(10000*c)/10000
        document.getElementById("cost10").innerHTML = "Total Cost: "+c
        

        // TODO
        if (p.cp == calculatePerceptronSigmoid) {
            p.perceptron[0] += 0.6*adj[0]/p.data.length
            p.perceptron[1] += 0.6*adj[1]/p.data.length
            p.perceptron[2] += 0.6*adj[2]/p.data.length
        } else if (p.cp == calculatePerceptronQuadSigmoid) {
            p.perceptron[0] += 0.6*adj[0]/p.data.length
            p.perceptron[1] += 0.6*adj[1]/p.data.length
            p.perceptron[2] += 0.6*adj[2]/p.data.length
            p.perceptron[3] += 0.6*adj[3]/p.data.length
            p.perceptron[4] += 0.6*adj[4]/p.data.length
        } else if (p.cp == calculatePerceptronCubSigmoid) {
            p.perceptron[0] += 0.6*adj[0]/p.data.length
            p.perceptron[1] += 0.6*adj[1]/p.data.length
            p.perceptron[2] += 0.6*adj[2]/p.data.length
            p.perceptron[3] += 0.6*adj[3]/p.data.length
            p.perceptron[4] += 0.6*adj[4]/p.data.length
            p.perceptron[5] += 0.6*adj[5]/p.data.length
            p.perceptron[6] += 0.6*adj[6]/p.data.length
        } else if (p.cp == calculatePerceptronSinSigmoid) {
            p.perceptron[0] += 0.6*adj[0]/p.data.length
            p.perceptron[1] += 0.6*adj[1]/p.data.length
            p.perceptron[2] += 0.6*adj[2]/p.data.length
            p.perceptron[3] += 0.6*adj[3]/p.data.length
            p.perceptron[4] += 0.6*adj[4]/p.data.length
        } else if (p.cp == calculatePerceptronSinQuadSigmoid) {
            p.perceptron[0] += 0.6*adj[0]/p.data.length
            p.perceptron[1] += 0.6*adj[1]/p.data.length
            p.perceptron[2] += 0.6*adj[2]/p.data.length
            p.perceptron[3] += 0.6*adj[3]/p.data.length
            p.perceptron[4] += 0.6*adj[4]/p.data.length
            p.perceptron[5] += 0.6*adj[5]/p.data.length
            p.perceptron[6] += 0.6*adj[6]/p.data.length        
        }

        p.rectMode(p.CORNER)
        p.noStroke()
        var step = 0.05
        for (var i = -1.3; i <= 1.3; i+=step) {
            for (var j = -1.3; j <= 1.3; j+=step) {
                var z = p.cp(p,[i,j]) > 0.5
                z *= 1

                if (z)
                    p.fill(0,255,0, 50)
                else 
                    p.fill(255,155,0, 50)
                drawRect(p, i, j, step, step)
            }            
        }

        for (var i = 0; i < p.data.length; i++) {
            if (p.data[i][2])
                p.stroke(0,255,0)
            else 
                p.stroke(255,155,0)
            p.strokeWeight(10)
            drawPoint(p, p.data[i][0], p.data[i][1])
            
            p.stroke(0,0,255)
            p.strokeWeight(1)
            drawLine(p, p.data[i][0], p.data[i][1], p.data[i][0], p.cp(p, p.data[i][0]))
        }
        p.stroke(255,0,0)
        p.strokeWeight(2)

        var b = p.perceptron[2]
        var mx = p.perceptron[0], my = p.perceptron[1]

    }
    
}