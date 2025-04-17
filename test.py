from turtle import *
import random

class Block(Turtle):
    def __init__(self, x, y):
        super().__init__()
        self.shape("square")
        self.shapesize(1, 2)
        self.hit_count = 0
        shades_of_gray = ["grey", "darkgrey", "silver", "lightgrey", "dimgrey"]
        self.color(random.choice(shades_of_gray))
        self.penup()
        self.goto(x, y)

    def strike(self):
        self.hit_count += 1
        if self.hit_count < 3:
            self.color(["grey", "orange", "red"][self.hit_count])
        if self.hit_count >= 3:
            self.delete()

    def delete(self):
        self.ht()  

class Player(Turtle):
    def __init__(self, color, x, screen, left_key, right_key, fire):
        super().__init__()
        self.ht()
        self.speed(0)
        self.shape("turtle")
        self.color(color)
        self.penup()
        self.goto(x, -180)
        self.setheading(90)
        self.st()
        screen.onkeypress(self.turn_left, left_key)
        screen.onkeypress(self.turn_right, right_key)
        screen.onkeypress(self.fire, fire)
        self.bullets = []
        self.score = 0

    def turn_right(self):
        self.right(10)

    def turn_left(self):
        self.left(10)

    def fire(self):
        if len(self.bullets) < 5:
            bullet = Bullet(self)
            self.bullets.append(bullet)

    def update_bullets(self):
        bullets_to_remove = []
        for bullet in self.bullets:
            bullet.move()
            if bullet.out_of_bounds():
                bullet.delete()
                bullets_to_remove.append(bullet)
            else:
                for block in blocks:
                    if bullet.distance(block) < 20:
                        block.strike()
                        bullet.delete()
                        bullets_to_remove.append(bullet)
                        self.score += 1
        for bullet in bullets_to_remove:
            if bullet in self.bullets:
                self.bullets.remove(bullet)

class Bullet(Turtle):
    def __init__(self, player):
        super().__init__()
        self.ht()
        self.shape("circle")
        self.color("yellow")
        self.shapesize(0.5, 0.5, 0.5)
        self.penup()
        self.goto(player.xcor(), player.ycor())
        self.setheading(player.heading())
        self.forward(20)
        self.speed(2)
        self.st()

    def move(self):
        self.forward(10)
        if self.xcor() <= -110 or self.xcor() >= 110:
            self.setheading(180 - self.heading())

    def delete(self):
        self.hideturtle()
        self.goto(1000, 1000)

    def out_of_bounds(self):
        return self.ycor() > 250

class Score(Turtle):
    def __init__(self, player, x, y):
        super().__init__()
        self.player = player
        self.penup()
        self.goto(x, y)
        self.color("red")
        self.hideturtle()
        self.update_score()

    def update_score(self):
        self.clear()
        self.write(f"Score: {self.player.score}", align="center", font=("Arial", 16, "normal"))

def draw_border():
    p = Turtle()
    p.speed(0)
    p.ht()
    p.pu()
    p.width(10)
    p.color("white")
    p.goto(-110, 200)
    p.pendown()
    p.begin_fill()
    for i in range(2):
        p.forward(220)
        p.right(90)
        p.forward(400)
        p.right(90)
    p.end_fill()

screen = Screen()
screen.title("Shooting Gallery")
screen.bgcolor("black")
screen.tracer(3)

draw_border()

blocks = []
for i in range(3):
    for j in range(5):
        block = Block(-95 + j * 47.3, 195- i * 50)
        blocks.append(block)

p1 = Player("purple", 40, screen, "Left", "Right", "Up")
p2 = Player("black", -40, screen, "a", "d", "w")

score2 = Score(p2, -200, 170)
score1 = Score(p1, 200, 170)

def update():
    p1.update_bullets()
    p2.update_bullets()
    score1.update_score()
    score2.update_score()
    screen.ontimer(update, 100)

update()

screen.listen()
screen.mainloop()