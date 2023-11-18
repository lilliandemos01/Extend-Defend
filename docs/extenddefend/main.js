title = "EXTEND DEFEND";

description = '[HOLD] EXTEND';

characters = [];

const GAME = {
    WIDTH: 100,
    HEIGHT: 100
}

options = {
    viewSize: {x: GAME.WIDTH, y: GAME.HEIGHT}
};

/**
 * @typedef {{
 * pos: Vector,
 * length: number,
 * angle: number,
 * extend: boolean
 * }} Extender
 */

/**
 * @type {Extender}
 */
let extender;

/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */

/**
 * @type {Enemy[]}
 */
let enemies = [];


const extenderLength = 12;
let angleRate = PI / 60;
const enemySpeed = 0.25;
let enemyNumber; 

function update() {
    if (!ticks) {
        extender = {pos: vec(GAME.WIDTH / 2, GAME.HEIGHT - 2),
                    length: extenderLength,
                    angle: -PI / 2,
                    extend: false};

        enemies = [];
    }

    if (input.isJustPressed && extender.length == extenderLength) {
        play("laser");
        extender.extend = true;
    }

    if(input.isPressed && extender.extend) {
        extender.length += 1.5;
    }
    else if(extender.length > extenderLength) {
        extender.extend = false;
        extender.length -= 1.5;
    }
    else if(extender.length == extenderLength) {
        extender.angle += angleRate;
        if(extender.angle > 0 || extender.angle < -PI)
            angleRate = -angleRate;
    }

    if(ticks % 180 == 0) {
        enemyNumber = rndi(1, 5);
        let posX = rnd(0, GAME.WIDTH);
        let posY = 0;
        times(enemyNumber, () => {
            enemies.push({pos: vec(posX, posY)});
            posY-= 5;
        })
    }

    color("black");
    line(extender.pos, vec(extender.pos).addWithAngle(extender.angle, extender.length));

    remove(enemies, (e) => {
        e.pos.y += enemySpeed;
        color("red");
        box(e.pos, 4);

        if(e.pos.y > GAME.HEIGHT)
            end();

        if (extender.length != extenderLength && box(e.pos, 4).isColliding.rect.black) {
            play("explosion");
            addScore(10);
            return extender.length != extenderLength;
        }
    })
}