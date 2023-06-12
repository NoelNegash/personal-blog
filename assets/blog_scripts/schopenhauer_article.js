function dist(x1,y1,x2,y2) {
  return Math.sqrt((x1-x2)**2+(y1-y2)**2)
}
function constrain(x, min, max) {
  if(x > max) return max
  if(x < min) return min
  return x
}
class Vector{
  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  add (v) {
  return new Vector(this.x+v.x, this.y+v.y);
  }
  sub (v) {
    return new Vector(this.x-v.x, this.y-v.y);
  }
  mult (x,y) {
    if (y == undefined)
      return new Vector(this.x*x, this.y*x)
    else
      return new Vector(this.x*x, this.y*y)
  }
  div (x,y) {
    if (y)
      return this.mult(1/x,1/y)
    else 
      return this.mult(1/x)
  }
  dot(v) {
    return this.x*v.x + this.y*v.y;
  }
  mag() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  clone() {
    return new Vector(this.x, this.y)
  }
  rotate (a) {
    return new Vector(this.x*cos(a)-this.y*sin(a), this.x*sin(a)+this.y*cos(a))
  }
}
class Circle {
  constructor (x = 0, y = 0, r = 50) {
    this.mass = 1
    this.moment = MOMENT_RATIO * Math.PI * (r**4) / 2
    this.radius = r
    
    this.pos = new Vector(x,y)
    this.vel = new Vector()
    
    this.ang = 0
    this.angVel = 0
    this.glow = 255
    this.glowSpeed = 10
    
    this.green = true
    this.col = [255,255,255]

    this.clearForces()
  }
  update(p) {
    this.glow = constrain(this.glow+this.glowSpeed,0,255)
  }
  draw(p) {

    p.stroke(0,0,0)
    p.push()
    p.translate(this.pos.x, this.pos.y)
    p.rotate(this.ang)
    p.fill(this.col[0],this.col[1], this.col[2])
    p.ellipse(0, 0, this.radius*2, this.radius*2);

    p.noStroke()
    if (this.green)
      p.fill(0, 255, 0, 255-this.glow)
    else
      p.fill(255, 0, 0, 255-this.glow)
    p.ellipse(0, 0, this.radius*2, this.radius*2);
    p.pop()
  }
  clearForces() {
    this.netForce = new Vector()
    this.torque = 0
  }
  applyForce(f,p) {
    if (!p) {
      this.netForce = this.netForce.add(f)
    } else {
      p = p.sub(this.pos)
      this.torque += p.rotate(Math.PI/2).dot(f)
      
      var rad = p.div(p.mag())
      
      this.netForce = this.netForce.add(rad.mult(f.dot(rad)))
    }
  }
  checkHitGround (p) {
    if (this.pos.y > p.height-this.radius || this.pos.y < this.radius) {
      this.pos.y = constrain(this.pos.y,this.radius,p.height-this.radius)
      this.vel = this.vel.mult(1,-1)
    }
    if (this.pos.x > p.width-this.radius || this.pos.x < this.radius) {
      this.pos.x = constrain(this.pos.x,this.radius,p.width-this.radius)
      this.vel = this.vel.mult(-1,1)
    }
  }
  hitsPoint(x,y) {
    return dist(x,y,this.pos.x, this.pos.y) < this.radius
  }
  hitsCircle (c) {
    return dist(c.pos.x, c.pos.y, this.pos.x, this.pos.y) < this.radius+c.radius
  }
  handleCollision(p,o) {
    this.glow=0
  }
}

function randomColor () {
  var colors = [[255,255,255], [255,200,200],[200,255,200],[200,200,255],[255,255,200],[200,255,255],[255,200,255]]
  return colors[Math.floor(Math.random()*colors.length)]
}

class Animal extends Circle {
  constructor(x,y,r=25) {
    super(x,y,r)
    this.green = false
    this.life = 50
    this.split = false
    this.isAnimal = true
  }
  update(p) {
    super.update(p)
    if (this.isAnimal) {
      if (this.life <= 25&& !this.split) {
        this.split = true
        var a = new Animal(this.pos.x, this.pos.y)
        a.ignore = true
        //a.vel = this.vel.mult(-1)
        //a.pos = a.pos.add(a.vel*5)
        p.objects.push(a)
      }
    }
  }
  handleCollision(p,o) {
    super.handleCollision(p,o)
    if (this.isAnimal) {
      if (o.isHuman) {
        this.life -= 5
        this.green = false
      } else {
        this.green = true
      }
    }
  }
  draw (p) {
    super.draw(p)
    p.textAlign(p.CENTER,p.CENTER)
    p.text(this.life, this.pos.x, this.pos.y)
  }
}

class Human extends Animal {
  constructor(x,y,r=40) {
    super(x,y,r)
    this.green = true
    this.life = 100
    this.split = false
    this.isAnimal = false
    this.isHuman = true
  }
  update(p) {
    super.update(p)
    if (this.vel.mag()==0)return
    var f = new Vector()
    for (var i = 0; i < p.objects.length; i++) {
      var o = p.objects[i]
      if (!o.isAnimal || o.ignore) continue
      var d = o.pos.sub(this.pos)
      if (d.mag() == 0) continue
      f = f.add(d.div(d.mag()**3))
    }
    this.applyForce(f.mult(6000))
  }
}
var spells = [
    "blood",
    "mageSize",
    "mageColor",
    "gravity",
    "uniColor"
]

class Mage extends Human {

  constructor(x,y) {
    super(x,y)
    this.life = this.mageLevel = 0
    this.isMage = true
  }

  handleCollision(p,o) {
    super.handleCollision(p,o)
    if (o.isMage) {
      if(this.mageLevel < 4 && Math.random() > 0.3) {
        this.mageLevel++
        this.life = this.mageLevel
      } else if (Math.random() > 0.3) {
        switch(spells[p.floor(p.random(this.mageLevel+1))]) {

          case "blood":
            var pos = this.pos.add(o.pos).div(2)
            p.ps.push(new ParticleSystem(pos.x,pos.y))
          break
          case "mageSize":
            var r = p.random(25,50)
            for (var i = 0; i < p.objects.length; i++) {
              if (p.objects[i].isMage)
                p.objects[i].radius = r
            }
          break
          case "mageColor":
            var col = randomColor();
            for (var i = 0; i < p.objects.length; i++) {
              if (p.objects[i].isMage)
                p.objects[i].col = col
            }
          break
          case "gravity":
            p.gravity = !p.gravity
          break;
          case "uniColor":
            p.back = randomColor()
          break;
        }
      }
    }
  }
}

class ParticleSystem {
  constructor(x,y,r=15) {
    this.ps = []
    this.vs = []
    this.ss = []
    this.life = 255
    for (var i = 0; i < 40; i++) {
      var a = Math.random()*2*Math.PI
      var v = Math.random()*1+2
      this.ss.push(3+Math.random()*3)
      this.ps.push([x+r*Math.cos(a), y+r*Math.sin(a)])
      this.vs.push([v*Math.cos(a), v*Math.sin(a)])
    }
  }
  update() {
    for (var i = 0; i < this.ps.length; i++) {
      this.ps[i][0] += this.vs[i][0]
      this.ps[i][1] += this.vs[i][1]
    }
    this.life -= 10
  }
  draw(p) {
    p.stroke(255,0,0, this.life)
    for (var i = 0; i < this.ps.length; i++) {
      p.strokeWeight(this.ss[i])
      p.point(this.ps[i][0], this.ps[i][1])
    }
  }
}

const MOMENT_RATIO = 0.01
var dt = 1/20

function container0(p) {
  p.presetup = function () {
    p.objects = []
    p.ps = []
    p.gravity = false
    p.back = [255,255,255]
  }
  p.setup = function () {
    p.presetup()
    p.createCanvas(400, 400);
    p.objects.push(new Circle(200,200,50))
  }

  p.draw = function () {
    p.background(p.back[0],p.back[1],p.back[2])
    
    p.stroke(0)
    p.strokeWeight(1)
    var splice = []
    for (var i = 0; i < p.objects.length; i++) {
      var o = p.objects[i]
      
      if (p.selected && p.selected[0] == o) continue
      o.update(p)

      if (o.life != undefined && !o.isMage && o.life <= 0) {
        splice.push(i)
      }

      if (o.ignore) {
        o.ignore = undefined
        for (var j = 0; j < p.objects.length; j++) {
          var o2 = p.objects[j]
          if (o == o2 || o2.ignore) continue
          if (o.hitsCircle(o2)) {
            o.ignore = true
            break
          }
        }
        if (o.ignore) continue
      }

      if (p.gravity) {
        o.applyForce(new Vector(0,10))
      }

      // collisions
      for (var j = 0; j < p.objects.length; j++) {
        if (i == j) continue
        var o2 = p.objects[j]

        if (p.selected && p.selected[0] == o2) continue 
        if (o2.ignore) continue
        
        if (o.hitsCircle(o2)) {
          var normal = o2.pos.sub(o.pos)
          normal = normal.div(normal.mag())
          
          var velAlongNormal = o2.vel.sub(o.vel).dot(normal)
          if (velAlongNormal > 0) continue
          
          var magnitude = -2*velAlongNormal
          magnitude /= (1/o.mass) + (1/o2.mass)
          
          var impulse = normal.mult(magnitude)
          
          o2.applyForce(impulse.div(dt))
          o2.handleCollision(p, o)
        }
      }
         
      
    }

    for (var i = splice.length-1; i >= 0; i--) {
      p.ps.push(new ParticleSystem(p.objects[splice[i]].pos.x, p.objects[splice[i]].pos.y))
      p.objects.splice(splice[i],1)
    }

    for (var i = 0; i < p.objects.length; i++) {
      var o = p.objects[i]
      
      if (!p.selected || p.selected[0] != o) {
        o.vel = o.vel.add(o.netForce.div(o.mass/dt))
        o.angVel += o.torque/o.moment
        
        o.pos = o.pos.add(o.vel)
        o.ang += o.angVel
        
        o.checkHitGround(p)
        o.clearForces();
      }
      p.objects[i].draw(p)
    }
    for (var i = p.ps.length-1; i >= 0; i--) {
      p.ps[i].update()
      p.ps[i].draw(p)
      if (p.ps[i].life <= 0) p.ps.splice(i,1)
    }
    
  }

  p.mousePressed = function() {
    if (p.mouseX < 0 || p.mouseX > p.width || p.y < 0 || p.y > p.height) 
      return

    for (var i = 0; i < p.objects.length; i++) {
      if (p.objects[i].hitsPoint(p.mouseX,p.mouseY)) {
        p.selected = [p.objects[i], p.objects[i].pos.x-p.mouseX, p.objects[i].pos.y-p.mouseY]
        p.vels = [new Vector(), new Vector(), new Vector()]
        break
      }
    }
  }
  p.mouseReleased = function () {
    if (p.mouseX < 0 || p.mouseX > p.width || p.y < 0 || p.y > p.height) 
      return
    if (p.selected) {
      p.selected[0].pos.x = p.mouseX+p.selected[1]
      p.selected[0].pos.y = p.mouseY+p.selected[2]
      p.selected[0].vel = (p.vels&& p.vels[0]) || new Vector()
      p.selected = undefined
    }
  }
  p.mouseDragged = function() {
    if (p.mouseX < 0 || p.mouseX > p.width || p.y < 0 || p.y > p.height) 
      return
    if (!p.vels) p.vels = [new Vector(), new Vector(), new Vector()]
    if (p.selected) {
      p.selected[0].pos.x = p.mouseX+p.selected[1]
      p.selected[0].pos.y = p.mouseY+p.selected[2]

      p.vels.splice(0,1)
      p.vels.push(new Vector(p.movedX, p.movedY).div(5))
    }
  }
}
function container1(p) {
  container0(p)
  p.setup = function () {
    p.presetup()

    p.createCanvas(400, 400);
    p.objects.push(new Circle(100,200,50))
    p.objects.push(new Circle(300,200,50))
  }
}
function container2(p) {
  container0(p)
  p.setup = function () {
    p.presetup()

    p.createCanvas(400, 400);
    p.objects.push(new Animal(100,200))
    p.objects.push(new Human(300,200))
  }
}
function container3(p) {
  container0(p)
  p.setup = function () {
    p.presetup()

    p.createCanvas(800, 400);
    for (var i = 0; i < 3; i++) {
      p.objects.push(new Human(p.random(800),p.random(400)))
    }
    for (var i = 0; i < 8; i++) {
      p.objects.push(new Animal(p.random(800),p.random(400)))
    }
  }
}
function container4(p) {
  container0(p)
  p.setup = function () {
    p.presetup()

    p.createCanvas(400, 400);
    for (var i = 0; i < 3; i++) {
      p.objects.push(new Mage(p.random(800),p.random(400)))
    }
  }
}