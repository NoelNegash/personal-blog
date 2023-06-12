var currentContainer

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




function color(x) {
	return [[255, 100,0],[0,100,255]][x%2]
}

function sigmoid(x) {
    return 1/(1+Math.exp(-x))
}
function sigmoid_deriv(x) {
    return sigmoid(x)*(1-sigmoid(x))
}

function std_random() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
function matmul(x,y) {
  var z = []
  for (var i = 0; x[i] != undefined && y[i] != undefined; i++) {
    z[i] = x[i]*y[i]
  }
  return z
}
function matadd(x,y) {
  var z = []
  for (var i = 0; x[i] != undefined && y[i] != undefined; i++) {
    z[i] = x[i]+y[i]
  }
  return z
}
function matsum(x) {
  var y = 0
  for (var i = 0; i < x.length; i++) {
    y += x[i]
  }
  return y
}
function matmax(x) {
  var y = []
  for (var i = 0; i < x.length; i++) {
    y.push(Math.max(x[i],0))
  }
  return y
}
function matsigmoid(x) {
  var y = []
  for (var i = 0; i < x.length; i++) {
    y.push(sigmoid(x[i]))
  }
  return y
}
function matleaky(x) {
  var y = []
  for (var i = 0; i < x.length; i++) {
    y.push((x[i] < 0 ? 0.001 : 1) * x[i])
  }
  return y
}
function last(x) {
  return x[x.length-1]
}
function popArray(l,x) {
  var y = []
  for (var i = 0; i < l; i++)
    y.push(x)
  return y
}



function cost(o, y) {
  return (o-y)**2
}
function cost_deriv(o, y) {
  return 2*(o-y)
}
function costneglog_deriv(o,y) {
    if (y) {
        return -1/o
    }
    return 1/(1-o) 
}
function matcost(o,y) {
  var z = []
  for (var i = 0; o[i] != undefined && y[i] != undefined; i++) {
    z.push(cost(o[i],y[i]))
  }
  return z
}
function matcost_deriv(o,y) {
  var z = []
  for (var i = 0; o[i] != undefined && y[i] != undefined; i++) {
    z.push(cost_deriv(o[i],y[i]))
  }
  return z
}

function matcostneglog_deriv(o, y) {

  var z = []
  for (var i = 0; o[i] != undefined && y[i] != undefined; i++) {
    z.push(costneglog_deriv(o[i],y[i]))
  }
  
  return z
}

// simple enough
class Perceptron extends Array {
    constructor (numInputs, init, biasInit) {
    	super()
    	if (init="norm")
    		init = () => {return std_random()/Math.sqrt(numInputs/2)}

        for (var i = 0; i < numInputs; i++) {
        	this.push(init())
        }
        this.bias = biasInit()
    }

    add(x) {
	  	for (var i = 0; x[i] != undefined && this[i] != undefined; i++) {
	    	this[i] += x[i]
		}
	}

    eval(x) {
    	return matsum(matmul(this,x))+this.bias
    }
}
// since a layer is nothing more than an array of perceptrons
class Layer extends Array {
    constructor (numPerceptrons, numInputs, activation = "linear", init=()=>{return Math.random()*2-1}, biasInit = Math.random) {
        super()

        this.activation = activation

        for (var i = 0; i < numPerceptrons; i++) {
            this.push(new Perceptron(numInputs, init, biasInit))
        }
    }

    eval (d) {
    	var res = []
    	for (var i = 0; i < this.length; i++) {
    		res.push(this[i].eval(d))
    	}

    	this.lastLogits = res

    	if (this.activation == "linear") 
    		return res
    	else if (this.activation == "relu")
    		return matmax(res)
    	else if (this.activation == "leakyrelu")
    		return matleaky(res)
    	else if (this.activation == "sigmoid")
    		return matsigmoid(res)
    }
    activation_derivs (d) {
		if (this.activation == "linear") {
			return popArray(this.length, 1)
		} else if (this.activation == "relu") {
			var res = popArray(this.length, 0)
			for (var i = 0; i < this.length; i++) {
				if (this.lastOutput[i]>0)
					res[i] = 1
			}
    		return res
    	} else if (this.activation == "leakyrelu") {
    		var res = popArray(this.length, 0.001)
			for (var i = 0; i < this.length; i++) {
				if (this.lastOutput[i]>0)
					res[i] = 1
			}
    		return res
    	} else if (this.activation == "sigmoid") {
    		var res = []
			for (var i = 0; i < this.lastLogits.length; i++) {
				res.push(sigmoid_deriv(this.lastLogits[i]))
			}
    		return res
    	}
	}
}
// likewise, an MLP is an array of layers
class MLP extends Array {
    constructor (schema) {
        super()

        this.l2 = true
        this.cost_deriv = matcost_deriv
        if (schema[schema.length-1][1] == "sigmoid") {
        	this.cost_deriv = matcostneglog_deriv
        }


        for (var i = 1; i < schema.length; i++) {
            if (schema[i][1]) {
		    	if (schema[i-1][1]) {
		        	this.push(new Layer(schema[i][0], schema[i-1][0], schema[i][1]))
		      	} else {
		        	this.push(new Layer(schema[i][0], schema[i-1], schema[i][1]))
		      	}
		    } else {
		      	if (schema[i-1][1]) {
		        	this.push(new Layer(schema[i], schema[i-1][0]))
		      	} else {
		        	this.push(new Layer(schema[i], schema[i-1]))
		      	}
		    }
        }

        this.clearDerivs()
    }

    forward (d) {
  
		for (var i = 0; i < this.length; i++) {
		    this[i].lastInput = d
		    d = this[i].eval(d)
		    this[i].lastOutput = d
		}
		  
		return d
	}

	backward = function (desiredOutput) {
  
	  // calculate cost derivatives
	   
	  var global_derivs = matmul(this.cost_deriv(last(this).lastOutput, desiredOutput), last(this).activation_derivs())
	  var prev_derivs;
	  
	  for (var i = this.length-1; i >= 0; i--) {
	    
	    var l = this[i]
	    var d = this.derivs[i]
	    
	    if (i != 0)
	      prev_derivs = popArray(this[i-1].length, 0)
	    
	    for (var j = 0; j < d.length; j++) {
	      
			var p = matmul( popArray(d[j].length, global_derivs[j]), l.lastInput)
			// L2 regularization
			if (this.l2) {
				for (var k = 0; k < p.length; k++) {
					p[k] += 2*l[j][k] * L2_REG
				}
			}

			d[j].bias += global_derivs[j]

			d[j].add(p)

			if (i == 0) continue

			for (var k = 0; k < prev_derivs.length; k++) {
				prev_derivs[k] += global_derivs[j] * l[j][k]
			}
	    }
	    global_derivs = prev_derivs
	  }
	  
	  this.passes++
	}



	clearDerivs () {
  		this.derivs = []
  		this.passes = 0
  
	  	// clone layers
	  	for (var i = 0; i < this.length; i++) {
	    	this.derivs.push(new Layer(this[i].length, this[i][0].length, this[i].activation, ()=>0, ()=>0))
	  	}
	}

	applyDerivs = function () {
	  	if (!this.passes) return

		for (var i = 0 ; i < this.derivs.length; i++) {
	    	for (var j = 0 ; j < this.derivs[i].length; j++) {
		      	for (var k = 0; k < this.derivs[i][j].length; k++) {
		        	this[i][j][k] -= WEIGHT_LRATE * this.derivs[i][j][k]/this.passes
		      	}
		      	this[i][j].bias -= BIAS_LRATE * this.derivs[i][j].bias/this.passes     
	    	}
	  	}
  
	  
	  this.clearDerivs()
	}
}








var BIAS_LRATE = 0.008
var WEIGHT_LRATE = 0.008
var L2_REG = 0.0006












function container0 (p) {

	p.mouseClicked = function () {
		for (var i = 0; i < p.schema.length; i++) {
			for (var j = 0; j < p.schema[i].length; j++) {
				if (p.dist(p.mouseX,p.mouseY,p.schema[i][j].x,p.schema[i][j].y) < 25) {
					p.active = p.schema[i][j]
					p.x = p.active.x-25
					return
				}
			}
		}
	}

	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        p.p = 2
        p.l = 4
        p.speed = 1.5

        p.generate()
    }
    
    p.draw = function() {

       /* if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true*/

        p.background(255,255,255)
        
        
        for (var i = 0; i < p.schema.length; i++) {
        	for (var j = 0; j < p.schema[i].length; j++) {
        		

        		var c = p.schema[i][j]

        		// draw lines
        		if (p.schema[i+1]) {
        			for (var k = 0; k < p.schema[i+1].length; k++) {
        				p.stroke(0,0,0)
        				p.strokeWeight(0.3)
        				p.line(c.x, c.y, p.schema[i+1][k].x, p.schema[i+1][k].y)

        				// active
        				if (!p.active || (p.active && c == p.active)) {
	        				if (p.x > c.x && p.x < c.x + 80) {
		        				var m = (c.y-p.schema[i+1][k].y)/(c.x-p.schema[i+1][k].x)
		        				var y1 = c.y + m*((p.x-10)-c.x)
		        				var y2 = c.y + m*((p.x+10)-c.x)
		        				
		        				p.stroke(c.c[0],c.c[1],c.c[2])
		        				p.strokeWeight(4)
		        				p.line(p.x-10,y1,p.x+10,y2)
		        			}
						}
        			}
        		}
        		p.stroke(0,0,0)
        		p.strokeWeight(1)
        		if ((!p.active || c == p.active || c.x == p.active.x+80) && p.x && p.x > c.x-25 && p.x < c.x+25)
        			p.fill(c.c[0],c.c[1],c.c[2])
        		else if (p.dist(p.mouseX,p.mouseY, c.x, c.y) < 25)
        			p.fill(255,200,200)
        		else
        			p.fill(255,255,255)
        		p.ellipse(c.x, c.y, 50, 50)

        	}
        }

        if (p.x)
        	p.x += p.speed
        if (p.active && p.x > p.active.x+80)
        	p.active = undefined
        if (p.x > p.end)
        	p.x = undefined
    }

	p.perceptrons = function(x) {
		p.p = x
		p.generate()
	}
	p.layers = function(x) {
		p.l = x
		p.generate()
	}
	p.generate = function () {

		var space = 30
		var w = 50
		var x = (200 - ((p.l-1)*space + p.l*w)/2) + w/2
		p.x = x-25


		p.schema = []

		for (var i = 0; i < p.l; i++) {
			if (i == 0 || i == p.l-1) {
				p.schema.push([{x:x, y:200, c:color(i)}])
			} else {
				var y = (200 - ((p.p-1)*space + p.p*w)/2) + w/2
				var l = []
				for (var j = 0; j < p.p; j++) {
					l.push({x:x, y:y, c:color(i)})
					y += w+space
				}
				p.schema.push(l)
			}
			

			x += w+space
		}
		
		p.end = x+25
	}    }

function container1 (p) {


	container0(p)



	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        
        p.speed=1.5
        p.funnel()
    }
    
  
	p.funnel = function () {
		p.l = 4

		var space = 30
		var w = 50
		var x = (200 - ((p.l-1)*space + p.l*w)/2) + w/2
		p.x = x-25


		p.schema = []

		for (var i = 0; i < p.l; i++) {
			var y = (200 - ((i)*space + (i+1)*w)/2) + w/2
			var l = []
			for (var j = 0; j <= i; j++) {
				l.push({x:x, y:y, c:color(i)})
				y += w+space
			}
			p.schema.push(l)
			x += w+space
		}
		
		p.end = x+25
	}    
	p.diamond = function () {
		p.l = 5

		var space = 30
		var w = 50
		var x = (200 - ((p.l-1)*space + p.l*w)/2) + w/2
		p.x = x-25


		p.schema = []

		for (var i = 0; i < p.l; i++) {
			var y = (200 - (p.min(i,4-i)*space + (p.min(i,4-i)+1)*w)/2) + w/2
			var l = []
			for (var j = 0; j <= p.min(i,4-i); j++) {
				l.push({x:x, y:y, c:color(i)})
				y += w+space
			}
			p.schema.push(l)
			x += w+space
		}
		
		p.end = x+25
	}  
	p.autoencoder = function () {
		p.l = 5

		var space = 30
		var w = 50
		var x = (200 - ((p.l-1)*space + p.l*w)/2) + w/2
		p.x = x-25


		p.schema = []

		for (var i = 0; i < p.l; i++) {
			var y = (200 - (p.max(i-2,2-i)*space + (p.max(i-2,2-i)+1)*w)/2) + w/2
			var l = []
			for (var j = 0; j <= p.max(i-2,2-i); j++) {
				l.push({x:x, y:y, c:color(i)})
				y += w+space
			}
			p.schema.push(l)
			x += w+space
		}
		
		p.end = x+25
	}    }

function container2(p) {

	container1(p)
	p.draw = function() {

       /* if (p.notFirst && containers[currentContainer] != p) return
        p.notFirst = true*/

        p.background(255,255,255)
        
        
        for (var i = 0; i < p.schema.length; i++) {
        	for (var j = 0; j < p.schema[i].length; j++) {
        		

        		var c = p.schema[i][j]

        		// draw lines
        		if (p.schema[i+1]) {
        			for (var k = 0; k < p.schema[i+1].length; k++) {
        				p.stroke(0,0,0)
        				p.strokeWeight(0.3)
        				p.line(c.x, c.y, p.schema[i+1][k].x, p.schema[i+1][k].y)

        				// active
        				if (!p.active || (p.active && c == p.active)) {
	        				if (p.x > c.x && p.x < c.x + 80) {
		        				var m = (c.y-p.schema[i+1][k].y)/(c.x-p.schema[i+1][k].x)
		        				var y1 = c.y + m*((p.x-10)-c.x)
		        				var y2 = c.y + m*((p.x+10)-c.x)
		        				
		        				p.stroke(c.c[0],c.c[1],c.c[2])
		        				p.strokeWeight(4)
		        				p.line(p.x-10,y1,p.x+10,y2)
		        			}
						}
        			}
        		}

        		var text;

        		p.stroke(0,0,0)
        		p.strokeWeight(1)
        		if ((!p.active || c == p.active || c.x == p.active.x+80) && p.x && p.x > c.x-25 && p.x < c.x+25) {
        			p.fill(c.c[0],c.c[1],c.c[2])
        		} else if (p.dist(p.mouseX,p.mouseY, c.x, c.y) < 25) {
        			p.fill(255,200,200)
        		} else {
        			p.fill(255,255,255)
        		}
        		p.ellipse(c.x, c.y, 50, 50)

        		if (p.dist(p.mouseX,p.mouseY, c.x, c.y) < 25) {
        			
        			text = "1+1=2"
        			if (i != 0) text = p.schema[i-1].length+"+"+1+"="+(p.schema[i-1].length+1)
        		} else if (c.name) {
        			text = c.name
        		}
        		if (text) {
        			p.textAlign(p.CENTER, p.CENTER)

        			p.fill(0,0,0)
        			p.text(text, c.x, c.y)

        		}
        		text = undefined

        	}
        }

        if (p.x)
        	p.x += p.speed
        if (p.active && p.x > p.active.x+80)
        	p.active = undefined
        if (p.x > p.end)
        	p.x = undefined
    }}

function container3(p) {
	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        //p.mlp = new MLP([1,[35,'relu'],[35,'relu'],[35,'leakyrelu'],5,1])
        //p.mlp = new MLP([1,[1,"relu"],[2,"relu"],[3,"relu"],4,1])
        p.mlp = new MLP([1,1,2,3,4,1])
        p.data = []
        for (var i = -0.8; i <= 0.8; i+=0.05) {
		  	p.data.push([[i],[i**3+Math.random()*0.3]])
		}
	}

	p.draw = function() {

		if (p.notFirst && containers[currentContainer] != p) return
		p.notFirst = true
	

		p.background(255);

		drawGrid(p)

		if (p.play) {
			for (var i = 0; i < 20; i++) {
				var d = p.data[p.floor(p.random(p.data.length))]
				var output = p.mlp.forward(d[0])
				p.mlp.backward(d[1])
			}
			p.mlp.applyDerivs();
		}
		
		// points
		p.stroke(0,255,0)
		p.strokeWeight(6)
		for (var i = 0; i < p.data.length; i++) {
			drawPoint(p,p.data[i][0][0], p.data[i][1][0])
		}
		var g = []

		// mlp
		p.stroke(255,0,0)
		p.strokeWeight(2)
		for (var i = -1; i <= 1; i+=0.04) {
			g.push([i, p.mlp.forward([i])[0]])
		}
		drawGraph(p,g)
	}}

function container4(p) {
	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        p.m = p.random(-1,1)
        p.b = p.random(-1,1)

	}

	p.draw = function() {
		p.background(255);

		drawGrid(p)
		var g1 = []
		var g2 = []

		for (var i = -1; i < 1; i+=0.05) {
			g1.push([i, p.max(0,i*p.m+p.b)])
		}
		for (var i = -1.2; i < 1.2; i+=0.05) {
			g2.push([i, i*p.m+p.b])
		}
		p.strokeWeight(1)
		p.stroke(0,255,0)
		drawGraph(p,g2)


		p.strokeWeight(2)
		p.stroke(255,0,0)
		drawGraph(p,g1)
	}}

function container5(p) {

	container3(p)
	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        //p.mlp = new MLP([1,[35,'relu'],[35,'relu'],[35,'leakyrelu'],5,1])
        p.mlp = new MLP([1,[1,'leakyrelu'],[2,'leakyrelu'],[3,'leakyrelu'],4,1])
        p.data = []
        for (var i = -0.8; i <= 0.8; i+=0.05) {
		  	p.data.push([[i],[i**3+Math.random()*0.3]])
		}
	}}

function container6(p) {
	container2(p)
	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        p.p = 1
        p.l = 2
        p.speed = 1.5

        p.generate()

        p.schema[0][0].name="P1"
        p.schema[1][0].name="P2"
    }}

function container7(p) {
	container2(p)
	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        p.p = 1
        p.l = 3
        p.speed = 1.5

        p.generate()

        p.schema[0][0].name="P1"
        p.schema[1][0].name="P2"
        p.schema[2][0].name="P3"
    }}

function container8(p) {
	container2(p)
	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        p.p = 2
        p.l = 3
        p.speed = 1.5

        p.generate()

        p.schema[0][0].name="P1"
        p.schema[1][0].name="P2"
        p.schema[1][1].name="P3"
        p.schema[2][0].name="P4"
    }}

function container9(p) {
	container3(p)
	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        //p.mlp = new MLP([1,[35,'relu'],[35,'relu'],[35,'leakyrelu'],5,1])
        p.mlp = new MLP([1,[3,'relu'],[3,'relu'],[3,'relu'],4,1])
        //p.mlp = new MLP([1,1,2,3,4,1])
        p.data = []
        for (var i = -0.8; i <= 0.8; i+=0.05) {
		  	p.data.push([[i],[i**3+Math.random()*0.3]])
		}

		p.play = true
	}
}
function container10(p) {

	p.setup = function(){
        p.createCanvas(400, 400);
        p.background(255,255,255);

        //p.mlp = new MLP([1,[35,'relu'],[35,'relu'],[35,'leakyrelu'],5,1])
        p.mlp = new MLP([2,4,6,[8,'leakyrelu'],8,[1,'sigmoid']])
        //p.mlp = new MLP([1,1,2,3,4,1])
        p.data = []
        for (var i = 0; i < 20; i++) {
        	var a = p.random(2*Math.PI)
        	var r = p.random(0.5)
		  	p.data.push([[p.cos(a)*r, p.sin(a)*r],[0]])
		}
		for (var i = 0; i < 20; i++) {
        	var a = p.random(2*Math.PI)
        	var r = p.random(0.5)+0.5
		  	p.data.push([[p.cos(a)*r, p.sin(a)*r],[1]])
		}

		p.play = true
	}

	p.draw = function () {

		if (p.notFirst && containers[currentContainer] != p) return
		p.notFirst = true


        if (p.play) {
			for (var i = 0; i < 30; i++) {
				var d = p.data[p.floor(p.random(p.data.length))]
				var output = p.mlp.forward(d[0])
				p.mlp.backward(d[1])
			}
			p.mlp.applyDerivs();
		}

		if (p.play || !p.notFirst) {

			p.background(255,255,255)
        	drawGrid(p)

			p.rectMode(p.CORNER)
	        p.noStroke()
	        var step = 0.05
	        for (var i = -1.3; i <= 1.3; i+=step) {
	            for (var j = -1.3; j <= 1.3; j+=step) {
	                var z = p.mlp.forward([i,j]) > 0.5
	                z *= 1

	                if (z)
	                    p.fill(0,255,0, 50)
	                else 
	                    p.fill(255,155,0, 50)
	                drawRect(p, i, j, step, step)
	            }            
	        }

	        for (var i = 0; i < p.data.length; i++) {
	            if (p.data[i][1][0])
	                p.stroke(0,255,0)
	            else 
	                p.stroke(255,155,0)
	            p.strokeWeight(10)
	            drawPoint(p, p.data[i][0][0], p.data[i][0][1])
	            
	        }
        }
	}
}

function container11(p) {

	p.mouseClicked = function () {
        
        if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0|| p.mouseY > p.height)
            return
		p.xs.push(p.xs[p.xs.length-1] - p.a*2*p.xs[p.xs.length-1])

	}

	p.setup = function() {
		p.createCanvas(400, 400);
        p.background(255,255,255);

        p.xs = [1]
        p.a = 1
	}

	p.draw = function() {
		p.background(255,255,255)
        drawGrid(p)

        var g1 = []

		for (var i = -1.2; i < 1.2; i+=0.05) {
			g1.push([i, i*i-0.7])
		}
		p.strokeWeight(1)
		p.stroke(0,255,0)
		drawGraph(p,g1)



		p.strokeWeight(2)


        for (var i = 0; i < p.xs.length; i++) {
        	if (i==0) {
        		continue
        	}
			var c = color(i)
			p.stroke(c[0],c[1],c[2])
        	drawLine(p,p.xs[i-1], p.xs[i-1]**2-0.7, p.xs[i], p.xs[i]**2-0.7)
        }
        p.strokeWeight(6)
        p.stroke(255,0,0)
        drawPoint(p,p.xs[p.xs.length-1], p.xs[p.xs.length-1]**2-0.7)
	}

}