// Sokoban Web Game Implementation
class SokobanGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.moveCounter = document.getElementById('moveCounter');
        this.levelSelect = document.getElementById('levelSelect');
        this.resetButton = document.getElementById('resetButton');
        this.winMessage = document.getElementById('winMessage');
        
        // Game constants
        this.CHAR_TO_NUM = {
            ' ': 0,  // floor
            '#': 1,  // wall
            '&': 2,  // player
            'B': 3,  // box
            '.': 4,  // target
            'X': 5   // box on target
        };
        
        this.ACTION_SPACE = [
            [-1, 0],  // up
            [1, 0],   // down
            [0, -1],  // left
            [0, 1]    // right
        ];
        
        // Game state
        this.board = null;
        this.state = null;
        this.gameOver = false;
        this.moves = 0;
        this.cellSize = 40;
        this.currentLevel = 'prb_1';
        
        // Embedded levels for easy deployment
        this.levels = {
            'prb_1': `######
#.  .#
#    #
# BB #
#&   #
######`,
            'prb_2': `########
#   .  #
#  B   #
# B    #
#  .&  #
########`,
            'prb_3': `  ####
###  #
#    #
# BB.#
#  . #
#  &##
####`,
            'prb_4': `#######
#     #
# BB  #
#. .  #
#  &  #
#######`,
            'prb_5': `  ####
  #  ###
  #    #
  # BB #
### .  #
#   .  #
#   &  #
########`,
            'prb_8': `  ######
  # ..&#
  # BB #
  ## ###
   # #
   # #
#### #
#    ##
# #   #
#   # #
###   #
  #####`,
            'prb_9': `####
#  ####
# . . #
# BBX&#
##    #
 ######`,
            'prb_11': `#####
#&  ##
#.BX #
#  # #
#    #
######`,
            'prb_24': `  ######
###.&.# 
# BB#B##
#      #
### .  #
  # X  #
  ######`
        };
        
        this.init();
    }
    
    init() {
        this.populateLevelSelect();
        this.loadLevel(this.currentLevel);
        this.setupEventListeners();
        this.render();
    }

    populateLevelSelect() {
        this.levelSelect.innerHTML = '';
        Object.keys(this.levels).forEach(levelId => {
            const option = document.createElement('option');
            option.value = levelId;
            option.textContent = levelId.replace('prb_', 'Level ');
            this.levelSelect.appendChild(option);
        });
        this.levelSelect.value = this.currentLevel;
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            let action = null;
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    action = [-1, 0];
                    break;
                case 's':
                case 'arrowdown':
                    action = [1, 0];
                    break;
                case 'a':
                case 'arrowleft':
                    action = [0, -1];
                    break;
                case 'd':
                case 'arrowright':
                    action = [0, 1];
                    break;
                case 'r':
                    this.reset();
                    return;
            }
            
            if (action) {
                e.preventDefault();
                this.step(action);
            }
        });
        
        // UI controls
        this.resetButton.addEventListener('click', () => this.reset());
        this.levelSelect.addEventListener('change', (e) => {
            this.currentLevel = e.target.value;
            this.loadLevel(this.currentLevel);
        });
        
        // Click to dismiss win message
        this.winMessage.addEventListener('click', () => {
            this.winMessage.style.display = 'none';
        });
    }
    
    loadLevel(levelId) {
        const layoutStr = this.levels[levelId];
        this.board = this.layoutToBoard(layoutStr);
        this.reset();
    }
    
    layoutToBoard(layoutStr) {
        const lines = layoutStr.trim().split('\n');
        const maxWidth = Math.max(...lines.map(l => l.length));
        const paddedLines = lines.map(l => l.padEnd(maxWidth, '#'));
        
        return paddedLines.map(line => 
            line.split('').map(char => this.CHAR_TO_NUM[char] || 0)
        );
    }
    
    reset() {
        this.state = this.boardToState(this.board);
        this.gameOver = false;
        this.moves = 0;
        this.updateMoveCounter();
        this.winMessage.style.display = 'none';
        this.render();
    }
    
    boardToState(board) {
        // Create empty board map
        const emptyBoardMap = {
            0: 0, 1: 1, 2: 0, 3: 0, 4: 4, 5: 4
        };
        
        // Map the board using empty board map
        const sFix = board.map(row => 
            row.map(cell => emptyBoardMap[cell])
        );
        
        // Find player position
        let playerPos = null;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 2) {
                    playerPos = [i, j];
                    break;
                }
            }
            if (playerPos) break;
        }
        
        // Find box positions
        const boxPos = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 3 || board[i][j] === 5) {
                    boxPos.push([i, j]);
                }
            }
        }
        
        return [sFix, [playerPos, boxPos]];
    }
    
    isValidAction(state, action) {
        const [sFix, sFree] = state;
        const [playerPos, boxesPos] = sFree;
        const newPos = [playerPos[0] + action[0], playerPos[1] + action[1]];
        
        // Check bounds
        if (newPos[0] < 0 || newPos[0] >= sFix.length || 
            newPos[1] < 0 || newPos[1] >= sFix[0].length) {
            return false;
        }
        
        // Check if new position is a box (push action)
        const isBoxAtNewPos = boxesPos.some(box => 
            box[0] === newPos[0] && box[1] === newPos[1]
        );
        
        if (isBoxAtNewPos) {
            // Calculate new box position
            const newBoxPos = [newPos[0] + action[0], newPos[1] + action[1]];
            
            // Check bounds for new box position
            if (newBoxPos[0] < 0 || newBoxPos[0] >= sFix.length || 
                newBoxPos[1] < 0 || newBoxPos[1] >= sFix[0].length) {
                return false;
            }
            
            // Check if new box position is occupied by another box or wall
            const isAnotherBoxAtNewBoxPos = boxesPos.some(box => 
                box[0] === newBoxPos[0] && box[1] === newBoxPos[1]
            );
            
            if (isAnotherBoxAtNewBoxPos || sFix[newBoxPos[0]][newBoxPos[1]] === 1) {
                return false;
            }
        } else {
            // Just moving, check if new position is a wall
            if (sFix[newPos[0]][newPos[1]] === 1) {
                return false;
            }
        }
        
        return true;
    }
    
    step(action) {
        if (this.gameOver) return;
        
        if (this.isValidAction(this.state, action)) {
            // Create a copy of the state to modify
            const newState = [
                this.state[0].map(row => [...row]),
                [
                    [...this.state[1][0]],
                    this.state[1][1].map(box => [...box])
                ]
            ];
            
            this.executeStep(newState, action);
            this.state = newState;
            this.moves++;
            this.updateMoveCounter();
            
            // Check if game is solved
            this.gameOver = this.checkSolved(this.state);
            if (this.gameOver) {
                this.showWinMessage();
            }
            
            this.render();
        }
    }
    
    executeStep(state, action) {
        const [sFix, sFree] = state;
        const [playerPos, boxesPos] = sFree;
        const newPos = [playerPos[0] + action[0], playerPos[1] + action[1]];
        
        // Update player position
        state[1][0] = newPos;
        
        // Check if it's a push action
        const boxIndex = boxesPos.findIndex(box => 
            box[0] === newPos[0] && box[1] === newPos[1]
        );
        
        if (boxIndex !== -1) {
            // Move the box
            boxesPos[boxIndex] = [newPos[0] + action[0], newPos[1] + action[1]];
        }
    }
    
    checkSolved(state) {
        const [sFix, sFree] = state;
        const [playerPos, boxesPos] = sFree;
        
        // Get all target positions
        const targetPositions = [];
        for (let i = 0; i < sFix.length; i++) {
            for (let j = 0; j < sFix[i].length; j++) {
                if (sFix[i][j] === 4) {
                    targetPositions.push([i, j]);
                }
            }
        }
        
        // Check if all boxes are on targets
        return boxesPos.every(box => 
            targetPositions.some(target => 
                target[0] === box[0] && target[1] === box[1]
            )
        );
    }
    
    updateMoveCounter() {
        this.moveCounter.textContent = this.moves;
    }
    
    showWinMessage() {
        this.winMessage.style.display = 'block';
        setTimeout(() => {
            this.winMessage.style.display = 'none';
        }, 3000);
    }
    
    render() {
        const [sFix, sFree] = this.state;
        const [playerPos, boxesPos] = sFree;
        
        // Calculate canvas size based on board dimensions
        const boardHeight = sFix.length;
        const boardWidth = sFix[0].length;
        const canvasWidth = boardWidth * this.cellSize;
        const canvasHeight = boardHeight * this.cellSize;
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Colors
        const colors = {
            0: '#ecf0f1',  // floor - light gray
            1: '#95a5a6',  // wall - gray
            4: '#f39c12'   // target - orange
        };
        
        // Draw the fixed board (walls, floors, targets)
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                const cellType = sFix[i][j];
                const color = colors[cellType];
                
                if (color) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        j * this.cellSize,
                        i * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
                
                // Draw cell borders
                this.ctx.strokeStyle = '#bdc3c7';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(
                    j * this.cellSize,
                    i * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
                
                // Draw targets as circles
                if (cellType === 4) {
                    this.ctx.fillStyle = '#e67e22';
                    this.ctx.beginPath();
                    this.ctx.arc(
                        j * this.cellSize + this.cellSize / 2,
                        i * this.cellSize + this.cellSize / 2,
                        this.cellSize / 4,
                        0,
                        2 * Math.PI
                    );
                    this.ctx.fill();
                    this.ctx.strokeStyle = '#d35400';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw boxes
        boxesPos.forEach((box, index) => {
            const [i, j] = box;
            const isOnTarget = sFix[i][j] === 4;
            
            // Box color changes if on target
            this.ctx.fillStyle = isOnTarget ? '#27ae60' : '#3498db';
            this.ctx.fillRect(
                j * this.cellSize + 4,
                i * this.cellSize + 4,
                this.cellSize - 8,
                this.cellSize - 8
            );
            
            // Box border
            this.ctx.strokeStyle = isOnTarget ? '#229954' : '#2980b9';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                j * this.cellSize + 4,
                i * this.cellSize + 4,
                this.cellSize - 8,
                this.cellSize - 8
            );
            
            // Box number
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                index.toString(),
                j * this.cellSize + this.cellSize / 2,
                i * this.cellSize + this.cellSize / 2 + 4
            );
        });
        
        // Draw player
        const [pi, pj] = playerPos;
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(
            pj * this.cellSize + this.cellSize / 2,
            pi * this.cellSize + this.cellSize / 2,
            this.cellSize / 3,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
        
        // Player border
        this.ctx.strokeStyle = '#c0392b';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Player face
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            '☺',
            pj * this.cellSize + this.cellSize / 2,
            pi * this.cellSize + this.cellSize / 2 + 6
        );
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SokobanGame();
});
