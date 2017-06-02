'use strict';

// Shows the last time of main game loop was executed
let lastTime;

// Coordinate of the left top corner of the moving background
let positionBackground = 0;

// Storages for all game entities
let boss = [];
let bossBullets = [];
let jokers = [];
let jokerBullets = [];
let hammers = [];
let enemies = [];
let ponies = [];
let asteroids = [];
let asteroidsMovingRight = [];
let explosions = [];
let savedFlash = [];
let hearts = [];
let lifeFlash = [];

// The last time of player's kicking hammer
let lastFire = Date.now();

// The last time of joker's shooting
let lastFireJoker = Date.now();

// The last time of boss's shooting
let lastFireBossBomb = Date.now();

// Time of the game
let gameTime = 0;

// Variable shows the game state
let isGameOver;

// Variable contains the background image
let pattern;

// Game score
let score = 0;

// Pony saved count
let ponySaved = 0;

// Default number of lives
let lives = 3;

// Vertical boss speed, the mark of this variable will be changed
let verticalBossSpeed = 200;

// Variable contains topscore value, getting from localStorage
let topScore = +localStorage.getItem('topScore');
topScoreEl.innerHTML = topScore;
