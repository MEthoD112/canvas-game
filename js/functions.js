'use strict';

// Class for all entities in the game except player
class Entity {
    constructor(x, y, sprite) {
        this.pos = [x, y];
        this.sprite = sprite;
    }
}

// Crossbrowser function requestAnimationFrame
const requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
              window.setTimeout(callback, 1000 / 60);
        };
})();

// The main game loop function
function main() {
    let now = Date.now();
    let frameGap = (now - lastTime) / 1000.0;

    update(frameGap);
    render();

    lastTime = now;

    requestAnimFrame(main);
}

// Function for adding event for one time
function addEventListenerOnce(target, type, handler) {
    target.addEventListener(type, function fn(event) {
        target.removeEventListener(type, fn);
        target.setAttribute('disabled', 'disabled');
        handler(event);
    });
}

// Class for adding sounds
class Sound {
	constructor(path) {
	    this.audio = new Audio();
	    this.audio.src = path;
	    this.audio.autoplay = true;
	}
}

// Function for adding entity
// koef argument is between [0, 1], shows how often entities will appear
// as koef closer to 1 as less entities will appear
function addEntity(entitiesStorage, koef, sprite) {
    if (Math.random() < 1 - koef ** gameTime) {

    entitiesStorage.push(new Entity(canvas.width + positionBackground,
    						 		Math.random() * (canvas.height - 100),
    						 		sprite));
    }
}

// Update entity
function updateEntity(entitiesStorage, speed, frameGap) {
	entitiesStorage.forEach((item, i) => {
		item.pos[0] += speed * frameGap;
		item.sprite.update(frameGap);

		// Remove the entity if it goes offscreen
		if (item.pos[0] > canvas.width + positionBackground) {
			entitiesStorage.splice(i, 1);
		}
	});
}

// Check collision for player and enemies
function checkPlayerAndEnemiesCollision(entitiesStorage) {
	entitiesStorage.forEach((item, i) => {
		const pos = item.pos;
        const size = item.sprite.size;
        const pos2 = player.pos;
        const size2 = player.sprite.size;
		if (isCollides(pos, size, pos2, size2)) {

			// Remove entity
			entitiesStorage.splice(i, 1);
			i--;

			// Remove life
            lives -= 1;

            // Add sound
            new Sound(pathToExplosionSound);

            // Add an explosion
            explosions.push(new Entity(item.pos[0], item.pos[1],
            						   new Sprite(pathToMainSprite,
                                       [0, 292],
                                       [39, 39],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)));
        }
        if (!lives) {
            gameOver();
        }
	});
}

// Check collision for hammers and enemies
function checkHammersAndEnemiesCollision(entitiesStorage) {
	entitiesStorage.forEach((item, i) => {
		const pos = item.pos;
        const size = item.sprite.size;

        hammers.forEach((itemHammer, j) => {
        	const pos2 = itemHammer.pos;
        	const size2 = itemHammer.sprite.size;

        	if (isCollides(pos, size, pos2, size2)) {

				// Remove entity
				entitiesStorage.splice(i, 1);
				i--;

				// Add score
	            score += 100;

	            // Add sound
	            new Sound(pathToExplosionSound);

	            // Add an explosion
	            explosions.push(new Entity(item.pos[0], item.pos[1],
	            						   new Sprite(pathToMainSprite,
	                                       [0, 292],
	                                       [39, 39],
	                                       16,
	                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	                                       null,
	                                       true)));
	            // Remove the hammer
       			hammers.splice(j, 1);
        	}
        });
	});
}

// Check collision for asteroidsMovingRight and enemies
function checkAsteroidsMovingRightsAndEnemiesCollision(entitiesStorage) {
	entitiesStorage.forEach((item, i) => {
		const pos = item.pos;
        const size = item.sprite.size;

        asteroidsMovingRight.forEach((itemAsteroid, j) => {
        	const pos2 = itemAsteroid.pos;
        	const size2 = itemAsteroid.sprite.size;

        	if (isCollides(pos, size, pos2, size2)) {

				// Remove entities
				entitiesStorage.splice(i, 1);
				i--;
				asteroidsMovingRight.splice(j, 1);
                j--;

				// Add score
	            score += 100;

	            // Add sound
	            new Sound(pathToExplosionSound);

	            // Add an explosion
	            explosions.push(new Entity(item.pos[0], item.pos[1],
	            						   new Sprite(pathToMainSprite,
	                                       [0, 292],
	                                       [39, 39],
	                                       16,
	                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	                                       null,
	                                       true)));
        	}
        });
	});
}

// Check collision for player and ponies
function checkPlayerAndPoniesCollision() {
	ponies.forEach((item, i) => {
		const pos = item.pos;
        const size = item.sprite.size;
        const pos2 = player.pos;
        const size2 = player.sprite.size;
		if (isCollides(pos, size, pos2, size2)) {
			// Remove pony
			ponies.splice(i, 1);
			i--;

			// Add score
            ponySaved += 1;
            score += 200;

            // Add sound
            new Sound(pathToPonySound);

            // Add a flash
            savedFlash.push(new Entity(item.pos[0], item.pos[1],
            						   new Sprite(pathToMainSprite,
                                       			  [371, 23],
                                                  [82, 44],
                                                  1,
                                                  [0],
                                                  null,
                                                  true)))
        }
	});
}

// Check collision for player and hearts
function checkPlayerAndHeartsCollision() {
	hearts.forEach((item, i) => {
		const pos = item.pos;
        const size = item.sprite.size;
        const pos2 = player.pos;
        const size2 = player.sprite.size;
		if (isCollides(pos, size, pos2, size2)) {
			// Remove heart
			hearts.splice(i, 1);
			i--;

			// Add life
            if (lives < 3) {
                lives += 1;
            }

            // Add sound
            new Sound(pathToGetLifeSound);

            // Add an lifeFlash
            lifeFlash.push(new Entity(item.pos[0], item.pos[1],
            						   new Sprite(pathToMainSprite,
                                       [368, 88],
                                       [87, 42],
                                       1,
                                       [0],
                                       null,
                                       true)));
        }
	});
}

// Check collision for player and asteroid
function checkPlayerAndAsteroidCollision() {
	asteroids.forEach((item, i) => {
		const pos = item.pos;
        const size = item.sprite.size;
        const pos2 = player.pos;
        const size2 = player.sprite.size;
		if (isCollides(pos, size, pos2, size2) && input.isDown('X')) {
			// Remove asteroid and add asteroidMovingRight
			asteroidsMovingRight.push(asteroids[i]);
            asteroids.splice(i, 1);
            i--;

			// Add score
            score += 100;

            // Add sound
            new Sound(pathToKickSound);
            new Sound(pathToExplosionSound);

            // Add an explosion
            explosions.push(new Entity(item.pos[0], item.pos[1],
            						   new Sprite(pathToMainSprite,
                                       [0, 292],
                                       [39, 39],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)));
        }
	});
}

function checkCollides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

// Function for tracking collisions
function isCollides(pos, size, pos2, size2) {
    return checkCollides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

// Check that player is in bounds of screen
function checkPlayerBounds() {
    if (player.pos[0] < positionBackground) {
        player.pos[0] = positionBackground;
    } else if (player.pos[0] > canvas.width - player.sprite.size[0] + positionBackground) {
        player.pos[0] = canvas.width - player.sprite.size[0] + positionBackground;
      }

    if (player.pos[1] < 0) {
        player.pos[1] = 0;
    } else if (player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
      }
}

// Check that boss is in bounds of screen
function checkBossBounds() {
    // Check bounds
    if (boss[0] && boss[0].pos[1] < 0) {
        boss[0].pos[1] = 0;
    } else if (boss[0] && boss[0].pos[1] > canvas.height - boss[0].sprite.size[1]) {
        boss[0].pos[1] = canvas.height - boss[0].sprite.size[1];
      }
}

// Function for rendering entities
function renderEntities(list) {
    list.forEach((item) => {
        renderEntity(item);
    });
}

// Function for rendering entity
function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}
