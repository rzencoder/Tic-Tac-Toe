/*Noughts and Crosses. Part of Free Code Camp curriculum. Responsive. Tested on Firefox, Chrome and Edge*/

$(document).ready(function() {
  introMenu.show();
  info.hide();
  typeChoice.hide();
  result.hide();
  loader.hide();
});

function Contestant(moves = [], type = "", score = 0) {
  this.moves = moves;
  this.type = type;
  this.score = score;
}

let player = new Contestant();
let computer = new Contestant();
let playerTurn;
let gameEnd = false;
let mode = "";
let board;
const boardStart = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const winCombos = [
  [1, 2, 3],
  [1, 5, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [3, 5, 7],
  [4, 5, 6],
  [7, 8, 9]
];

const boardtile = $('.row > div');
const result = $('.result');
const winner = $('.winner');
const loader = $('.loader');
const loaderStyle = $('.loader > div');
const playerMessage = $('.player-message');
const info = $('.info');
const playerInfo = $('.player');
const computerInfo = $('.computer');
const introMenu = $('.intro');
const typeChoice = $('.choice');
const modeSetting = $('.setting');

/*Helper functions*/

//Animate Start menu and Information panels
function introAnimation() {
  introMenu.animate({
    opacity: 0
  }, 1000, function() {
    introMenu.hide();
    info.show();
    info.animate({
      opacity: 1
    }, 1000);
  });
}

// Reset board and styles after game end
function reset() {
  board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  player.moves = [];
  computer.moves = [];
  gameEnd = false;
  boardtile.text('');
  boardtile.removeClass('X');
  boardtile.removeClass('O');
  winner.removeClass('X');
  winner.removeClass('O');
  playerMessage.text('');
  loader.hide();
  gameStart();
}

//Show Start menu on game end
function playAgain() {
  result.hide();
  introMenu.css("opacity", "0.9");
  introMenu.show();
  typeChoice.hide();
  modeSetting.show();
}

//Apply difficulty level
function settingHandler() {
  mode = $(this).attr('class').split(' ')[1];
  modeSetting.hide();
  typeChoice.show();
}

//Apply styles based on which piece picked
function gameInit() {
  if ($(this).text() === 'X') {
    player.type = 'X';
    playerInfo.removeClass('O');
    playerInfo.addClass('X');
    computer.type = 'O';
    computerInfo.removeClass('X');
    computerInfo.addClass('O');
    loaderStyle.removeClass('loader-x');
    loaderStyle.addClass('loader-o');
  } else {
    player.type = 'O';
    playerInfo.removeClass('X');
    playerInfo.addClass('O');
    computer.type = 'X';
    computerInfo.removeClass('O');
    computerInfo.addClass('X');
    loaderStyle.removeClass('loader-o');
    loaderStyle.addClass('loader-x');
  }
  introAnimation();
  reset();
}

/*Game functions*/

//Randomly decide who starts the game
function gameStart() {
  let random = Math.random();
  if (random > 0.5) {
    playerTurn = true;
    playerMessage.text('Your Turn');
  } else {
    playerTurn = false;
    loader.show();
    computerAction();
  }
}

function turnHandler() {
  if (playerTurn) {
    playerAction($(this));
  }
}

//Check if the board contains a winning combination or tie
function checkResult(moves) {
  let count = 0;
  //Iterate through each win combo. If Person/AI has a matching value, add one to a temporary count. If count = 3 declare a winner. 
  winCombos.forEach(combo => {
    for (let i = 0; i < moves.length; i++) {
      if (combo.includes(moves[i])) {
        count++;
      }
    }
    if (count === 3) {
      if (playerTurn) {
        player.score++;
        $('.player-score').text(player.score);
        playerMessage.text('');
        winner.text('You Win');
        winner.addClass(player.type);
        gameEnd = true;
      } else {
        computer.score++;
        winner.text('Computer Wins');
        winner.addClass(computer.type);
        $('.computer-score').text(computer.score);
        gameEnd = true;
      }
      result.show();
    }
    count = 0;
  });
  //If board is full and no winning combination. Declare a tie
  if (!gameEnd) {
    if (!board.includes(0)) {
      winner.text('Tie');
      result.show();
      playerMessage.text('');
      gameEnd = true;
    }
  }
}

//Handle player's turn
function playerAction(tile) {
  //Get key value from clicked tile. If 0, Update board and players chosen tiles. Check for a result. If no result pass turn to computer. 
  let tileKey = tile.data().key;
  if (board[tileKey - 1] === 0) {
    tile.text(player.type);
    tile.addClass(player.type);
    board[tileKey - 1] = tileKey;
    player.moves.push(parseInt(tileKey));
    checkResult(player.moves);
    playerTurn = false;
    if (!gameEnd) {
      playerMessage.text('');
      loader.show();
      computerAction();
    }
  }
}

//Check to see if adding a tile to board would produce a computer win or block a player win
function calculateBestMove(moves) {
  let count = 0;
  let guess = 0;
  let tempMoves = moves.slice();
  //Iterate through all empty tiles
  for (let i = 0; i <= board.length; i++) {
    if (board[i - 1] === 0) {
      if (tempMoves.length > 2) {
        tempMoves = moves.slice();
      }
      //Adding a value to array and checking if that value will produce a win
      tempMoves.push(i);
      winCombos.forEach(combo => {
        for (let i = 0; i < tempMoves.length; i++) {
          if (combo.includes(tempMoves[i])) {
            count++;
          }
        }
        if (count === 3) {
          guess = i;
        }
        count = 0;
      });
    }
  }
  return guess;
}

//Handle computers turn;
function computerAction(tile) {
  window.setTimeout(function() {
      loader.hide();
      let tileKey = 0;
      // Target middle if free
      if (board[4] === 0) {
        tileKey = 5;
      }
      //Target corner if all free
      if (board[0] === 0 && board[2] === 0 && board[6] === 0 && board[8] === 0 && board[4] === 5) {
        let corners = [1, 3, 7, 9];
        let corner = corners[Math.floor(Math.random() * corners.length)];
        tileKey = corner;
      }
      if (mode !== 'easy') {
        if (mode === 'hard') {
          //If can block player
          if (player.moves.length > 1) {
            let pBlockTile = calculateBestMove(player.moves);
            if (pBlockTile !== 0) {
              tileKey = pBlockTile;
            }
          }
        }
        // If one tile needed to win. Go for it
        if (computer.moves.length > 1) {
          let cWinTile = calculateBestMove(computer.moves);
          if (cWinTile !== 0) {
            tileKey = cWinTile;
          }
        }
      }
      // If no win or block possible. Pick random tile
      if (tileKey === 0) {
        tileKey = Math.ceil(Math.random() * 9);
        while (board[tileKey - 1] !== 0) {
          tileKey = Math.ceil(Math.random() * 9);
        }
      }
      //Update board and computers chosen tiles. Check for a result. If no result pass turn to player.
      let tileEl = $(".row > div[data-key='" + tileKey + "']");
      tileEl.text(computer.type);
      tileEl.addClass(computer.type);
      board[tileKey - 1] = tileKey;
      computer.moves.push(tileKey);
      checkResult(computer.moves);
      playerTurn = true;
      loader.hide();
      if (!gameEnd) {
        playerMessage.text('Your Turn');
      }
    },
    2000
  );
}

//Event Handlers
$('.setting-options').click(settingHandler);
$('.choice-o').click(gameInit);
$('.choice-x').click(gameInit);
boardtile.click(turnHandler);
$('.play-again').click(playAgain);