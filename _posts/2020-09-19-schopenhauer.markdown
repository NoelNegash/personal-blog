---
layout: post
title:  Schopenhauer & Object Oriented Programming
author: Noel Alemayehu
date:   2020-09-19 14:04:21 +0300
image: "/assets/blog_images/post_covers/schopenhauer-cover.jpg"
categories: schopenhauer programming
description: How a 19th century crank (possibly) anticipated Java
published: true
--- 
<style> {% include /css/style.css %} </style>
<script src="https://code.jquery.com/jquery-3.7.0.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js"></script>
<script src="/assets/blog_scripts/schopenhauer_article.js"></script>


2020 has been a wild ride to say the least. January alone started with a million Hong Kong protesters on a New Year's Day march, the Australian bush catching fire(ironic considering UN declared it the International Year of Plant Health), the assassination of an Iranian major general by a US drone, prompting speculations about a new war, and if that wasn't enough, COVID-19 came along, as of now with 28.8 million infections, 900k+ dead, mass lockdowns, and the largest economic recession since the Great Depression. Honestly, so much bad stuff has happened this year that just writing it would probably trigger someone's PTSD. Instead I leave you with this [only slightly depressing recap](https://www.boredpanda.com/2020-year-recap) & video. After all, images are worth a thousand words.

<div class="flex-container"> <iframe width="877" height="493" src="https://www.youtube.com/embed/NLL7ZXXL7zc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe></div>

Maybe prompted by this confusion at the state of the world, I have been thinking a lot about philosophy these days. Out of the many people to write on the subject, there is one that feels somewhat fitting for our situation, Arthur Schopenhauer.

A notoriously pessimistic philosopher, Schopenhauer formed his system of thought from the teachings of Plato, Kant and the Indian Upanishads. He drew from the first two the idea that what we experience as the world is not actual reality and supplemented it with Indian concept of Maya, a veil that hides the true nature of the world from us. His idea of the world as will and representation is a metaphysical system that considers Plato's "Ideas" and Kant's "things-in-themselves" to be the same thing, an underlying structure to existence that we cannot see directly, but rather only their representations. But his idea of the will took it one step further. He said there was only one will, an undivided entity that drove all things in the universe through ceaseless striving towards its goal. The laws of physics, the movements of animals and the consciousness of human beings are all the same will manifesting itself in different gradations of development. It drives everything from gravitational to sexual attraction. You can see why this metaphysical system appealed to many thinkers that came after him, such as the philosophers Wittgenstein and Nietzsche, the scientists Schrodinger and Einstein, and the psycho-analysts Freud and Jung. 

He was also strongly influenced by Buddhist thought, claiming that all human suffering came from attachment to desires. To Schopenhauer, desire was pain that persisted until it was satisfied. Satisfaction itself was simply the neutral lack of desire as opposed to a positive value such as joy. In essence, Schopenhauer thought that life spent in pursuit of desire was constant pain, with only short periods of boredom as reprieve, a negative-sum game. Another striking idea of his is that we live in the worst possible *sustainable* world. To Schopenhauer, the world we live in could be worse, but if that was the case, it would be so unstable it would fall into chaos. In the context of 2020, I think we can understand what he meant.

His ideas on aesthetics led him to be called the artist's philosopher because they were a source of inspiration to many composers and authors. In Schopenhauer's philosophy, the only tenable way to achieve happiness is through asceticism. Only by renouncing worldly desires and trying to understand the will itself can you transcend the cycle of pain and boredom. One of the ways he suggested it was through art. He considered art an effort to capture and express the true essence of its subject, bypassing representation and getting closer to the will. He even said music was will itself, drawing parallels between the strivings of desire and the motions of a melody.

In the end though, he was a bitter man, with strained relationships in his familial, social and professional circles. His relationship with his mother, who in his lifetime was a more successful writer and was usually in the company of admired contemporaries such as J. W. von Goethe, whom Schopenhauer considered a hero, was not the best. Even when he managed to gain the admiration of Goethe, he almost immediately ruined it by publishing a treatise on color theory, the same subject that they discussed with each other, that differed in many points to Goethe's. That, along with his headstrong and self-assured attitude, led Goethe to distance himself from Schopenhauer. Even in academics, he wasn't very popular. At one point, when he was appointed to an academic position in the University of Berlin, he scheduled his lectures to be at the same time as his intellectual nemesis, G. W. F. Hegel. Almost no one attended and he left the post two years later. His mother said it best in a letter she sent him

> "You are unbearable and burdensome, and very hard to live with; all your good qualities are overshadowed by your conceit, and made useless to the world simply because you cannot restrain your propensity to pick holes in other people."

As compelling as his pessimism is, especially in 2020, over the past couple of days I was more interested in his metaphysical system of will and representation, specifically how similar it sounded to Object Oriented Programming. OOP is a computer programming model that puts emphasis on data in a program, as opposed to operations. For example, let's say you wanted to make a car racing game. If you were to make that game using OOP standards, you would create a "class" called Car. A class is essentially an abstract schematic of what you want every car to be. It would describe the data necessary to create any model of car, such as its manufacturer and horsepower, as well as its functions, such as acceleration, steering and braking. After defining a class, all you would need to do is say `new Car()`, and pass in the necessary information to get a Car object. This structure is useful to avoid redundancy and points of failure in a program, as well as improving readability. But it is also eerily similar to Schopenhauer-ian thought. The class could be the will and all the objects you create from it could be manifestations, or representations, of that will. In a more visual example, consider the two boxes below. The first is the world as representation. It could be a game, the visual rendering of the will, or your perception of reality. The second is the world as will. It is the code of the game or the will of the universe you live in. The circle in the center is the subject and you can "simulate" its will by dragging and releasing it.

<div class="flex-container">
{% highlight javascript linenos %}
class Circle {
    constructor(x,y) {
        this.position = [x,y]
        this.velocity = [0,0]
    }
    update() {
        this.position[0] += this.velocity[0]
        this.position[1] += this.velocity[1]
        if (this.hitsUniverseBoundary())
            this.bounceOff()
    }
}

var universe = []
universe.push(new Circle(200,200))
{% endhighlight %}
<div id="canvas-container-0"></div>
</div>

That circle must be filled with existential dread from being alone in such a small universe. Let's give him a friend. Notice that they are both subject to the same "will" despite being individual objects with different starting positions. If we make the will dictate how they handle interactions with each other, we will see similar behavior from both.

<div class="flex-container">
<div>
{% highlight javascript linenos %} 
    class Circle{
        constructor(x,y) {
            this.position = [x,y]
            this.velocity = [0,0]
        }
        update() {
            this.position[0] += this.velocity[0]
            this.position[1] += this.velocity[1]
            if (this.hitsUniverseBoundary())
                this.bounceOff()
            // added this clause
            if (this.hitsOtherCircle()) {
                this.bounceOff()
                this.glow()
            }
        }
    }

    var universe = []
    universe.push(new Circle(100,200))
    universe.push(new Circle(300,200))
{% endhighlight %}
</div>
<div id="canvas-container-1"></div>
</div>

Another useful aspect of OOP is inheritance. Inheritance is an idea that since different objects can have many attributes and functions in common, we can create a class that contains them, and limit the classes of the objects themselves to describe only the specific differences, saving us from lots of redundancy. Again, eerily similar to the concept of the will coming in gradations. We can apply both to humans and animals. Humans, for all practical purposes, are animals. We eat, sleep, propagate and react to our environment in ways that let us do so for longer. But we also have the capacity for intelligent thought. In OOP terms, we are an Animal class with the added function of intelligence, and in Schopenhauer-ian thinking, we are a manifestation of the will one level above animal that overrides some basic strivings with more complex behavior that is nonetheless subservient to the will.

In the code below, we have created a hierarchy of will that starts with the class Circle from above, which Animal "inherits" or "extends" from, by adding the properties of lifespan and the function of reproduction, which in turn is extended by the Human class, with the property of "intelligence", a somewhat weak aversion to being moved by irrationality, in this case dragging and releasing. Humans also have a desire to chase animals (using the same formula as gravitational force) and deal them damage on collision. A bit crude, but it does serve as a good illustration of how intelligence doesn't necessarily mean defying the will or being above it. It is simply a higher level of the hierarchy. You can even control how humans move by dragging an animal around their vicinity. Don't get them too close though; you might end up creating a gravitational singularity that sends the universe into utter chaos. Just saying.

<div class="flex-container">
<div>
{% highlight javascript linenos %} 
    class Animal extends Circle {
        constructor(x, y) {
            super(x,y)
            this.life = 50
        }
        update() {
            super.update()
            if(this.isAtHalfLife())
                this.reproduce()
        }
    }
    class Human extends Animal {
        constructor(x, y) {
            super(x,y)
            this.life = 100
        }
        update() {
            super.update()
            this.chaseAnimals()
            if(this.hitsAnimal())
                this.hurtAnimal()
        }
    }

    var universe = []
    universe.push(new Animal(100,200))
    universe.push(new Human(300,200))
{% endhighlight %}
</div>
<div id="canvas-container-2"></div>
</div>

You can see the "worst possible sustainable world" idea here as well. If animals couldn't propagate, or were killed before they did, they would be wiped out in a minute and we'd be back to the cold, lonely and empty universe. But when we ensure there is always an animal alive in the code(it's no Fibonacci, but it works), we allow the cycle to go on indefinitely, creating Schopenhauer's universe.

<div class="flex-container"><div id="canvas-container-3"></div></div>

There are a lot more comparisons I can make, from public and private variables to abstraction and polymorphism. I could probably write a whole essay on the analogues between death and garbage collection, but I digress. A more interesting take is that Schopenhauer isn't necessarily similar to OOP, but simulation theory in general. Sure enough, a short google search of "Schopenhauer simulation" gives a short quote to the same effect in [this really good article](https://www.thesmartset.com/schopenhauer-for-millennials/). I also found a whole paper called [The World as Will and the Matrix as Representation](https://download.uni-mainz.de/fb05-philosophie-schopenhauer/files/2020/01/2006_Segala.pdf) which explores the same ideas through the characters and events of the classic 1999 movie. While it's not a lot of sources, it's fun to see other people have made the same connection.

So instead, let's stick to philosophy and try to make sense of this world. The first and foremost problem is free will. How can an individual have it if will itself is an unchanging entity that lies on a cosmic scale? When you talk, are you saying what you think or what you are told to say? Probably the latter.

Even doing the opposite of what the will tells you is a weak freedom at best, because it is simply another form of subservience. Rejection of the will and existing independently of it are two completely different things. In the words of the great Albert Einstein:

> “Man can do what he wills, but cannot will what he wills.”

Or can we? This is just random speculation on my part, but what if will isn't constant? There is no sufficient reason to say it is. I mean, sure the universe we live in has probably been operating under the same rules since before the Big Bang. But maybe that's because it hasn't reached a level of complexity where the will begins to change itself. What if the more we understand the will, be it through art, spirituality or science, the closer we get to changing it? After all, if someone feels a desire to change the will and their desires are decided by that same will, doesn't that imply a process of self-induced change?

If this theory sounds too idealistic, let's look at it in programming terms. Can an object change its own source code, its class? Can we make a meta-program that can edit itself? Impossible, right? Well, maybe for some languages, but there are entire families out there with explicit support for it, like Lisp, one of the first programming languages used for artificial intelligence research. Coincidence? I think not.

We don't even need to go to such an obscure language for meta-programming support. Right here in your browser, we have JavaScript. It is the same language that's running the buttons and the simulations. And it has two properties which make it very easy to simulate meta-programming, the `eval` function and `prototype` object. `eval` lets you run any text you want as code and `prototype` is basically the class itself laid bare for you to mess around with. Using these two, we can let our humans change the entire universe.

First, let's get rid of the animals; there has been enough suffering. Note that we leave the class in the code because it is a dependency for human existence. I will leave it up to you to think about the implications. Secondly, let's simulate total ignorance on the part of humans, at least initially. They will bumble around the world like hapless idiots until they interact with each other. These interactions can be communication, meditation or research, at which point the human's "mage level" will increase, unlocking secret runes and spells that can twist the world the way they see fit. These spells which will also be triggered randomly when mages bump into each other. In the box below, we have levels 0 to 4, with powers that go from the gory conjuring of blood to the phantasmagorical changing of the sky. Be warned, the arcane magic they discover could trigger epilepsy.

<div class="flex-container">
<div>
{% highlight javascript linenos %} 
    var spells = [
        "spewBlood()",
        "Mage.prototype.size = randomNumber(20,40)",
        "Mage.prototype.color = randomColor()",
        "Universe.prototype.gravity = !Universe.prototype.gravity",
        "Universe.prototype.background = randomColor()"
    ]
    class Mage extends Human {
        constructor(x,y) {
            super(x,y)
            this.mageLevel = 0
        }
        update() {
            if(this.hitMage()) {
                if(this.mageLevel == 4 and Math.random() > 0.3)
                    this.mageLevel++
                else if (Math.random() > 0.3)
                    eval(spells[floor(random(this.mageLevel))])
            }
        }
    }
{% endhighlight %}
</div>
<div id="canvas-container-4"></div>
</div>

Isn't that amazing? This is where Schopenhauer and I part ways. Far from being a pessimist, I believe that we are destined for great things. We will will the will (say that three times fast) through our desire to better ourselves, and in doing so, change this negative-sum world into a positive one. If Schopenhauer bumped into you on the street, he would check his pockets, then try to dissuade you from suing. I would apologize and give you a wink.

How would you like to be a Level 5 Mage?

<script> 
    jQuery(".reset-button").click((e) => {
        e.target.innerHTML = "Reset"
        console.log(e.target)
    })
    var i = 0
    var e
    var containers = []
    while((e = document.getElementById("canvas-container-"+i)) && window['container'+i]) {
        var canvas = new p5(window['container'+i], e)
        containers.push(canvas)
        i++
    }
</script>