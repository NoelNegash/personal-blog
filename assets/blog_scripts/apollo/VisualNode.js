function rectContainsPoint(x,y,w,h,x1,y1) {
  return x1 > x && x1 < x+w && y1 > y && y1 < y+h
} 

class VisualNode {
	
	constructor(context,x,y) {
	    this.x = x
	    this.y = y
	    this.w = 100
	    this.text = ""
	    this.editable = true
	    this.h = 25
	  
		this.inputs = []
		this.outputs = []
		this.context = context
	}

	valid() {
		return false
	}

	containsPoint(x,y) {
		return x > this.x && x < this.x+this.w && y > this.y && y < this.y+this.h
	}

	inRect(x1,y1,x2,y2) {
		return this.x > x1 && this.x+this.w < x2 && this.y > y1 && this.y+this.h < y2
	}
	draw (p) {
		if (this.dragging) p.stroke(0,0,255)
		else if (this.selected) p.stroke(255,0,0)
		else p.stroke(0,0,0)

		p.strokeWeight(1)
		if (this.color) {
			p.fill(this.color[0],this.color[1],this.color[2])
		} else {
			p.fill(255,255,255)
		}
		p.rect(this.x, this.y, this.w, this.h)

		p.fill(0,0,0)
		p.stroke(0,0,0)

		p.textFont('monospace')
		p.textAlign(p.LEFT, p.CENTER)
		p.text(this.t, this.x+7, this.y+this.h/2)

		if (this.editing && p.floor(p.frameCount/20)%2 == 0) {
			p.line(this.x+7+this.t.length*6.6+2, this.y+5, this.x+7+this.t.length*6.6+2, this.y+19)
		}

		p.noStroke()

		var space = this.w/(this.inputs.length+1)
		var x = 0
		for (var i = 0; !this.isReceive && i < this.inputs.length; i++) {
			x+=space
			switch(this.inputs[i].getType()) {
				case "signal":
				p.fill(220,0,0)
				break;
				case "control":
				p.fill(0,220,0)
				break;
				case "both":
				p.fill(200,200,200)
				break
			}
			
			p.rect(this.x+x-3, this.y-15, 6, 15)
		}

		space = this.w/(this.outputs.length+1)
		x = 0
		for (var i = 0; !this.isSend && i < this.outputs.length; i++) {
			x+=space	

			switch(this.outputs[i].getType()) {
				case "signal":
				p.fill(220,0,0)
				break;
				case "control":
				p.fill(0,220,0)
				break;
				case "both":
				p.fill(200,200,200)
				break
			}
			p.rect(this.x+x-3, this.y+this.h, 6, 15)
		}
	}
	connectControl(output, index) {
		// to be implemented in subclasses
	}
	connectSignal(output, index) {
		// to be implemented in subclasses
	}
	disconnectControl(output, index) {
		// to be implemented in subclasses
	}
	disconnectSignal(output, index) {
		// to be implemented in subclasses
	}
	onMousePressed(p) {}
	onMouseReleased(p) {}
	onMouseDragged(p) {}
	get text() {
		return this.t
	}
	set text(val) {
		this.t = val
		this.w = 14+val.length*6.6
	}
}

class GUINode {
	
	constructor(context,x,y,w,h) {
	    this.x = x
	    this.y = y
	    this.w = w
	    this.h = h
	  
		this.inputs = []
		this.outputs = []
		this.context = context
	}

	valid() {
		return false
	}

	containsPoint(x,y) {
		return x > this.x && x < this.x+this.w && y > this.y && y < this.y+this.h
	}

	inRect(x1,y1,x2,y2) {
		return this.x > x1 && this.x+this.w < x2 && this.y > y1 && this.y+this.h < y2
	}
	actualDraw(p) {
		p.strokeWeight(1)
		p.rect(this.x, this.y, this.w, this.h)
	}
	draw (p) {
		if (this.dragging) p.stroke(0,0,255)
		else if (this.selected) p.stroke(255,0,0)
		else p.stroke(0,0,0)

		this.actualDraw(p)

		p.noStroke()

		var space = this.w/(this.inputs.length+1)
		var x = 0
		for (var i = 0; i < this.inputs.length; i++) {
			x+=space
			switch(this.inputs[i].getType()) {
				case "signal":
				p.fill(220,0,0)
				break;
				case "control":
				p.fill(0,220,0)
				break;
				case "both":
				p.fill(200,200,200)
				break
			}
			
			p.rect(this.x+x-3, this.y-15, 6, 15)
		}

		space = this.w/(this.outputs.length+1)
		x = 0
		for (var i = 0; i < this.outputs.length; i++) {
			x+=space	

			switch(this.outputs[i].getType()) {
				case "signal":
				p.fill(220,0,0)
				break;
				case "control":
				p.fill(0,220,0)
				break;
				case "both":
				p.fill(200,200,200)
				break
			}
			p.rect(this.x+x-3, this.y+this.h, 6, 15)
		}
	}
	connectControl(output, index) {
		// to be implemented in subclasses
	}
	connectSignal(output, index) {
		// to be implemented in subclasses
	}
	disconnectControl(output, index) {
		// to be implemented in subclasses
	}
	disconnectSignal(output, index) {
		// to be implemented in subclasses
	}
	onMousePressed(p) {}
	onMouseReleased(p) {}
	onMouseDragged(p) {}
	get text() {
		return this.t
	}
	
	set text(val) {
		this.t = val
	}
}

class KeyboardNode extends GUINode {
	constructor(context, x, y, inputs, args=[]) {
		var keyWidth = 15
		var octaves = 3
		var keyHeight = 50

		super(context,x,y,keyWidth*octaves*7, keyHeight);

		this.editable = false

		this.keyHeight = keyHeight
		this.keyWidth = keyWidth
		this.octaves = octaves

		this.text = "keyboard"

		this.velocity = 100
		//TODO add slider to keyboard for velocity

		this.keys = []
		var blackKeys = []
		for (var i = 0; i < this.octaves*12; i++) {
			var white = [0,2,4,5,7,9,11].indexOf(i%12)
			var black = [1,3,undefined,6,8,10].indexOf(i%12)
			if (white!=-1) {
				// white keys
				this.keys.push({x:this.keyWidth*(Math.floor(i/12)*7+white), y:0, w:this.keyWidth, h:this.keyHeight, midi:i+60})
			} else {
				blackKeys.push({x:this.keyWidth*(Math.floor(i/12)*7+black+0.75), y:0, w:this.keyWidth*0.5, h:this.keyHeight*0.6, midi:i+60, black:true})
			}
		}
		for (var i = 0; i < blackKeys.length; i++) {
			this.keys.push(blackKeys[i])
		}


		this.outputs.push(new VisualOutput(this,0,"control"))
	}
	actualDraw(p) {
		p.rect(this.x, this.y, this.w, this.h)
		p.stroke(0,0,0)
		p.strokeWeight(1)
		for (var i = 0; i < this.keys.length; i++) {
			var k = this.keys[i]
			if (k.on) p.fill(180,180,180)
			else if (k.black) p.fill(0,0,0)
			else p.fill(255,255,255)

			p.rect(this.x+k.x, this.y+k.y, k.w, k.h)
		}
	}
	onMousePressed(p) {
		for (var i = this.keys.length-1; i >= 0; i--) {
			var k = this.keys[i]
			if (rectContainsPoint(this.x+k.x, this.y+k.y, k.w, k.h, p.mouseX, p.mouseY)) {
				if (!k.on) {
					this.outputs[0].sendMessage([k.midi, this.velocity])
				}
				k.on = true
				break
			}
		}
	}
	onMouseReleased(p) {
		for (var i = this.keys.length-1; i >= 0; i--) {
			var k = this.keys[i]
			if (rectContainsPoint(this.x+k.x, this.y+k.y, k.w, k.h, p.mouseX, p.mouseY)) {
				if (k.on) {
					this.outputs[0].sendMessage([k.midi, 0])
				}
				k.on = false
				break
			}
		}
	}
	onMouseDragged(p) {
		for (var i = this.keys.length-1; i >= 0; i--) {
			var k = this.keys[i]
			if (rectContainsPoint(this.x+k.x, this.y+k.y, k.w, k.h, p.mouseX, p.mouseY)) {
				if (!k.on) {
					this.outputs[0].sendMessage([k.midi, this.velocity])
				}
				k.on = true
			} else {
				if (k.on) {
					this.outputs[0].sendMessage([k.midi, 0])
				}
				k.on = false
			}
		}
	}
}
class TrackpadNode extends GUINode {
	constructor(context, x, y, inputs, args=[]) {
		
		super(context,x,y,100,100);

		this.editable = false

		this.text = "trackpad"

		this.outputs.push(new VisualOutput(this,0,"control"))
		this.outputs.push(new VisualOutput(this,1,"control"))
	}
	actualDraw(p) {
		p.fill(180,180,180)
		p.rect(this.x, this.y, this.w, this.h)
	}
	onMousePressed(p) {
		this.active = true
		this.coords = [p.mouseX-this.x, p.mouseY-this.y]
	}
	onMouseReleased(p) {
		this.active = false
	}
	onMouseDragged(p) {
		this.coords = [p.mouseX-this.x, p.mouseY-this.y]
	}

	set coords(val) {
		var xCoord = Math.min(Math.max(val[0],0),100)
		var yCoord = Math.min(Math.max(val[1],0),100)
		this.outputs[1].sendMessage(yCoord)
		this.outputs[0].sendMessage(xCoord)
	}
}
class VerticalSliderNode extends GUINode {
	constructor(context, x, y, inputs, args=[]) {
		
		super(context,x,y,20,160);

		this.outputs.push(new VisualOutput(this,0,"control"))

		this.text = "vslider"

		this.editable = false

		this.value = 75

	}
	actualDraw(p) {
		p.strokeWeight(1)
		p.fill(255,255,255)
		p.rect(this.x, this.y, this.w, this.h)
		p.rect(this.x-5, this.y+this.h-(this._value), this.w+10, 10)
	}
	onMousePressed(p) {
		this.active = true
		this.value = p.mouseY-(this.y+5)
	}
	onMouseReleased(p) {
		this.active = false
	}
	onMouseDragged(p) {
		this.value = p.mouseY-(this.y+5)
	}

	set value(val) {
		var val = this.h-Math.min(Math.max(val,0),this.h-10)
		this.outputs[0].sendMessage((val-10)*100/(this.h-10))
		this._value = val
	}
}
class HorizontalSliderNode extends GUINode {
	constructor(context, x, y, inputs, args=[]) {
		
		super(context,x,y,160,20);

		this.outputs.push(new VisualOutput(this,0,"control"))

		this.editable = false

		this.text = "hslider"

		this.value = 75

	}
	actualDraw(p) {
		p.strokeWeight(1)
		p.fill(255,255,255)
		p.rect(this.x, this.y, this.w, this.h)
		p.rect(this.x+this._value, this.y-5, 10, this.h+5)
	}
	onMousePressed(p) {
		this.active = true
		this.value = p.mouseX-(this.x+5)
	}
	onMouseReleased(p) {
		this.active = false
	}
	onMouseDragged(p) {
		this.value = p.mouseX-(this.x+5)
	}

	set value(val) {
		var val = Math.min(Math.max(val,0),this.w-10)
		this.outputs[0].sendMessage((val)*100/(this.w-10))
		this._value = val
	}
}
class KnobNode extends GUINode {
	constructor(context, x, y, inputs, args=[]) {
		
		super(context,x,y,30,30);

		this.outputs.push(new VisualOutput(this,0,"control"))


		this.text = "knob"
		this.editable = false

		this.value = 50

	}
	actualDraw(p) {
		p.strokeWeight(1)
		p.fill(255,255,255)
		p.rect(this.x, this.y, this.w, this.h)
		p.ellipse(this.x+15, this.y+15, 25, 25)

		p.strokeWeight(2)
		p.stroke(0,0,255)
		p.arc(this.x+15, this.y+15, 25, 25, 90*Math.PI/180, 90*Math.PI/180+this.value*2*Math.PI/100)
	}
	onMousePressed(p) {
		this.active = true
	}
	onMouseReleased(p) {
		this.active = false
	}
	onMouseDragged(p) {
		this.value -= p.movedY
	}

	set value(val) {
		val = Math.min(Math.max(val,0),100)
		this.outputs[0].sendMessage(val)
		this._value = val
	}
	get value(){
		return this._value
	}
}

class LowPassFilterNode extends VisualNode {
	constructor(context,x,y, inputs, args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, "signal"))
		this.inputs.push(new VisualInput(this, 1, "both"))
		this.inputs.push(new VisualInput(this, 2, "both"))

		this.outputs.push(new VisualOutput(this,0,"signal"))


		this.inputs[1].onmessage = (m)=>{this.actualNode.frequency.value = m}
		this.inputs[2].onmessage = (m)=>{this.actualNode.Q.value = m}

		this.actualNode = new BiquadFilterNode(context,{type:"lowpass"})
		this.actualNode.frequency.value = (isNaN(parseFloat(args[0]))?440:parseFloat(args[0]))
		this.actualNode.Q.value = (isNaN(parseFloat(args[1]))?1:parseFloat(args[1]))

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "osc"
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.connect(this.actualNode.frequency)
		} else if (index == 2) {
			output.actualNode.connect(this.actualNode.Q)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.disconnect(this.actualNode.frequency)
		} else if (index == 2) {
			output.actualNode.disconnect(this.actualNode.Q)
		}
	}
}
class HighPassFilterNode extends VisualNode {
	constructor(context,x,y, inputs, args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, "signal"))
		this.inputs.push(new VisualInput(this, 1, "both"))
		this.inputs.push(new VisualInput(this, 2, "both"))

		this.outputs.push(new VisualOutput(this,0,"signal"))


		this.inputs[1].onmessage = (m)=>{this.actualNode.frequency.value = m}
		this.inputs[2].onmessage = (m)=>{this.actualNode.Q.value = m}

		this.actualNode = new BiquadFilterNode(context,{type:"highpass"})
		this.actualNode.frequency.value = (isNaN(parseFloat(args[0]))?440:parseFloat(args[0]))
		this.actualNode.Q.value = (isNaN(parseFloat(args[1]))?1:parseFloat(args[1]))

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "osc"
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.connect(this.actualNode.frequency)
		} else if (index == 2) {
			output.actualNode.connect(this.actualNode.Q)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.disconnect(this.actualNode.frequency)
		} else if (index == 2) {
			output.actualNode.disconnect(this.actualNode.Q)
		}
	}
}
class BandPassFilterNode extends VisualNode {
	constructor(context,x,y, inputs, args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, "signal"))
		this.inputs.push(new VisualInput(this, 1, "both"))
		this.inputs.push(new VisualInput(this, 2, "both"))

		this.outputs.push(new VisualOutput(this,0,"signal"))


		this.inputs[1].onmessage = (m)=>{this.actualNode.frequency.value = m}
		this.inputs[2].onmessage = (m)=>{this.actualNode.Q.value = m}

		this.actualNode = new BiquadFilterNode(context,{type:"bandpass"})
		this.actualNode.frequency.value = (isNaN(parseFloat(args[0]))?440:parseFloat(args[0]))
		this.actualNode.Q.value = (isNaN(parseFloat(args[1]))?1:parseFloat(args[1]))

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "osc"
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.connect(this.actualNode.frequency)
		} else if (index == 2) {
			output.actualNode.connect(this.actualNode.Q)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.disconnect(this.actualNode.frequency)
		} else if (index == 2) {
			output.actualNode.disconnect(this.actualNode.Q)
		}
	}
}

class Oscillator extends VisualNode {
	constructor(context,x,y, inputs, args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, inputs[0]))

		this.outputs.push(new VisualOutput(this,0,"signal"))


		this.inputs[0].onmessage = (m)=>{this.actualNode.frequency.value = m}

		this.actualNode = context.createOscillator()
		this.actualNode.frequency.value = (isNaN(parseFloat(args[0]))?440:parseFloat(args[0]))

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "osc"

		this.actualNode.start()
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode.frequency)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode.frequency)
		}
	}
}

class SendNode extends VisualNode {
	constructor(context,x,y, inputs, args=[], parentPatch) {
		super(context,x,y)

		if (args[0]==undefined) args[0] = ""
		for (var i = 0; i < parentPatch.count; i++) {
			if (!parentPatch[i]) continue
			if (parentPatch[i].isSend && !parentPatch[i].dead && parentPatch[i].sendId == args[0]) {
				throw new Error()
			}
		}



		this.inputs.push(new VisualInput(this, 0, inputs[0]))

		this.outputs.push(new VisualOutput(this,0,inputs[0]))


		this.inputs[0].onmessage = (m)=>{this.outputs[0].sendMessage(m)}

		this.actualNode = context.createGain()

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.isSend = true
		this.sendId = args[0]

		this.text = "send"
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}
}
class ReceiveNode extends VisualNode {
	constructor(context,x,y, inputs, args=[], parentPatch) {
		super(context,x,y)

		if (args[0] == undefined) args[0] = ""
		var sender
		for (var i = 0; i < parentPatch.count; i++) {
			if (!parentPatch[i]) continue
			console.log(parentPatch[i])
			if (parentPatch[i].isSend && parentPatch[i].sendId == args[0]) {
				sender = parentPatch[i]
				break
			}

		}
		if (sender) {
			console.log("sender")
			this.inputs.push(new VisualInput(this, 0, sender.outputs[0].getType()))
			this.outputs.push(new VisualOutput(this,0, sender.outputs[0].getType()))			
		} else {
			this.inputs.push(new VisualInput(this, 0, "both"))
			this.outputs.push(new VisualOutput(this,0, "both"))	
		}


		this.inputs[0].onmessage = (m)=>{this.outputs[0].sendMessage(m)}
		this.actualNode = context.createGain()

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0



		if (sender) this.inputs[0].connect(sender.outputs[0])



		this.isReceive = true
		this.sendId = args[0]

		this.text = "receive"
	}

	connectSignal(output, index) {
		console.log(output.actualNode, this.actualNode)
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}
}
class NoiseNode extends VisualNode {
	constructor(context,x,y, inputs) {
		super(context,x,y)

		this.outputs.push(new VisualOutput(this,0,"signal"))

		this.actualNode = new AudioWorkletNode(context, 'noise-processor')

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "noise"
		this.actualNode.start()
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode.frequency)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode.frequency)
		}
	}
}
class SawOscillator extends VisualNode {
	constructor(context,x,y, inputs,args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, inputs[0]))

		this.outputs.push(new VisualOutput(this,0,"signal"))


		this.inputs[0].onmessage = (m)=>{this.actualNode.frequency.value = m}

		this.actualNode = new OscillatorNode(this.context,{type:"sawtooth"})
		this.actualNode.frequency.value = (isNaN(parseFloat(args[0]))?440:parseFloat(args[0]))

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "saw"
		this.actualNode.start()
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode.frequency)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode.frequency)
		}
	}
}
class TriangleOscillator extends VisualNode {
	constructor(context,x,y, inputs,args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, inputs[0]))

		this.outputs.push(new VisualOutput(this,0,"signal"))


		this.inputs[0].onmessage = (m)=>{this.actualNode.frequency.value = m}

		this.actualNode = new OscillatorNode(this.context,{type:"triangle"})
		this.actualNode.frequency.value = (isNaN(parseFloat(args[0]))?440:parseFloat(args[0]))

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "triangle"
		this.actualNode.start()
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode.frequency)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode.frequency)
		}
	}
}
class SquareOscillator extends VisualNode {
	constructor(context,x,y, inputs,args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, inputs[0]))

		this.outputs.push(new VisualOutput(this,0,"signal"))


		this.inputs[0].onmessage = (m)=>{this.actualNode.frequency.value = m}

		this.actualNode = new OscillatorNode(this.context,{type:"square"})
		this.actualNode.frequency.value = (isNaN(parseFloat(args[0]))?440:parseFloat(args[0]))

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "square"
		this.actualNode.start()
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode.frequency)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode.frequency)
		}
	}
}



class DACNode extends VisualNode {
	constructor(context,x,y,inputs) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, "signal"))

		this.actualNode = context.createGain()
		this.actualNode.connect(context.output)
		this.actualNode.gain.value = 0

		this.text = "dac"
		this.isDac = true
	}

	connectSignal(output, index) {
		output.actualNode.connect(this.actualNode)
	}
	disconnectSignal(output, index) {
		output.actualNode.disconnect(this.actualNode)
	}
}

class ADCNode extends VisualNode {
	constructor(context,x,y,inputs) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this, 0, "signal"))

		this.text = "adc"

		this.actualNode = context.createOscillator()
		this.actualNode.frequency.value = 440

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		navigator.mediaDevices.getUserMedia({audio:true, video:false}).then((stream)=> {

			var inp = []
			while(this.outputs[0].connections.length) {
				inp.push(this.outputs[0].connections[0])
				inp[inp.length-1].disconnect(this.outputs[0])
			}

			this.actualNode = new MediaStreamAudioSourceNode(this.context,{mediaStream:stream})
			this.outputs[0].actualNode = this.actualNode

			for(var i = 0; i < inp.length; i++) {
				inp[i].connect(this.outputs[0])
			}

			
		})
	}
}



class MultiplyNode extends VisualNode {
	constructor(context,x,y,inputs,args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, inputs[0]))
		this.inputs.push(new VisualInput(this, 1, inputs[1]))

		var o = "both"
		if (inputs.indexOf("signal")!=-1) o = "signal"
		else if (inputs.indexOf("both")==-1) o = "control"
		this.outputs.push(new VisualOutput(this,0,o))

		this.actualNode = new AudioWorkletNode(context, 'multiply-processor', {numberOfInputs:2});

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		if(parseFloat(args[0]) != NaN) {
			this.const1 = parseFloat(args[0])	
		}


		
		this.inputs[0].onmessage = (m)=>{
			this.const0 = m
			if(this.outputs[0].type == "control") {
				this.outputs[0].sendMessage(this.c0*this.c1)
			}
		}
		this.inputs[1].onmessage = (m)=>{
			this.const1 = m
		}

		this.text = "*"

	}

	set const0(val) {
		this.c0 = val
		this.actualNode.port.postMessage({"set":"const0",data:val});
	}
	set const1(val) {
		this.c1 = val
		this.actualNode.port.postMessage({"set":"const1",data:val});
	}

	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode, output.nodeIndex || 0, index)
		} else if (index == 1) {
			output.actualNode.connect(this.actualNode, output.nodeIndex || 0, index)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode, output.nodeIndex || 0, index)
		} else if (index == 1) {
			output.actualNode.disconnect(this.actualNode, output.nodeIndex || 0, index)
		}
	}
}
class AdditionNode extends VisualNode {
	constructor(context,x,y,inputs,args=[]) {
		super(context,x,y)

		this.inputs.push(new VisualInput(this, 0, "both"))
		this.inputs.push(new VisualInput(this, 1, "both"))

		var o = "both"
		if (inputs.indexOf("signal")!=-1) o = "signal"
		else if (inputs.indexOf("both")==-1) o = "control"
		
		this.outputs.push(new VisualOutput(this,0,o))		

		this.actualNode = new AudioWorkletNode(context, 'addition-processor', {numberOfInputs:2});

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		if(parseFloat(args[0]) != NaN) {
			this.const1 = parseFloat(args[0])	
		}


		this.inputs[0].onmessage = (m)=>{
			this.const0 = m
			if(this.outputs[0].type == "control") {
				this.outputs[0].sendMessage(this.c0+this.c1)
			}
		}
		this.inputs[1].onmessage = (m)=>{
			this.const1 = m
		}

		this.text = "+"
	}

	set const0(val) {
		this.c0 = val
		this.actualNode.port.postMessage({"set":"const0",data:val});
	}
	set const1(val) {
		this.c1 = val
		this.actualNode.port.postMessage({"set":"const1",data:val});
	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode, output.nodeIndex || 0, index)
		} else if (index == 1) {
			output.actualNode.connect(this.actualNode, output.nodeIndex || 0, index)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode, output.nodeIndex || 0, index)
		} else if (index == 1) {
			output.actualNode.disconnect(this.actualNode, output.nodeIndex || 0, index)
		}
	}}

class ScaleNode extends VisualNode {
	constructor(context,x,y,inputs,args=[]) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this,0, inputs[0]))
		this.inputs.push(new VisualInput(this, 0, inputs[0]))
		this.inputs.push(new VisualInput(this, 1, "control"))
		this.inputs.push(new VisualInput(this, 2, "control"))
		this.inputs.push(new VisualInput(this, 3, "control"))
		this.inputs.push(new VisualInput(this, 4, "control"))


		this.inputs[0].onmessage = (m)=>{
			var res = this._outLow + (m-this._inLow)*(this._outHigh-this._outLow)/(this._inHigh-this._inLow)
			this.outputs[0].sendMessage(res)
		}
		this.inputs[1].onmessage = (m)=>{
			this.inLow = m
		}
		this.inputs[2].onmessage = (m)=>{
			this.inHigh = m
		}
		this.inputs[3].onmessage = (m)=>{
			this.outLow = m
		}
		this.inputs[4].onmessage = (m)=>{
			this.outHigh = m
		}

		this.actualNode = new AudioWorkletNode(context, 'scale-processor');
		this.actualNode.node = this

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.inLow = (isNaN(parseFloat(args[0]))?-1:parseFloat(args[0]))
		this.inHigh = (isNaN(parseFloat(args[1]))?1:parseFloat(args[1]))
		this.outLow = (isNaN(parseFloat(args[2]))?-1:parseFloat(args[2]))
		this.outHigh = (isNaN(parseFloat(args[3]))?1:parseFloat(args[3]))

		this.text = "scale"
	}
	set inLow(val) {
		this.actualNode.port.postMessage({"set":"inLow",data:val})
		this._inLow = val
	}
	set inHigh(val) {
		this.actualNode.port.postMessage({"set":"inHigh",data:val})
		this._inHigh = val
	}
	set outLow(val) {
		this.actualNode.port.postMessage({"set":"outLow",data:val})
		this._outLow = val
	}
	set outHigh(val) {
		this.actualNode.port.postMessage({"set":"outHigh",data:val})
		this._outHigh = val
	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}
}

class DelayerNode extends VisualNode {
	constructor(context,x,y,inputs, args=[]) {
		super(context,x,y)

		this.outputs.push(new VisualOutput(this,0, "signal"))
		this.inputs.push(new VisualInput(this, 0, "signal"))
		this.inputs.push(new VisualInput(this, 1, "both"))

		this.inputs[1].onmessage = (m)=>{
			m = parseFloat(m)
			if (!isNaN(m)){
				this.actualNode.delayTime.value = m
			}
		}

		var delayTime = parseFloat(args[0])/1000 || 0
		var maxDelayTime = parseFloat(args[1])/1000 || delayTime || 1

		this.actualNode = new DelayNode(context, {delayTime:delayTime, maxDelayTime:maxDelayTime})
		this.actualNode.node = this

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "delay"

	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.connect(this.actualNode.delayTime)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		} else if (index == 1) {
			output.actualNode.disconnect(this.actualNode.delayTime)
		}
	}
}


class GateNode extends VisualNode {
	constructor(context,x,y,inputs, args=[]) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this,0,inputs[0]))
		this.inputs.push(new VisualInput(this, 0, inputs[0]))
		this.inputs.push(new VisualInput(this, 1, "control"))

		this.inputs[0].onmessage = (m)=>{
			if (this.o) {
				this.outputs[0].sendMessage(m)
			}
		}
		this.inputs[1].onmessage = (m)=>{
			if (m == "bang"){
				this.on = !this.o
			}
			else
				this.on = (m!=0 && m!="stop")
		}

		this.actualNode = new AudioWorkletNode(context, 'gate-processor');
		this.actualNode.node = this

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.on = (["start","on"].indexOf(args[0])!=-1)

		this.text = "gate"

	}
	onMousePressed(p) {
		this.inputs[1].onmessage("bang")
	}
	set on(val) {
		this.o = val
		this.color = [[255,255,255],[220,255,200]][this.o+0]
		this.actualNode.port.postMessage("on"+(val+0))
	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}
}
class MetroNode extends VisualNode {
	constructor(context,x,y,inputs,args=[]) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this,0, "control"))
		this.inputs.push(new VisualInput(this, 0, "control"))
		this.inputs[0].onmessage = (m)=>{
			this.time = m
		}
		this.time = (isNaN(parseFloat(args[0]))?50:parseFloat(args[0]))

		this.text = "metro"

	}
	set time(val) {
		if (this.interval) clearInterval(this.interval)
		this.interval = setInterval(()=>{this.outputs[0].sendMessage("bang")}, val)
	}
}
class MTOFNode extends VisualNode {
	constructor(context,x,y,inputs) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this,0, inputs[0]))
		this.inputs.push(new VisualInput(this, 0, inputs[0]))

		this.inputs[0].onmessage = (m)=>{
			m = parseFloat(m)
			if (m != NaN) {
				var f = Math.pow(2, (m-69)/12)*440	
				this.outputs[0].sendMessage(f)
			}
		}

		this.actualNode = new AudioWorkletNode(context, 'mtof-processor');
		this.actualNode.node = this

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "mtof"

	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}
}
class FTOMNode extends VisualNode {
	constructor(context,x,y,inputs) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this,0, inputs[0]))
		this.inputs.push(new VisualInput(this, 0, inputs[0]))

		this.inputs[0].onmessage = (m)=>{
			m = parseFloat(m)
			if (m != NaN) {
				var m = 69 + 12*Math.log(m/440)/Math.log(2)	
				this.outputs[0].sendMessage(m)
			}
		}

		this.actualNode = new AudioWorkletNode(context, 'ftom-processor');
		this.actualNode.node = this

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.text = "mtof"

	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}
}
class ClipNode extends VisualNode {
	constructor(context,x,y,inputs, args=[]) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this,0, inputs[0]))
		this.inputs.push(new VisualInput(this, 0, inputs[0]))
		this.inputs.push(new VisualInput(this, 1, "control"))
		this.inputs.push(new VisualInput(this, 2, "control"))

		this.inputs[0].onmessage = (m)=>{
			this.outputs[0].sendMessage(Math.max(Math.min(m, this.high), this.low))
		}
		this.inputs[1].onmessage = (m)=>{
			this.low = m
		}
		this.inputs[2].onmessage = (m)=>{
			this.high = m
		}

		this.actualNode = new AudioWorkletNode(context, 'clip-processor');
		this.actualNode.node = this

		this.outputs[0].actualNode = this.actualNode
		this.outputs[0].nodeIndex = 0

		this.low = (isNaN(parseFloat(args[0]))?-1:parseFloat(args[0]))
		this.high = (isNaN(parseFloat(args[1]))?1:parseFloat(args[1]))

		this.text = "clip"

	}
	set low(val) {
		this.actualNode.port.postMessage("low"+val)
	}
	set high(val) {
		this.actualNode.port.postMessage("high"+val)
	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}
}

class PackNode extends VisualNode {
	constructor(context,x,y,inputs,args=[]) {
		super(context,x,y)
		this.outputs.push(new VisualOutput(this,0, "control"))
		//this.inputs.push(new VisualInput(this, 0, "control"))
		this.args = args
		for(var i = 0; i < this.args.length; i++) {
			if (!isNaN(parseFloat(this.args[i]))) {
				this.args[i] = parseFloat(this.args[i])
			}

			this.inputs.push(new VisualInput(this, i, "control"))
			var j = i
			if (j==0) {
				this.inputs[j].onmessage = function(m){
					this.node.args[this.index] = m
					this.node.outputs[0].sendMessage(this.node.args)
				}
			} else {
				this.inputs[j].onmessage = function(m){
					this.node.args[this.index] = m
				}
			}

		}

		this.text = "pack"

	}
}

class UnpackNode extends VisualNode {
	constructor(context,x,y,inputs,args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, "control"))
		this.args = args

		for(var i = 0; i < this.args.length; i++) {
			if (!isNaN(parseFloat(this.args[i]))) {
				this.args[i] = parseFloat(this.args[i])
			}

			this.outputs.push(new VisualOutput(this,i, "control"))
		}


		this.inputs[0].onmessage = (m)=>{
			for (var i = 0; i < m.length&& i < this.args.length; i++) {
				this.args[i] = m[i]
			}
			for (var i = this.outputs.length-1; i >= 0; i--) {
				this.outputs[i].sendMessage(this.args[i])
			}
		}


		this.text = "pack"

	}
}

class FourierNode extends VisualNode {
	constructor(context,x,y,inputs,args=[]) {
		super(context,x,y)
		this.inputs.push(new VisualInput(this, 0, "signal"))
		this.outputs.push(new VisualOutput(this, 0, "control"))

		this.actualNode = new AnalyserNode(this.context)
		this.args = args


		if (args[0] == undefined || args[0] == "max") {
			this.interval = setInterval(()=>{
				if(this.dead) clearInterval(this.interval)

				var peaks = this.calculatePeaks()
				this.outputs[0].sendMessage(peaks[0])

			}, 100)
		} else {
			var amount = parseInt(args[1]) || 2
			this.interval = setInterval(()=>{
				if(this.dead) clearInterval(this.interval)

				var peaks = this.calculatePeaks()
				this.outputs[0].sendMessage(peaks.slice(0,amount))

			}, 100)

		}

	
		this.text = "fourier"

	}
	calculatePeaks() {
		var data = new Float32Array(this.actualNode.frequencyBinCount)
		var peaks = []
		this.actualNode.getFloatFrequencyData(data)
		for (var i = 1; i < data.length-2; i++) {
			if (data[i]>data[i-1] && data[i]>data[i+1]) {
				peaks.push([i*this.context.sampleRate/2000, Math.pow(10, data[i]/20)])
			}
		}
		peaks.sort((x,y)=>y[1]-x[1])
		return peaks
	}
	connectSignal(output, index) {
		if (index == 0) {
			output.actualNode.connect(this.actualNode)
		}
	}
	disconnectSignal(output, index) {
		if (index == 0) {
			output.actualNode.disconnect(this.actualNode)
		}
	}

}


class VisualOutput {
	constructor(node, index, type="signal") {
		this.node = node
		this.type = type
		this.index = index

		this.connections = []

		this.actualNode = undefined
		this.nodeIndex = undefined
	}

	sendMessage(m) {
		for (var i = 0; i < this.connections.length; i++) {
			this.connections[i].onmessage(m)
		}
	}
	getType() {
		return this.type
	}

	get x() {
		return this.node.x + this.node.w*(this.index+1)/(this.node.outputs.length+1)
	}
	get y() {
		return this.node.y+this.node.h+15
	}
}

class VisualInput {

	constructor(node, index, type="signal") {
		this.node = node
		this.type = type
		this.index = index

		this.connections = []
	}

	connect(output) {
		if (this.connections.indexOf(output) != -1 || output.getType() == "both") return

		if (this.getType() == "both" || this.getType() == output.type) {
			this.connections.push(output)
			output.connections.push(this)
			if (output.type == "control") {
				this.node.connectControl(output, this.index)
			} else {
				this.node.connectSignal(output, this.index)
			}
		}
	}
	disconnect(output) {
		if (this.connections.indexOf(output) != -1) {
			this.connections.splice(this.connections.indexOf(output),1)
		}
		if (output.connections.indexOf(this) != -1) {
			output.connections.splice(output.connections.indexOf(this),1)
		} 

		if (output.getType() == "control") {
			this.node.disconnectControl(output, this.index)
		} else {
			this.node.disconnectSignal(output, this.index)
		}
	}

	onmessage() {

	}

	getType() {
		if (this.type == "both") {
			if (this.connections[0]) return this.connections[0].type
			return "both"
		}
		return this.type
	}

	get x() {
		return this.node.x + this.node.w*(this.index+1)/(this.node.inputs.length+1)
	}
	get y() {
		return this.node.y-15
	}
}