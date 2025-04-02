let field = [
    null, //0
    null,     //1
    null,     //2
    null,     //3
    null,     //4
    null,     //5
    null,  //6
    null,  //7
    null      //8
];

let gameOver = false;

let currentShape = 'circle'; // Startspieler

function render() {
    let boardWrapper = document.getElementById('board-wrapper');
    let tableHTML = '<table>';
  
    for (let i = 0; i < 3; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < 3; j++) {
        let index = i * 3 + j;
        let symbol = '';
  
        if (field[index] === 'circle') {
          symbol = createAnimatedCircleSVG();
        } else if (field[index] === 'cross') {
          symbol = createAnimatedCrossSVG();
        }
  
        let clickHandler = '';
        if (field[index] === null) {
          clickHandler = `onclick="handleClick(this, ${index})"`;
        }
  
        tableHTML += `<td ${clickHandler}>${symbol}</td>`;
      }
      tableHTML += '</tr>';
    }
  
    tableHTML += '</table>';
    boardWrapper.innerHTML = tableHTML + '<div id="win-line"></div>';
  }
  

  function handleClick(tdElement, index) {
    if (gameOver) return; // <<< Blockiere Klicks nach Sieg
  
    field[index] = currentShape;
  
    if (currentShape === 'circle') {
      tdElement.innerHTML = createAnimatedCircleSVG();
      currentShape = 'cross';
    } else {
      tdElement.innerHTML = createAnimatedCrossSVG();
      currentShape = 'circle';
    }
  
    tdElement.removeAttribute('onclick');
  
    checkWinner();
  }
  


function createAnimatedCircleSVG() {
    return `
      <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <circle 
          cx="35" cy="35" r="25" 
          stroke="lightblue" 
          stroke-width="5" 
          fill="none"
          class="circle-animation"
        />
        <style>
          .circle-animation {
            opacity: 0;
            transform: scale(1.3);
            transform-origin: center;
            animation: popIn 125ms ease-out forwards;
          }
  
          @keyframes popIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        </style>
      </svg>
    `;
  }
  
  function createAnimatedCrossSVG() {
    return `
      <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="20" x2="50" y2="50" stroke="#ff4d4d" stroke-width="5" class="cross-line" />
        <line x1="50" y1="20" x2="20" y2="50" stroke="#ff4d4d" stroke-width="5" class="cross-line" />
        <style>
          .cross-line {
            opacity: 0;
            transform: scale(1.3);
            transform-origin: center;
            animation: popIn 125ms ease-out forwards;
          }
  
          @keyframes popIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        </style>
      </svg>
    `;
  }  

  const winningCombos = [
    [0, 1, 2], // Reihe oben
    [3, 4, 5], // Reihe mitte
    [6, 7, 8], // Reihe unten
    [0, 3, 6], // Spalte links
    [1, 4, 7], // Spalte mitte
    [2, 5, 8], // Spalte rechts
    [0, 4, 8], // Diagonale ↘
    [2, 4, 6], // Diagonale ↙
  ];
  
  function checkWinner() {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        field[a] &&
        field[a] === field[b] &&
        field[a] === field[c]
      ) {
        drawWinLine(combo);
        showWinner(field[a]);
        gameOver = true;
        return;
      }
    }
  
    // Unentschieden prüfen (wenn kein Feld mehr null ist)
    if (field.every(cell => cell !== null)) {
      showDraw();
      gameOver = true;
    }
  }
  
  function showDraw() {
    const status = document.getElementById('status');
    const button = document.getElementById('restart-button');
    status.innerText = 'Unentschieden!';
    button.style.display = 'inline-block';
  }
  
  

  function drawWinLine(combo) {
    const winLine = document.getElementById('win-line');
  
    const cellSize = 70 + 5; // 70px + 5px Border = 75
    const offset = cellSize / 2;
  
    const positions = {
      '0,1,2': { top: offset, left: cellSize * 1.5, rotate: '0deg' },
      '3,4,5': { top: cellSize + offset, left: cellSize * 1.5, rotate: '0deg' },
      '6,7,8': { top: cellSize * 2 + offset, left: cellSize * 1.5, rotate: '0deg' },
  
      '0,3,6': { top: cellSize * 1.5, left: offset, rotate: '90deg' },
      '1,4,7': { top: cellSize * 1.5, left: cellSize + offset, rotate: '90deg' },
      '2,5,8': { top: cellSize * 1.5, left: cellSize * 2 + offset, rotate: '90deg' },
  
      '0,4,8': { top: cellSize * 1.5, left: cellSize * 1.5, rotate: '45deg' },
      '2,4,6': { top: cellSize * 1.5, left: cellSize * 1.5, rotate: '-45deg' },
    };
  
    const comboKey = combo.toString();
    const pos = positions[comboKey];
  
    if (!pos) return;
  
    winLine.style.display = 'block';
    winLine.style.top = pos.top + 'px';
    winLine.style.left = pos.left + 'px';
    winLine.style.transform = `translate(-50%, -50%) rotate(${pos.rotate})`;
    winLine.style.width = '0';
    winLine.style.animation = 'drawLine 300ms ease-out forwards';
  }  

  function showWinner(winner) {
    const status = document.getElementById('status');
    const button = document.getElementById('restart-button');
    status.innerText = `${winner.charAt(0).toUpperCase() + winner.slice(1)} gewinnt!`;
    button.style.display = 'inline-block';
    launchConfetti(); // <<< Konfetti abfeuern 🎉
  }
  

  function restartGame() {
    field = [null, null, null, null, null, null, null, null, null];
    currentShape = 'circle';
    gameOver = false;
  
    document.getElementById('status').innerText = '';
    document.getElementById('restart-button').style.display = 'none';
  
    const winLine = document.getElementById('win-line');
    if (winLine) {
      winLine.style.display = 'none';
    }
  
    render();
  }
  
  function launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }