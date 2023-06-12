class NoiseProcessor extends AudioWorkletProcessor {

	process(inputs, outputs) {

		for (var i = 0; i < outputs[0][0].length; i++) {
			outputs[0][0][i] = Math.random()*2-1
		}
		return true
	}

}
class MTOFProcessor extends AudioWorkletProcessor {

	process(inputs, outputs) {

		for (var i = 0; i < outputs[0][0].length; i++) {
			outputs[0][0][i] = Math.pow(2, (inputs[0][0][i]-69)/12)*440	
		}
		return true
	}

}
class FTOMProcessor extends AudioWorkletProcessor {

	process(inputs, outputs) {

		for (var i = 0; i < outputs[0][0].length; i++) {
			outputs[0][0][i] = 69 + 12*Math.log(inputs[0][0][i]/440)/Math.log(2)	
		}
		return true
	}

}
class MultiplyProcessor extends AudioWorkletProcessor {
	
	constructor() {
		super()
		this.port.onmessage = (m)=>this.onMessage(m)
	}

	process(inputs, outputs) {

		for (var i = 0; i < outputs[0][0].length; i++) {
			outputs[0][0][i] = (!isFinite(this.const0)?inputs[0][0][i]:this.const0)*(!isFinite(this.const1)?inputs[1][0][i]:this.const1)
		}
		return true
	}

	onMessage(m) {
		if (["const0","const1"].indexOf(m.data.set) != -1) {
			this[m.data.set] = m.data.data
		}

	} 

}
class AdditionProcessor extends AudioWorkletProcessor {
	
	constructor() {
		super()
		this.port.onmessage = (m)=>this.onMessage(m)
	}

	process(inputs, outputs) {
		for (var i = 0; i < outputs[0][0].length; i++) {
			outputs[0][0][i] = (!isFinite(this.const0)?inputs[0][0][i]:this.const0)+(!isFinite(this.const1)?inputs[1][0][i]:this.const1)
		}
		return true
	}
	onMessage(m) {
		if (["const0","const1"].indexOf(m.data.set) != -1) {
			this[m.data.set] = m.data.data
		}

	} 

}
class ScaleProcessor extends AudioWorkletProcessor {
	
	constructor() {
		super()
		this.port.onmessage = (m)=>this.onMessage(m)
	}

	onMessage(m) {
		if (["inLow","inHigh","outLow","outHigh"].indexOf(m.data.set) != -1) {
			this[m.data.set] = m.data.data
		}

	} 

	process(inputs, outputs) {
		var out
		if(this.inLow==this.inHigh || this.outLow == this.outHigh) {
			out = (this.outLow+this.outHigh)/2
		}
		if (out != undefined) {
			for (var i = 0; i < outputs[0][0].length; i++) {
				outputs[0][0][i] = out
			}
		} else {
			for (var i = 0; i < outputs[0][0].length; i++) {
				outputs[0][0][i] = this.outLow + (inputs[0][0][i]-this.inLow)*(this.outHigh-this.outLow)/(this.inHigh-this.inLow)
			}
		}
		return true
	}

}
class GateProcessor extends AudioWorkletProcessor {
	
	constructor() {
		super()
		this.on = true
		this.port.onmessage = (m)=>this.onMessage(m)
	}

	onMessage(m) {
		if (m.data.slice(0,2)=="on") {
			this.on = (m.data.slice(2,3) == "1")
		}
	} 

	process(inputs, outputs) {
		if (this.on){//||this.node.node.on) {
			outputs[0][0].set(inputs[0][0])
		}
		return true
	}

}
class ClipProcessor extends AudioWorkletProcessor {
	
	constructor() {
		super()
		this.low = -1
		this.high = 1
		this.port.onmessage = (m)=>this.onMessage(m)
	}
	onMessage(m) {
		if (m.data.slice(0,3)=="low") {
			this.low = parseFloat(m.data.slice(3))
		} else if (m.data.slice(0,4)=="high") {
			this.high = parseFloat(m.data.slice(4))
		}
	} 
	process(inputs, outputs) {
		for (var i = 0; i < outputs[0][0].length; i++) {
			outputs[0][0][i] = Math.min(Math.max(inputs[0][0][i], this.low), this.high)
		}
		return true
	}

}

registerProcessor('noise-processor', NoiseProcessor)
registerProcessor('mtof-processor', MTOFProcessor)
registerProcessor('ftom-processor', FTOMProcessor)
registerProcessor('multiply-processor', MultiplyProcessor)
registerProcessor('addition-processor', AdditionProcessor)
registerProcessor('scale-processor', ScaleProcessor)
registerProcessor('gate-processor', GateProcessor)
registerProcessor('clip-processor', ClipProcessor)