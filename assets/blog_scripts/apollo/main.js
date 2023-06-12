
var schemas = {
  "osc":{class:Oscillator, inputs:["both"], properties:["frequency"]},
  "saw":{class:SawOscillator, inputs:["both"], properties:["frequency"]},
  "triangle":{class:TriangleOscillator, inputs:["both"], properties:["frequency"]},
  "square":{class:SquareOscillator, inputs:["both"], properties:["frequency"]},
  "noise":{class:NoiseNode, inputs:[], properties:[]},
  "lowpass":{class:LowPassFilterNode, inputs:["signal","both","both"], properties:[]},
  "highpass":{class:HighPassFilterNode, inputs:["signal","both","both"], properties:[]},
  "bandpass":{class:BandPassFilterNode, inputs:["signal","both","both"], properties:[]},
  "dac":{class:DACNode, inputs:["signal"], properties:[]},
  "adc":{class:ADCNode, inputs:[], properties:[]},
  "*":{class:MultiplyNode, inputs:["both","both"], properties:["const0","const1"]},
  "+":{class:AdditionNode, inputs:["both","both"], properties:["const0","const1"]},
  "scale":{class:ScaleNode, inputs:["both","control","control","control","control"], properties:["inLow","inHigh","outLow","outHigh"]},
  "gate":{class:GateNode, inputs:["both","both"],properties:["on"]},
  "metro":{class:MetroNode, inputs:["control"],properties:["time"]},
  "mtof":{class:MTOFNode, inputs:["both"],properties:[]},
  "ftom":{class:FTOMNode, inputs:["both"],properties:[]},
  "clip":{class:ClipNode, inputs:["both","both","both"],properties:["low","high"]},

  "delay":{class:DelayerNode, inputs:["signal", "both"],properties:[]},
  "fourier":{class:FourierNode, inputs:["signal"],properties:[]},


  "send":{class:SendNode, inputs:["both"],properties:[]},
  "receive":{class:ReceiveNode, inputs:[],properties:[]},

  "keyboard":{class:KeyboardNode, inputs:[], properties:[]},
  "trackpad":{class:TrackpadNode, inputs:[], properties:[]},
  "vslider":{class:VerticalSliderNode, inputs:[], properties:[]},
  "hslider":{class:HorizontalSliderNode, inputs:[], properties:[]},
  "knob":{class:KnobNode, inputs:[], properties:[]},

  "pack":{class:PackNode, inputs:["control","control","control","control","control","control"], properties:[]},
  "unpack":{class:UnpackNode, inputs:["control","control","control","control","control","control"], properties:[]}
}
class Patch {
  constructor() {
    this.count = 0
  }
  add(node) {
    this[this.count] = node
    node.id = this.count
    this.count++
  }
  replace(node, newNode) {
    this.delete(node)
    this[node.id] = newNode
    newNode.id = node.id
  }
  delete(node) {
    for (var i = 0; i < node.inputs.length; i++) {
      while(node.inputs[i].connections.length) {
        node.inputs[i].disconnect(node.inputs[i].connections[0])
      }
    }
    for (var i = 0; i < node.outputs.length; i++) {
      while(node.outputs[i].connections.length) {
        node.outputs[i].connections[0].disconnect(node.outputs[i])
      }
    }

    this[node.id] = undefined
  }
}

function container(p) {

  p.createNode = function (text, x, y) {

    var split = text.split(" ")
    var node;

    if (schemas[split[0]]) {
      var s = schemas[split[0]]
      
      try {
        node = new s.class(myAudioContext, x, y, s.inputs, split.slice(1), p.blocks)
      } catch {
         node = new VisualNode(myAudioContext, x, y)
      }
      node.text = text
    } else {
      node = new VisualNode(myAudioContext, x, y)
      node.text = text
    }
    return node
  }

  p.evaluateNode = function(node) {

    // create new node from tet using schema and salvaging inputs/outputs from node
    // delete node from the path
    // add newly created node at same location
    var nodeId = node.is
    var text = node.text
    var split = text.split(" ")
    var replacement;
    if (schemas[split[0]]) {
      var s = schemas[split[0]]
      var inputs = []
      for (var i = 0; i < node.inputs.length && i < s.inputs.length; i++) {
        if (s.inputs[i] == "both"&&node.inputs[i].connections.length) {
          inputs.push(node.inputs[i].getType())
        } else { 
          inputs.push(s.inputs[i])
        }
      }
      for (var i = node.inputs.length; i < s.inputs.length; i++) {
        inputs.push(s.inputs[i])
      }
      node.dead = true
      try {
        replacement = new s.class(myAudioContext, node.x, node.y, inputs, split.slice(1), p.blocks)
        for(var i = 0; i < node.inputs.length && i < replacement.inputs.length; i++) {
          for(var j = 0; !node.isReceive && !replacement.isReceive && j < node.inputs[i].connections.length;j++) {
            replacement.inputs[i].connect(node.inputs[i].connections[j])
          }
        }
        for(var i = 0; i < node.outputs.length && i < replacement.outputs.length; i++) {
          for(var j = 0; j < node.outputs[i].connections.length;j++) {
            node.outputs[i].connections[j].connect(replacement.outputs[i])
          }
        }
      } catch {
         replacement = new VisualNode(myAudioContext, node.x, node.y)
      }
      replacement.text = node.text
      p.blocks.replace(node,replacement)
      //p.blocks.add(replacement)
      //console.log(inputs)
    } else {
      node.dead = true
      replacement = new VisualNode(myAudioContext, node.x, node.y)
      replacement.text = node.text
      p.blocks.replace(node,replacement)
    }

    if (replacement.isSend) {
      for (var i = 0; i < p.blocks.count; i++) {
        if (!p.blocks[i]) continue
        if (p.blocks[i].isReceive && p.blocks[i].sendId == replacement.sendId) p.evaluateNode(p.blocks[i])
      }
    }

    /*if (replacement.actualNode && replacement.actualNode.start) {
      replacement.actualNode.start()
    }*/

  }

  p.setMode = function(mode) {
    p.mode = mode
    if (mode == "play") {"e"
      for (var i = 0; i < p.blocks.count; i++) {
        if (!p.blocks[i]) continue

        if (p.blocks[i].actualNode && p.blocks[i].actualNode.start){
          try{
            p.blocks[i].actualNode.start() 
          } catch {}       
        }
      }

      for (var i = 0; i < p.blocks.count; i++) {
        if (!p.blocks[i]) continue

        if (p.blocks[i].isDac){
          p.blocks[i].actualNode.gain.linearRampToValueAtTime(1, myAudioContext.currentTime+0.1)    
        }
      }
    } else if (mode == "edit") {
      
      for (var i = 0; i < p.blocks.count; i++) {
        if (!p.blocks[i]) continue

        if (p.blocks[i].isDac){
          p.blocks[i].actualNode.gain.linearRampToValueAtTime(0, myAudioContext.currentTime+0.1)    
        }
      }
    }
  }
  p.paste = function() {
    var offset = 0;
    outer:
    while(true) {
      var over = true
      for (i in p.copy) {
        if (i=="connections") continue
        if(p.blocks[parseInt(i)+offset]) {
          over = false
          break
        }
      }
      if (over) {
        break
      } else {
        offset++ 
      }
    }
    var nodes = []
    // create nodes and add them
    for (i in p.copy) {
      if (i=="connections") continue
        i = parseInt(i)
        var node = p.createNode(p.copy[i][0], p.copy[i][1], p.copy[i][2])
        p.blocks[i+offset] = node
        node.id = i+offset

        nodes.push(nodes)
        p.blocks.count = p.max(i+offset+1, p.blocks.count)

        for (var j = 0; j < node.inputs.length; j++) {
          node.inputs[j].type = p.copy[i][3][j]
        }
        for (var j = 0; j < node.outputs.length; j++) {
          node.outputs[j].type = p.copy[i][4][j]
        }
    }
    // connections
    for (i in p.copy.connections) {
      var c = p.copy.connections[i]
      p.blocks[offset+c[0]].inputs[c[1]].connect(p.blocks[offset+c[2]].outputs[c[3]])
    }
  }
  p.presetup = function () {
    p.blocks = new Patch()
    p.selected = undefined
    p.connecting = undefined
    p.dragging = []
    p.startingDrag = undefined
    p.isDragging = false
    p.mouseDown = false

  }
  p.setup = function () {
    p.presetup()
    p.createCanvas(800, 400);
    p.setMode("edit")
    
    
    if (p.copy) p.paste(p.copy)
  }

  p.draw = function () {
    p.background(255);


    p.deleteLine = undefined
    for (var i = p.blocks.count-1; i >= 0; i--) {
      if (!p.blocks[i]) continue

      p.blocks[i].draw(p)
      for (var j = 0; !p.blocks[i].isReceive && j < p.blocks[i].inputs.length; j++) {
        for (var k = 0; k < p.blocks[i].inputs[j].connections.length;k++) {
          p.strokeWeight(2)

          switch(p.blocks[i].inputs[j].getType()) {
            case "signal":
            p.stroke(180,0,0)
            break;
            case "control":
            p.stroke(0,180,0)
            break;
            case "both":
            p.stroke(200,200,200)
            break
          }
          if (p.mode == "edit") {
            if (!p.deleteLine) {
              var input = p.blocks[i].inputs[j]
              var output = p.blocks[i].inputs[j].connections[k]

              var slope = (input.y-output.y)/(input.x-output.x)
              var b = input.y - input.x*slope

              if (slope==NaN || slope == Infinity || slope == -Infinity) {
                if (p.mouseX > input.x-2.5 && p.mouseX<input.x+2.5 && p.mouseY > p.min(input.y,output.y) && p.mouseY < p.max(input.y, output.y) ) {
                  p.deleteLine = [input,output]
                  p.stroke(0,0,180)
                }
              } else {
                if (p.mouseY > p.min(input.y,output.y) && p.mouseY < p.max(input.y, output.y)) {
                  if (p.abs(p.mouseX*slope+b - p.mouseY)<2.5) {
                    p.deleteLine = [input,output]
                    p.stroke(0,0,180)
                  }
                }
              }
            }  
          }
          
          p.line(p.blocks[i].inputs[j].x, p.blocks[i].inputs[j].y,
                 p.blocks[i].inputs[j].connections[k].x, p.blocks[i].inputs[j].connections[k].y)
        }  
      }
    }

    if (p.startingDrag) {
      p.fill(0,255,0,50)
      p.rect(p.min(p.startingDrag[0],p.mouseX), p.min(p.startingDrag[1],p.mouseY), p.abs(p.startingDrag[0]-p.mouseX), p.abs(p.startingDrag[1]-p.mouseY))
    }
    if (p.connecting) {
      switch(p.connecting.getType()) {
        case "signal":
        p.stroke(180,0,0)
        break;
        case "control":
        p.stroke(0,180,0)
        break;
        case "both":
        p.stroke(200,200,200)
        break
      }
      p.strokeWeight(2)
      p.line(p.connecting.x, p.connecting.y, p.mouseX, p.mouseY)
    }

  }

  p.mousePressed = function() {
    p.mouseDown = true

    outer:
    for (var i = 0; i < p.blocks.count; i++) {
      if (!p.blocks[i]) continue
      if (p.mode == "edit") {
        if (p.blocks[i].containsPoint(p.mouseX, p.mouseY)) {
          var b = p.blocks[i]
          if (b.dragging) {
            p.isDragging = true
            break
          } else {
            p.selected = b
            p.selectedLoc = [p.mouseX, p.mouseY]
            p.selected.selected = true
            break
          }
        }
        for(var j = 0; !p.blocks[i].isSend && j < p.blocks[i].outputs.length; j++) {
          var out = p.blocks[i].outputs[j]
          if (rectContainsPoint(out.x-3, out.y-15,6,15,p.mouseX,p.mouseY)) {
            p.connecting = out
            break outer
          }
        }
      } else if (p.mode=="play") {
        if (p.blocks[i].containsPoint(p.mouseX, p.mouseY)) {
          p.blocks[i].onMousePressed(p)
        }
      }
    }

    if (p.mode == "edit" && !p.isDragging && !p.selected && !p.connecting) p.startingDrag = [p.mouseX,p.mouseY]

  }
  p.mouseReleased = function () {
    p.mouseDown = false

    if (p.mode == "edit") {
      if (p.deleteLine) {
        p.deleteLine[0].disconnect(p.deleteLine[1])
        p.evaluateNode(p.deleteLine[0].node)
        p.deleteLine = undefined
      }

      if (p.editing) {
        if (!p.editing.containsPoint(p.mouseX,p.mouseY)) {
          p.evaluateNode(p.editing)
          p.editing.editing = undefined
          p.editing = undefined
        }
      }

      if (p.selected) {
        if (p.selected.editable && p.selectedLoc[0] == p.mouseX && p.selectedLoc[1] == p.mouseY) {
          p.editing = p.selected
          p.editing.editing = true
        }      
        p.selected.selected = false
        p.selected = undefined
        p.selectedLoc = undefined
      }

      /**/
      if (p.isDragging) {
        p.isDragging = false
      } else {
        for (var i = 0; i < p.dragging.length; i++) {
          p.dragging[i].dragging = false
        }
        p.dragging = []
      }

      if (p.startingDrag) {
        for (var i = 0; i < p.blocks.count; i++) {
          if (!p.blocks[i]) continue
          if (p.blocks[i].inRect(p.min(p.startingDrag[0],p.mouseX), p.min(p.startingDrag[1],p.mouseY), p.max(p.startingDrag[0],p.mouseX), p.max(p.startingDrag[1],p.mouseY))) {
            p.blocks[i].dragging = true
            p.dragging.push(p.blocks[i])
          }
        }
        p.startingDrag = undefined
      }
      if (p.connecting) {
        var node
        outer:
        for (var i = 0; i < p.blocks.count; i++) {
          if (!p.blocks[i] || p.blocks[i].isReceive) continue
          for(var j = 0; j < p.blocks[i].inputs.length; j++) {
            var inp = p.blocks[i].inputs[j]
            if (rectContainsPoint(inp.x-3, inp.y,6,15,p.mouseX,p.mouseY)) {
              inp.connect(p.connecting)
              node = inp.node
              p.connecting = undefined
              break outer
            }
          }
        }
        p.connecting = undefined
        if(node) {
          p.evaluateNode(node)
        }

      }

      if(p.keyIsDown(p.CONTROL)) {
        p.blocks.add(new VisualNode(myAudioContext, p.mouseX, p.mouseY))
      }
    } else if (p.mode == "play") {
      for (var i = 0; i < p.blocks.count; i++) {
        if (!p.blocks[i]) continue
        if (p.blocks[i].active || p.blocks[i].containsPoint(p.mouseX, p.mouseY)) {
          p.blocks[i].onMouseReleased(p)
        }
      }
    }
  }
  p.mouseDragged = function() {
    if (p.mode  == "edit") {
      if (p.isDragging) {
        for (var i = 0; i < p.dragging.length; i++) {
        p.dragging[i].x += p.mouseX - p.pmouseX
        p.dragging[i].y += p.mouseY - p.pmouseY
        }
      }

      if (p.selected) {
        p.selected.x += p.mouseX - p.pmouseX
        p.selected.y += p.mouseY - p.pmouseY
      }    
    } else if (p.mode == "play") {
      for (var i = 0; i < p.blocks.count; i++) {
        if (!p.blocks[i]) continue
        if (p.blocks[i].active || p.blocks[i].containsPoint(p.mouseX, p.mouseY)) {
          p.blocks[i].onMouseDragged(p)
        }
      }
    }
  }

  p.keyPressed = function() {
    if (p.editing && p.keyCode == p.BACKSPACE) {
      p.editing.text = p.editing.text.slice(0,p.editing.text.length-1)
    }
    if (p.editing && p.keyCode == p.ENTER) {
      p.evaluateNode(p.editing)
      p.editing.editing = undefined
      p.editing = undefined
    }
    if (p.dragging && p.keyCode == p.DELETE) {
      for (var i = 0; i < p.dragging.length; i++) {
        p.blocks.delete(p.dragging[i])
      }
      p.dragging = []
      p.isDragging = false
    }
    if ((p.key == "c" || p.key == "C") && p.mode == "edit" && p.keyIsDown(p.CONTROL) && p.dragging) {
      var res = {}
      res.connections = []
      for (var i = 0; i < p.dragging.length; i++) {
        var inputs = []
        var outputs = []
        for (var j = 0; j < p.dragging[i].inputs.length; j++) {
          inputs.push( p.dragging[i].inputs[j].getType())
          for (var k = 0; k < p.dragging[i].inputs[j].connections.length; k++) {
            if (!p.dragging[i].isReceive && p.dragging.indexOf(p.dragging[i].inputs[j].connections[k].node) != -1) {
              res.connections.push([p.dragging[i].id, j, p.dragging[i].inputs[j].connections[k].node.id, p.dragging[i].inputs[j].connections[k].index])
            }
          }  
        }
        for (var j = 0; j < p.dragging[i].outputs.length; j++) {
          outputs.push( p.dragging[i].outputs[j].getType())
        }

        res[p.dragging[i].id] = [p.dragging[i].text, p.dragging[i].x + 10, p.dragging[i].y + 10, inputs, outputs]
      }
      p.copy = res
    }
    if ((p.key == "v" || p.key == "V") && p.mode == "edit" && p.keyIsDown(p.CONTROL) && p.copy) { 
      p.paste(p.copy)
    }
    if ((p.key == "a" || p.key == "A") && p.mode == "edit" && p.keyIsDown(p.CONTROL) && p.copy) { 
      for (var i = 0; i < p.blocks.count; i++) {
        if (!p.blocks[i]) 
          continue
        if (p.dragging.indexOf(p.blocks[i])==-1) {
          p.blocks[i].dragging = true
          p.dragging.push(p.blocks[i])
        }
      }
    }
  }

  p.keyTyped = function() {
    if (p.editing) {
      p.editing.text += p.key
    }
  }

}










// use the onscreen button to start and stop something
function buttonClick(i) {
    var p = containers[i]
	if (p.mode == "play") {
		p.setMode("edit")
		document.getElementById("play-edit-button-"+i).innerHTML = "Play"
	}
	else {
		p.setMode("play")
		document.getElementById("play-edit-button-"+i).innerHTML = "Edit"
	}
}
var containers = []
var patches = ['{"9":["osc",83,62,["both"],["signal"]],"10":["metro 1000",142,64,["control"],["control"]],"11":["gate",119,147,["signal","control"],["signal"]],"12":["* 0.1",124,214,["signal","both"],["signal"]],"13":["dac",131,277,["signal"],[]],"connections":[[11,0,9,0],[11,1,10,0],[12,0,11,0],[13,0,12,0]]}'
              ,'{"11":["osc",88,70,["both"],["signal"]],"12":["* 0.01",87,136,["both","both"],["both"]],"13":["dac",97,201,["signal"],[]],"control","control","control"],["both"]],"connections":[]}']

var myAudioContext = new AudioContext();
myAudioContext.output = myAudioContext.createGain()
myAudioContext.output.connect(myAudioContext.destination)

myAudioContext.audioWorklet.addModule('/blog_scripts/apollo/custom-processors.js').then(()=>{

    var i = 0
    var e
    
    while((e = document.getElementById("canvas-container-"+i)) && patches[i]) {
        var canvas = new p5(container, e)
        
        var button = "<button class='reset-button' onclick='buttonClick("+i+")' id='play-edit-button-"+i+"'>Play</button>"
        
        e.innerHTML += button

        containers.push(canvas)
        if (patches[i]) {
            canvas.copy = JSON.parse(patches[i])
        }
        
        

        i++
    }
})
