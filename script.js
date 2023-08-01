function createBoard(width, height) {
    const board = [];
    for (let i = 0; i < width; i++) {
      board[i] = [];
      for (let j = 0; j < height; j++) {
        board[i][j] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighbors: 0,
        };
      }
    }
    return board;
  }
  
  function generateMines(board, numMines) {
    const width = board.length;
    const height = board[0].length;
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (!board[x][y].isMine) {
        board[x][y].isMine = true;
        minesPlaced++;
      }
    }
  }
  
  function countNeighboringMines(board, x, y) {
    const width = board.length;
    const height = board[0].length;
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const x2 = x + i;
        const y2 = y + j;
        if (x2 >= 0 && x2 < width && y2 >= 0 && y2 < height && board[x2][y2].isMine) {
          neighbors++;
        }
      }
    }
    return neighbors;
  }
  
  function revealTile(board, x, y) {
    const cell = board[x][y];
    if (cell.isRevealed || cell.isFlagged) {
      return;
    }
    cell.isRevealed = true;
    if (cell.isMine) {
      alert('Você perdeu!');
      return;
    }
    const neighbors = countNeighboringMines(board, x, y);
    cell.neighbors = neighbors;
    if (neighbors === 0) {
      const width = board.length;
      const height = board[0].length;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const x2 = x + i;
          const y2 = y + j;
          if (x2 >= 0 && x2 < width && y2 >= 0 && y2 < height) {
            revealTile(board, x2, y2);
          }
        }
      }
    }
  }
  
  function renderBoard(board) {
    const html = [];
    for (let i = 0; i < board.length; i++) {
      html.push('<div class="row">');
      for (let j = 0; j < board[0].length; j++) {
        const cell = board[i][j];
        const cellClass = getCellClass(cell);
        const cellContent = getCellContent(cell);
  
        html.push(
          `<div class="tile ${cellClass}" data-x="${i}" data-y="${j}">
            ${cellContent}
          </div>`
        );
      }
      html.push('</div>');
    }
    return html.join('');
  }
  
  function getCellClass(cell) {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return 'mine';
      } else if (cell.neighbors > 0) {
        return 'number';
      } else {
        return 'revealed';
      }
    } else if (cell.isFlagged) {
      return 'flagged';
    }
    return '';
  }
  
  function getCellContent(cell) {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return '💣';
      } else if (cell.neighbors > 0) {
        return cell.neighbors;
      }
    } else if (cell.isFlagged) {
      return '🚩';
    }
    return '';
  }
  
  function toggleFlag(board, x, y) {
    const cell = board[x][y];
    cell.isFlagged = !cell.isFlagged;
  }
  
  function handleMouseClick(event) {
    const target = event.target;
    const x = parseInt(target.getAttribute('data-x'));
    const y = parseInt(target.getAttribute('data-y'));
  
    if (event.button === 2) {
      event.preventDefault();
      toggleFlag(board, x, y);
      element.innerHTML = renderBoard(board);
    } else if (event.button === 0) {
      revealTile(board, x, y);
      element.innerHTML = renderBoard(board);
    }
  }
  
  const width = 10;
  const height = 10;
  const numMines = 10;
  const board = createBoard(width, height);
  generateMines(board, numMines);
  
  const element = document.getElementById('board');
  element.addEventListener('contextmenu', (event) => event.preventDefault());
  element.innerHTML = renderBoard(board);
  element.addEventListener('mousedown', handleMouseClick);