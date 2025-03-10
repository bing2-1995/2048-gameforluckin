class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.gameOver = false;
        this.maxTile = 256;
        this.init();
    }

    init() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = this.score;
        document.getElementById('bestScore').textContent = this.bestScore;
        
        const existingGameOver = document.querySelector('.game-over');
        if (existingGameOver) {
            existingGameOver.remove();
        }

        this.addInitial128();
        this.addNewTile();
        this.updateDisplay();
    }

    addInitial128() {
        const emptyCells = [];
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if(emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = 128;
        }
    }

    addNewTile() {
        const emptyCells = [];
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if(emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                const value = this.grid[i][j];
                
                cell.innerHTML = '';
                
                if(value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.style.backgroundImage = `url('images/${value}.png')`;
                    cell.appendChild(tile);
                }
            }
        }

        document.getElementById('score').textContent = this.score;
        
        if (this.isGameOver() && !this.gameOver) {
            this.showGameOver();
        }
    }

    showGameOver() {
        this.gameOver = true;
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.textContent = 'Game Over!';
        document.querySelector('.game-container').appendChild(gameOverDiv);
    }

    // 修改合并逻辑的辅助函数
    mergeTiles(value1, value2) {
        if (value1 === value2) {
            if (value1 === 256) {
                // 如果是256合并，返回0（消失）
                this.score += 512; // 仍然给分
                return 0;
            } else if (value1 * 2 <= this.maxTile) {
                // 普通合并
                return value1 * 2;
            }
        }
        return null; // 不能合并
    }

    moveLeft() {
        let moved = false;
        for(let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for(let j = 0; j < row.length - 1; j++) {
                const mergeResult = this.mergeTiles(row[j], row[j + 1]);
                if (mergeResult !== null) {
                    row[j] = mergeResult;
                    row[j + 1] = 0;
                    this.score += row[j];
                    moved = true;
                }
            }
            row = row.filter(cell => cell !== 0);
            while(row.length < 4) row.push(0);
            
            if(row.join(',') !== this.grid[i].join(',')) {
                moved = true;
            }
            this.grid[i] = row;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for(let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for(let j = row.length - 1; j > 0; j--) {
                const mergeResult = this.mergeTiles(row[j], row[j - 1]);
                if (mergeResult !== null) {
                    row[j] = mergeResult;
                    row[j - 1] = 0;
                    this.score += row[j];
                    moved = true;
                }
            }
            row = row.filter(cell => cell !== 0);
            while(row.length < 4) row.unshift(0);
            
            if(row.join(',') !== this.grid[i].join(',')) {
                moved = true;
            }
            this.grid[i] = row;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for(let j = 0; j < 4; j++) {
            let column = this.grid.map(row => row[j]).filter(cell => cell !== 0);
            for(let i = 0; i < column.length - 1; i++) {
                const mergeResult = this.mergeTiles(column[i], column[i + 1]);
                if (mergeResult !== null) {
                    column[i] = mergeResult;
                    column[i + 1] = 0;
                    this.score += column[i];
                    moved = true;
                }
            }
            column = column.filter(cell => cell !== 0);
            while(column.length < 4) column.push(0);
            
            for(let i = 0; i < 4; i++) {
                if(this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for(let j = 0; j < 4; j++) {
            let column = this.grid.map(row => row[j]).filter(cell => cell !== 0);
            for(let i = column.length - 1; i > 0; i--) {
                const mergeResult = this.mergeTiles(column[i], column[i - 1]);
                if (mergeResult !== null) {
                    column[i] = mergeResult;
                    column[i - 1] = 0;
                    this.score += column[i];
                    moved = true;
                }
            }
            column = column.filter(cell => cell !== 0);
            while(column.length < 4) column.unshift(0);
            
            for(let i = 0; i < 4; i++) {
                if(this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    handleKeyPress(event) {
        if (this.gameOver) return;
        
        let moved = false;
        
        switch(event.key) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
            default:
                return;
        }
        
        if(moved) {
            this.addNewTile();
            this.updateDisplay();
            
            if(this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('bestScore', this.bestScore);
                document.getElementById('bestScore').textContent = this.bestScore;
            }
        }
    }

    isGameOver() {
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(this.grid[i][j] === 0) return false;
                if(j < 3 && this.mergeTiles(this.grid[i][j], this.grid[i][j + 1]) !== null) return false;
                if(i < 3 && this.mergeTiles(this.grid[i][j], this.grid[i + 1][j]) !== null) return false;
            }
        }
        return true;
    }
}

window.onload = () => {
    const game = new Game2048();
    document.addEventListener('keydown', (event) => game.handleKeyPress(event));
    document.getElementById('newGameButton').addEventListener('click', () => game.init());
};