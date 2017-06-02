'use strict';

// Add the canvas
canvas.width = 1200;
canvas.height = 656;
document.body.appendChild(canvas);

// Load all images
resources.loadImages([
    'img/sprite.png',
    'img/sprite2.png',
    'img/back.png',
    'img/batmansprite.png',
]);

// Init game function
function init() {
    // Create background
    pattern = ctx.createPattern(resources.getImg(pathToBackground), 'repeat-x');

    // Adding main game sound
    audio.setAttribute('src', pathToMainSound);
    document.body.appendChild(audio);

    // Add event to play again button
    playAgainButton.addEventListener('click', () => {
        reset();
    });

    reset();
    lastTime = Date.now();
    main();
}

// Add event to Start Game button for one time
addEventListenerOnce(playButton, 'click', init);

// Add event to Reset Game button
resetButton.addEventListener('click', reset);

// Update game objects
function update(frameGap) {
    gameTime += frameGap;

    handleInput(frameGap);
    updateEntities(frameGap);

    // adding boss
    if (!boss.length) {

        // Boss will appear in this range of score
        if (score >= minScoreForBossFirstTime && score < maxScoreForBossFirstTime ||
           score >= minScoreForBossSecondTime && score < maxScoreForBossSecondTime ||
           score >= minScoreForBossThirdTime && score < maxScoreForBossThirdTime ||
           score >= minScoreForBossFourthTime && score < maxScoreForBossFourthTime ||
           score >= minScoreForBossFifthTime && score < maxScoreForBossFifthTime ||
           score >= minScoreForBossSixTime && score < maxScoreForBossSixTime) {

           // Add boss
           boss.push(new Entity(canvas.width + positionBackground - 200,
                             Math.random() * (canvas.height - 100),
                             bossSprite));
        }
    }

    if (boss.length) {
        // Remove all entities except boss
        enemies = [];
        jokers = [];
        jokerBullets = [];
        ponies = [];
        savedFlash = [];
        asteroids = [];
        asteroidsMovingRight = [];
        lifeFlash = [];
    }

    // adding jokers, enemies, ponies, asteroids, hearts
    addEntity(jokers, 0.9998, new Sprite(pathToMainSprite,
                                        [0, 387],
                                        [88, 103],
                                        10,
                                        [0, 1, 2, 3, 4, 5]));

    addEntity(enemies, 0.9995, new Sprite(pathToMainSprite,
                                         [29, 72],
                                         [96, 90],
                                         6,
                                         [0, 1, 2]));

    addEntity(ponies, 0.9997, new Sprite(pathToMainSprite,
                                        [10, 209],
                                        [58, 73],
                                        10,
                                        [0, 1, 2, 3, 4, 5]));

    addEntity(asteroids, 0.99993, new Sprite(pathToMainSprite,
                                            [0, 0],
                                            [64, 60],
                                            10,
                                            [0, 1, 2, 3, 4]));

    // Hearts will appear only if lives count less than 3
    if (lives < 3) {
        addEntity(hearts, .99996, heartSprite);
    }

    checkCollisions();

    // Show the score, lives and ponySaved count if batman is alife
    if (lives) {

        scoreEl.innerHTML = score;
        ponyEl.innerHTML = ponySaved;
        lives === 3 ? livesEl.style.width = '185px' : 3;
        lives === 2 ? livesEl.style.width = '123px' : 2;
        lives === 1 ? livesEl.style.width = '63px' : 1;

        if (score > topScore) {

            topScore = score;
            topScoreEl.innerHTML = topScore;
        }
    }

    // If batman is dead and score more than last Topscore, write Topscore to Localstorage
    if (!lives) {
        livesEl.style.width = '0px';
        let topScoreString = JSON.stringify(topScore);
        localStorage.clear();
        localStorage.setItem('topScore', topScoreString);
    }
}

function handleInput(frameGap) {

    // Change batman sprite depends on life count
    if (lives === 3) {
        player.up = player.upThreeLives;
        player.down = player.downThreeLives;
        player.left = player.leftThreeLives;
        player.right = player.rightThreeLives;
        player.kick = player.kickThreeLives;
        player.flyingState = player.flyingStateThreeLives; 
    }

    if (lives === 2) {
        player.up = player.upTwoLives;
        player.down = player.downTwoLives;
        player.left = player.leftTwoLives;
        player.right = player.rightTwoLives;
        player.kick = player.kickTwoLives;
        player.flyingState = player.flyingStateTwoLives;
    }

    if (lives === 1) {
        player.up = player.upOneLife;
        player.down = player.downOneLife;
        player.left = player.leftOneLife;
        player.right = player.rightOneLife;
        player.kick = player.kickOneLife;
        player.flyingState = player.flyingStateOneLife;
    }

    if (input.isDown('DOWN')) {
        player.pos[1] += playerSpeed * frameGap;
        player.sprite = player.down;
    } else {
        player.sprite = player.flyingState;
    }

    if (input.isDown('UP')) {
        player.pos[1] -= playerSpeed * frameGap;
        player.sprite = player.up;
    }

    if (input.isDown('LEFT')) {
        player.pos[0] -= (playerSpeed + backgroundSpeed) * frameGap;
        player.sprite = player.left;
    }

    if (input.isDown('RIGHT')) {
        player.pos[0] += playerSpeed * frameGap;
        player.sprite = player.right;
    }

    if (input.isDown('Z') && !isGameOver && Date.now() - lastFire > 500) {
        const x = player.pos[0] + player.sprite.size[0] * 7 / 8;
        const y = player.pos[1] + player.sprite.size[1] / 10;

        // Add sound
        new Sound(pathToHammerSound);

        // Add hammers
        hammers.push({ pos: [x, y],
                       sprite: new Sprite(pathToMainSprite, [0, 170], [20, 20], 30,
                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13,
                       12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) });

        lastFire = Date.now();
    }

    if (input.isDown('X') && !isGameOver) {

        player.sprite = player.kick;
    }
}

function updateEntities(frameGap) {
    // Making moving background
    let translateX = backgroundSpeed * frameGap;
    positionBackground += translateX;

    ctx.fillStyle = pattern;
    ctx.rect(translateX, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.translate(-translateX, 0);

    // Update the player animation
    player.pos[0] += backgroundSpeed * frameGap;
    player.sprite.update(frameGap);

    // Update the boss animation
    if (boss[0]) {
        boss[0].pos[0] += bossSpeed * frameGap;

        if (boss[0].pos[1] < 10) {
            verticalBossSpeed = 200;
        }

        if (boss[0].pos[1] > canvas.height - 116) {
            verticalBossSpeed = -200;
        }

        if (Date.now() - lastFireBossBomb > 1500) {

            const x = boss[0].pos[0];
            const y = boss[0].pos[1] + boss[0].sprite.size[1] / 2;

            // Add sound
            new Sound(pathToBossShootSound);

            // Add bossBullets
            bossBullets.push(new Entity(x, y, new Sprite(pathToSecondSprite,
                                                         [90, 65],
                                                         [90, 75])));

            lastFireBossBomb = Date.now();
        }

        boss[0].pos[1] += verticalBossSpeed * frameGap;
        boss[0].sprite.update(frameGap);
    }

     // Update jokers animation
    jokers.forEach((item, i) => {
        if (Date.now() - lastFireJoker > 2500) {

            // X and Y are primary coordinates of boss bullets
            const x = item.pos[0] - item.sprite.size[0] * 7 / 8;
            const y = item.pos[1] + item.sprite.size[1] / 10;

            // Add sound
            new Sound(pathToJokerFireSound);

            // Add jokerBullets
            jokerBullets.push(new Entity(x, y, jokerBulletSprite));

            lastFireJoker = Date.now();
        }

        item.pos[0] -= enemySpeed * frameGap;
        item.sprite.update(frameGap);

        // Remove if offscreen
        if (item.pos[0] + item.sprite.size[0] < positionBackground) {
            jokers.splice(i, 1);
            i--;
        }
    });

    // Update entities animation
    updateEntity(hammers, hammerSpeed, frameGap);
    updateEntity(bossBullets, -bulletsSpeed, frameGap);
    updateEntity(jokerBullets, -bulletsSpeed, frameGap);
    updateEntity(enemies, -enemySpeed, frameGap);
    updateEntity(ponies, -ponySpeed, frameGap);
    updateEntity(asteroids, -asteroidSpeed, frameGap);
    updateEntity(asteroidsMovingRight, asteroidsMovingRightSpeed, frameGap);
    updateEntity(hearts, -heartsSpeed, frameGap);
    updateEntity(explosions, 0, frameGap);
    updateEntity(savedFlash, 0, frameGap);
    updateEntity(lifeFlash, 0, frameGap);
}

// Collisions
function checkCollisions() {
    // Check that player and boss are in bounds of screen
    checkPlayerBounds();
    checkBossBounds();

    // Run collision detection for jokers, enemies and boss with hammers
    checkHammersAndEnemiesCollision(jokers);
    checkHammersAndEnemiesCollision(boss);
    checkHammersAndEnemiesCollision(enemies);

    // Run collision detection for jokers, enemies with asteroidsMovingRight
    checkAsteroidsMovingRightsAndEnemiesCollision(enemies);
    checkAsteroidsMovingRightsAndEnemiesCollision(jokers);

    // Run collision detection for ponies and player
    checkPlayerAndPoniesCollision();

    // Run collision detection for hearts and player
    checkPlayerAndHeartsCollision();

    // Run collision detection for all asteroids and player
    checkPlayerAndAsteroidCollision();

    // Run collision detection for all this entities with player
    checkPlayerAndEnemiesCollision(enemies);
    checkPlayerAndEnemiesCollision(asteroids);
    checkPlayerAndEnemiesCollision(boss);
    checkPlayerAndEnemiesCollision(jokers);
    checkPlayerAndEnemiesCollision(jokerBullets);
    checkPlayerAndEnemiesCollision(bossBullets);
}

// Draw everything
function render() {

    if (!isGameOver) {
        renderEntity(player);

        if (boss[0]){
           renderEntities(boss);
           renderEntities(bossBullets);
        }

        renderEntities(hammers);
        renderEntities(jokers);
        renderEntities(jokerBullets);
        renderEntities(enemies);
        renderEntities(ponies);
        renderEntities(savedFlash);
        renderEntities(asteroids);
        renderEntities(explosions);
        renderEntities(hearts);
        renderEntities(lifeFlash);
        renderEntities(asteroidsMovingRight);
    }
}

// Game over
function gameOver() {

    // show game over screen
    gameOverElement.style.display = 'block';
    gameOverlayElement.style.display = 'block';

    if (!isGameOver){
        // Adding sound of laughting joker
        new Sound(pathToJokerLaughtSound);
    }

    // Reset isGameOver and all entities storages
    isGameOver = true;
    lives = 0;
    enemies = [];
    boss = [];
    bossBullets = [];
    jokers = [];
    jokerBullets = [];
    ponies = [];
    savedFlash = [];
    asteroids = [];
    asteroidsMovingRight = [];
    hammers = [];
    hearts = [];
    lifeFlash = [];
}

// Reset game to original state
function reset() {

    // remove game over screen
    gameOverElement.style.display = 'none';
    gameOverlayElement.style.display = 'none';

    // Reset isGameOver and all entities storages
    isGameOver = false;
    gameTime = 0;
    score = 0;
    lives = 3;
    ponySaved = 0;
    enemies = [];
    boss = [];
    bossBullets = [];
    jokers = [];
    jokerBullets = [];
    ponies = [];
    savedFlash = [];
    asteroids = [];
    asteroidsMovingRight = [];
    hammers = [];
    hearts = [];
    lifeFlash = [];
    player.pos = [50, canvas.height / 2];
}
