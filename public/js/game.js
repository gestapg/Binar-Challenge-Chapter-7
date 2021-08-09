const playerPickBtn = document.querySelectorAll('#player-area img');
const refreshBtn = document.querySelector('.new-game');
const resultDisplay = document.getElementById('result-area');
const compArea = document.querySelectorAll('#comp-area div');
const playerArea = document.querySelectorAll('#player-area div');
class Game {
  static getComPick() {
    const com = Math.trunc(Math.random() * 3) + 1;
    if (com === 1) return 'batu';
    if (com === 2) return 'kertas';
    return 'gunting';
  }
  static getResult(comPick, playerPick) {
    if (playerPick === comPick) return 'DRAW';
    if (playerPick === 'batu')
      return comPick === 'gunting' ? 'PLAYER 1 <br> WIN' : 'COM <br> WIN';
    if (playerPick === 'kertas')
      return comPick === 'batu' ? 'PLAYER 1 <br> WIN' : 'COM <br> WIN';
    if (playerPick === 'gunting')
      return comPick === 'kertas' ? 'PLAYER 1 <br> WIN' : 'COM <br> WIN';
  }

  static loadingPick() {
    let i = 0;
    const waktuMulai = new Date().getTime();
    setInterval(function () {
      if (new Date().getTime() - waktuMulai > 1000) {
        clearInterval;
        return;
      }
      compArea[i++].classList.toggle('hidden');
      if (i === compArea.length) i = 0;
    }, 100);
  }
}

let playing = true;
let score = 0;
let plays = 0;
let scoreDisplay = 5;

playerPickBtn.forEach(function (i) {
  i.addEventListener('click', function () {
    if (playing) {
      // Player 1 pick choice
      const playerPick = i.className;
      console.log(`Player 1 memilih : ${playerPick}`);
      const playerHighlight = document.querySelector(`.btn--${playerPick}`);
      playerHighlight.classList.add('hidden');

      plays++;
      scoreDisplay--;

      // Player 1 cannot pick again unless its refreshed
      playing = false;

      // Waiting for the computer pick
      Game.loadingPick();

      // After 1 second
      setTimeout(function () {
        for (let i = 0; i < compArea.length; i++) {
          compArea[i].classList.remove('hidden');
        }

        // Computer pick choice
        const comPick = Game.getComPick();
        console.log(`Computer memilih : ${comPick}`);
        const comHighlight = document.querySelector(`.comp--${comPick}`);
        comHighlight.classList.add('hidden');

        // Showing the result
        const hasil = Game.getResult(comPick, playerPick);
        console.log(`Hasilnya : ${hasil}`);
        resultDisplay.innerHTML = hasil;
        if (hasil === 'DRAW') {
          resultDisplay.classList.add('draw');
        } else if (hasil === 'PLAYER 1 <br> WIN') {
          score += 10;
          resultDisplay.classList.add('hasil');
        } else if (hasil === 'COM <br> WIN') {
          score -= 5;
          resultDisplay.classList.add('hasil');
        }
        document.querySelector('.score__result').value = score;
        console.log(score);
        console.log(plays);
        console.log(scoreDisplay);
        document.querySelector('.score__display').innerHTML = scoreDisplay;
        console.log(document.querySelector('.score__display'));
        if (plays === 5) {
          refreshBtn.classList.add('hide');
          document.querySelector('.excecute').classList.remove('hide');
          // console.log(document.querySelector('.excecute'));
        }
      }, 1000);
    }
  });
});

// document.querySelector('.play__again').addEventListener('click', function () {
//   location.reload();
// // });

refreshBtn.addEventListener('click', function () {
  playing = true;
  for (let i = 0; i < compArea.length; i++) {
    compArea[i].classList.remove('hidden');
  }
  for (let i = 0; i < playerArea.length; i++) {
    playerArea[i].classList.remove('hidden');
  }
  resultDisplay.classList.remove('draw');
  resultDisplay.classList.remove('hasil');
  resultDisplay.innerHTML = '<h1>VS</h1>';
  resultDisplay.querySelector('h1').classList.add('vs');
});
