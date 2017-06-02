'use strict';

// Keyboard object
const input = new Keys();
// Images object
const resources = new Images();

// String pathes to game images
const pathToBackground = 'img/back.png';
const pathToMainSprite = 'img/sprite.png';
const pathToSecondSprite = 'img/sprite2.png';
const pathToBatmanSprite = 'img/batmansprite.png';

// Player instance
const player = {
    pos: [0, 0], // first element of array is x coordinat,second is y coordinat

    // main state for batman
    sprite: new Sprite(pathToBatmanSprite, [300, 700], [160, 100]),

    // current batman sprites
    flyingState: null,
    down: null,
    up: null,
    left: null,
    right: null,
    kick: null,

    // sprites for batman with 3 lives
    flyingStateThreeLives: new Sprite(pathToBatmanSprite, [300, 700], [160, 100]),
    downThreeLives: new Sprite(pathToBatmanSprite, [0, 142], [135, 138]),
    upThreeLives: new Sprite(pathToBatmanSprite, [153, 144], [152, 106]),
    leftThreeLives: new Sprite(pathToBatmanSprite, [317, 542], [102, 94]),
    rightThreeLives: new Sprite(pathToBatmanSprite, [906, 186], [164, 98]),
    kickThreeLives: new Sprite(pathToBatmanSprite, [427, 548], [175, 88]),

    // sprites for batman with 2 lives
    flyingStateTwoLives: new Sprite(pathToBatmanSprite, [728, 0], [160, 96]),
    downTwoLives: new Sprite(pathToBatmanSprite, [0, 0], [126, 139]),
    upTwoLives: new Sprite(pathToBatmanSprite, [140, 0], [140, 100]),
    leftTwoLives: new Sprite(pathToBatmanSprite, [460, 0], [90, 90]),
    rightTwoLives: new Sprite(pathToBatmanSprite, [288, 0], [160, 95]),
    kickTwoLives: new Sprite(pathToBatmanSprite, [560, 0], [160, 90]),

    // sprites for batman with 1 life
    flyingStateOneLife: new Sprite(pathToBatmanSprite, [721, 833], [149, 97]),
    downOneLife: new Sprite(pathToBatmanSprite, [0, 827], [125, 143]),
    upOneLife: new Sprite(pathToBatmanSprite, [147, 830], [140, 100]),
    leftOneLife: new Sprite(pathToBatmanSprite, [457, 826], [93, 94]),
    rightOneLife: new Sprite(pathToBatmanSprite, [290, 825], [160, 95]),
    kickOneLife: new Sprite(pathToBatmanSprite, [555, 830], [160, 85]),
    deadBatman: new Sprite(pathToBatmanSprite, [700, 540], [105, 100])
};

// Speed in pixels per second for all entities
const playerSpeed = 300;
const jokerSpeed = 90;
const bulletsSpeed = 350;
const hammerSpeed = 500;
const enemySpeed = 100;
const ponySpeed = 80;
const asteroidSpeed = 65;
const heartsSpeed = 120;
const asteroidsMovingRightSpeed = 450;
const backgroundSpeed = 150;
const bossSpeed = backgroundSpeed;
const bossBulletsSpeed = 350;

// Create canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Create main audio for game
const audio = document.createElement('audio');
audio.setAttribute('autoplay', 'autoplay');
audio.setAttribute('loop', 'loop');

// Play again button
const playAgainButton= document.getElementById('play-again');

// Lives count elemetn
const livesEl = document.getElementById('live-count');

// Saved ponies count element
const ponyEl = document.getElementById('pony-count');

// Score count element
const scoreEl = document.getElementById('score-count');

// GameOver element
const gameOverElement = document.getElementById('game-over');

// GameOver overlay element
const gameOverlayElement = document.getElementById('game-over-overlay');

// Play button
const playButton = document.getElementById('play');

// Reset button
const resetButton = document.getElementById('resetgame');

// Html elemet which shows Top Score of the player
const topScoreEl = document.getElementById('top-score-count');

// Score ranges for boss appeariance
const minScoreForBossFirstTime = 2000;
const maxScoreForBossFirstTime = 3500;

const minScoreForBossSecondTime = 9500;
const maxScoreForBossSecondTime = 11500;

const minScoreForBossThirdTime = 17000;
const maxScoreForBossThirdTime = 20000;

const minScoreForBossFourthTime = 30000;
const maxScoreForBossFourthTime = 33000;

const minScoreForBossFifthTime = 60000;
const maxScoreForBossFifthTime = 65000;

const minScoreForBossSixTime = 100000;
const maxScoreForBossSixTime = 120000;

// String pathes for sounds
const pathToMainSound = 'sounds/main.mp3';
const pathToHammerSound = 'sounds/hammer.wav';
const pathToBossShootSound = 'sounds/bossshoot.wav';
const pathToExplosionSound = 'sounds/explosion.wav';
const pathToJokerLaughtSound = 'sounds/jokerlaught.wav';
const pathToJokerFireSound = 'sounds/jokerfire.wav';
const pathToPonySound = 'sounds/ponysave.mp3';
const pathToGetLifeSound = 'sounds/getlife.mp3';
const pathToKickSound = 'sounds/kick.wav';

// Entities sprites
const bossSprite = new Sprite(pathToMainSprite,
							  [0, 545],
							  [130, 115],
                              10,
                              [0, 1, 2, 3, 2, 1, 0]);

const jokerBulletSprite = new Sprite(pathToMainSprite,
									 [0, 509],
									 [73, 31],
									 15,
									 [0, 1, 2, 3]);

const heartSprite = new Sprite(pathToMainSprite,
                                [8, 337],
                                [32, 43],
                                10,
                                [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]);
