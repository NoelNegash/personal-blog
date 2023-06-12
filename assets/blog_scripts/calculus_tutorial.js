var buzz

function drawGrid(p, scale = 80, x = 200, y = 200, spacing = 0.2, l=1) {

    var i = 0;
    var c = 0
    while(i*scale+x > 0) {
        i -= spacing
        c -= spacing
        if (c <= -l) c = 0
    }
    while(i*scale+x < 400) {
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
        p.line(0, i*scale+x, 400, i*scale+x)
        p.line(i*scale+x, 0, i*scale+x, 400)
    }

}
function drawGraph(p, g, scale = 80, x = 200, y = 200) {

    for(var i = 1; i < g.length; i++) {
        p.line(x+g[i-1][0]*scale, y-g[i-1][1]*scale, x+g[i][0]*scale, y-g[i][1]*scale)
    }
}

function drawImage(p, img, rx, ry,w = undefined, h = undefined, scale = 80, x = 200, y = 200) {
    if(w) p.image(img, x+rx*scale, y-ry*scale, w, h)
    else p.image(img, x+rx*scale, y-ry*scale)
}
function drawBuzz(p, rx, ry, slope = 0, dir = 1, scale = 80, x = 200, y = 200) {

    var angle = dir == 1 ? -Math.atan2(slope, 1)+Math.PI/2 : -Math.atan2(-slope, -1)+Math.PI/2
    
    p.imageMode(p.CENTER)

    p.push()
    p.translate(x+rx*scale, y-ry*scale)
    p.rotate(angle)
    p.image(buzz, 0, 0, 80, 80)
    p.pop()
}

function resetGradient(i) {
    
    var p = containers[i]
    p.xs = []
    for (var j = 0; j < 4; j++) {
        p.xs.push(Math.random()*5-2.5)
    }
}


function container0 (p) {
    
    p.preload = function () {
        p.loadImage("/assets/images/calculus_tutorial/buzz.png", img => {buzz = img})
    }
    
    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.x = 0
    
    p.draw = function() {
        
        if (Math.abs(p.x) >= 2.5)
            p.speed *= -1
        
        p.x += p.speed
        
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, [[-5,-5],[5,5]])
        
        drawBuzz(p, p.x, p.x, 1, Math.abs(p.speed)/p.speed)
    }
    
}
function container1 (p) {

    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.x = 0

    p.points = []
    for(var i = -2.5; i <= 2.5; i+=p.speed)
        p.points.push([i, i*i-2.5])
    
    
    p.draw = function() {
        
        if (Math.abs(p.x) >= 2.5)
            p.speed *= -1
        
        p.x += p.speed
        
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, p.points)

        if (buzz)
            drawBuzz(p, p.x, p.x*p.x-2.5, 2*p.x, Math.abs(p.speed)/p.speed)
    }
    
}
function container2 (p) {

    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.x = 0

    p.points = []
    for(var i = -2.5; i <= 2.5; i+=p.speed)
        p.points.push([i, 0.16*i*i*i])
    
    
    p.draw = function() {
        
        if (Math.abs(p.x) >= 2.5)
            p.speed *= -1
        
        p.x += p.speed
        
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, p.points)

        if (buzz)
            drawBuzz(p, p.x, 0.16*p.x*p.x*p.x, 0.48*p.x*p.x, Math.abs(p.speed)/p.speed)
    }
    
}
function container3 (p) {

    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.x = 0

    p.points = []
    for(var i = -2.5; i <= 2.5; i+=p.speed)
        p.points.push([i, Math.sin(i)])
    
    
    p.draw = function() {
        
        if (Math.abs(p.x) >= 2.5)
            p.speed *= -1
        
        p.x += p.speed
        
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, p.points)

        if (buzz)
            drawBuzz(p, p.x, Math.sin(p.x), Math.cos(p.x), Math.abs(p.speed)/p.speed)
    }
    
}
function container4 (p) {

    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.x = 0

    p.points = []
    for(var i = -2.5; i <= 2.5; i+=p.speed)
        p.points.push([i, Math.sin(i*3)])
    
    
    p.draw = function() {
        
        if (Math.abs(p.x) >= 2.5)
            p.speed *= -1
        
        p.x += p.speed
        
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, p.points)

        if (buzz)
            drawBuzz(p, p.x, Math.sin(p.x*3), 3*Math.cos(p.x*3), Math.abs(p.speed)/p.speed)
    }
    
}
function container5 (p) {

    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.x = 0

    p.points = []
    for(var i = -2.5; i <= 2.5; i+=p.speed)
        p.points.push([i, Math.sin(i*3)+i])
    
    
    p.draw = function() {
        
        if (Math.abs(p.x) >= 2.5)
            p.speed *= -1
        
        p.x += p.speed
        
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, p.points)

        if (buzz)
            drawBuzz(p, p.x, Math.sin(p.x*3)+p.x, 3*Math.cos(p.x*3)+1, Math.abs(p.speed)/p.speed)
    }
    
}
function container6 (p) {

    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.xs = []
    for (var i = 0; i < 4; i++) {
        p.xs.push(Math.random()*5-2.5)
    }

    p.points = []
    for(var i = -2.5; i <= 2.5; i+=p.speed)
        p.points.push([i, Math.sin(i*3)+i])
    
    
    p.draw = function() {
               
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, p.points)
        for(var i = 0; i < p.xs.length; i++) {
            p.xs[i] -= 0.01 * (3*Math.cos(p.xs[i]*3)+1)
            if (Math.abs(p.xs[i]) > 2.5) 
                p.xs[i] = 2.5 * Math.abs(p.xs[i])/p.xs[i]

            var derivative = 3*Math.cos(p.xs[i]*3)+1
            if (buzz)
                drawBuzz(p, p.xs[i], Math.sin(p.xs[i]*3)+p.xs[i], derivative, -Math.abs(derivative)/derivative)
        }

        
    }
    
}
function container7 (p) {

    p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);
    }
    
    p.speed = 0.03
    p.xs = []
    for (var i = 0; i < 4; i++) {
        p.xs.push(Math.random()*5-2.5)
    }

    p.points = []
    for(var i = -2.5; i <= 2.5; i+=p.speed)
        p.points.push([i, Math.sin(i*3)+i])
    
    
    p.draw = function() {
               
        p.background(255,255,255)
        drawGrid(p)
        
        p.stroke(255,0,0)
        p.strokeWeight(1)
        drawGraph(p, p.points)
        for(var i = 0; i < p.xs.length; i++) {
            p.xs[i] += 0.01 * (3*Math.cos(p.xs[i]*3)+1)
            if (Math.abs(p.xs[i]) > 2.5) 
                p.xs[i] = 2.5 * Math.abs(p.xs[i])/p.xs[i]


            var derivative = 3*Math.cos(p.xs[i]*3)+1
            if (buzz)
                drawBuzz(p, p.xs[i], Math.sin(p.xs[i]*3)+p.xs[i], derivative, Math.abs(derivative)/derivative)
        }

        
    }
    
}