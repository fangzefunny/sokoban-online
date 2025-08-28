// Sokoban Web Game
// Based on the Python implementation from env.py

class SokobanGame {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 24;
        this.moves = 0;
        this.gameComplete = false;
        this.levelComplete = false;
        
        // Character mappings from the Python implementation
        this.charToNum = {
            ' ': 0,  // floor
            '#': 1,  // wall
            '&': 2,  // player
            'B': 3,  // box
            '.': 4,  // target
            'X': 5   // box on target
        };
        
        // Action mappings
        this.actions = {
            'ArrowUp': [-1, 0],
            'ArrowDown': [1, 0],
            'ArrowLeft': [0, -1],
            'ArrowRight': [0, 1],
            'w': [-1, 0],
            's': [1, 0],
            'a': [0, -1],
            'd': [0, 1],
            'W': [-1, 0],
            'S': [1, 0],
            'A': [0, -1],
            'D': [0, 1]
        };
        
        // All level data embedded directly
        this.levels = {
            1: `######
#.  .#
#    #
# BB #
#&   #
######`,
            2: `######
#.  .#
#    #
#B  B#
#&   #
######`,
            3: ` ######
#.B&  #
###   #
#.##  #
# #   ##
#B XB  #
#   .  #
########`,
            4: `##########
#    &   #
#  B  .  #
#        #
##########`,
            5: `###########
#         #
#         #
#  . . .  #
#    B    #
#    B    #
#    B    #
#         #
#    &    #
#         #
###########`,
            6: `#######
# .   #
# # # #
# # # #
# B&  #
#     #
#######`,
            7: `########
#  . . #
#    # #
## # # #
 #  B  #
 #  B& #
 #     #
 #######`,
            8: `  ######
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
            9: `####
#  ####
# . . #
# BBX&#
##    #
 ######`,
            10: `####
# .#
#  ###
#X&  #
#  B #
#  ###
####`,
            11: `#####
#&  ##
#.BX #
#  # #
#    #
######`,
            12: `######
#&   ##
# BB  #
# #. .#
#     #
#######`,
            13: `  ####
###  #
#& .B##
#   B #
# #.  #
#     #
#######`,
            14: `########
#      #
# .XXB&#
#      #
#####  #
   ####`,
            15: `  #####
###   #
#.&B  #
### B.#
#.##B #
# # . ##
#B XBB.#
#   .  #
########`,
            16: `    #####
    #   #
    #B  #
  ###  B###
  #  B  B #
### # ### #     ######
#   # ### #######  ..#
# B  B             ..#
##### #### #&####  ..#
    #      ###  ######
    ########`,
            17: `############
#..  #     ###
#..  # B  B  #
#..  #B####  #
#..    & ##  #
#..  # #  B ##
###### ##B B #
  # B  B B B #
  #    #     #
  ############`,
            18: `####
#  #########
#    ##    #
# BBB#     #
##...# #BBB#
 #...# #...#
 #BBB  #...##
 #    ##BBB #
 ####### &  #
       ######`,
            19: ` #########
 #   X   #
 # ## ## #
 #  X X  #
###  #  ###
#  .B#B.  #
# #  &  # #
#  .B#B.  #
###  #  ###
  #######`,
            20: `##########
#&  #.   #
#.# # ## #
# B  B  .#
#B###B## #
#      #B#
# B   ...#
##########`,
            21: ` ## #####
## ## . #
# ## B. #
 ## B   #
## B& ###
# B  ##  
#.. ## ##
#   # ## 
##### #`,
            22: `#########
#&      #
#       #
# BBB...#
#    ####
#    ####
#########`,
            23: `##########
#&  #.   #
#.# # ## #
# B  B  .#
#B###B## #
#      #B#
# B   ...#
##########`,
            24: `  ##### 
###.&.# 
# BB#B##
#      #
### .  #
  # X  #
  #####`
        };
        
        this.currentState = null;
        this.initialState = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateLevelSelector();
        this.loadLevel(1);
    }
    
    populateLevelSelector() {
        const selector = document.getElementById('level-selector');
        selector.innerHTML = '';
        
        for (let i = 1; i <= this.maxLevel; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Level ${i}`;
            selector.appendChild(option);
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            if (this.actions[event.key]) {
                event.preventDefault();
                this.handleMove(this.actions[event.key]);
            } else if (event.key === 'r' || event.key === 'R') {
                event.preventDefault();
                this.resetLevel();
            }
        });
        
        // Button controls
        document.getElementById('level-selector').addEventListener('change', (event) => {
            this.selectLevel(parseInt(event.target.value));
        });
        
        document.getElementById('prev-level').addEventListener('click', () => {
            this.previousLevel();
        });
        
        document.getElementById('next-level').addEventListener('click', () => {
            this.nextLevel();
        });
        
        document.getElementById('reset-level').addEventListener('click', () => {
            this.resetLevel();
        });
        
        // Next level button in completion message
        document.addEventListener('click', (event) => {
            if (event.target.id === 'next-level-btn') {
                this.nextLevel();
            }
        });
    }
    
    layoutToBoard(layoutStr) {
        const lines = layoutStr.split('\n').filter(line => line.length > 0);
        const maxWidth = Math.max(...lines.map(line => line.length));
        
        // Pad lines to max width with walls (like Python implementation)
        const paddedLines = lines.map(line => line.padEnd(maxWidth, '#'));
        
        return paddedLines.map(line => 
            line.split('').map(char => this.charToNum[char] || 0)
        );
    }
    
    boardToState(board) {
        // Create fixed board (walls, floors, targets)
        const fixedBoard = board.map(row => 
            row.map(cell => {
                switch(cell) {
                    case 0: return 0; // floor
                    case 1: return 1; // wall
                    case 2: return 0; // player -> floor
                    case 3: return 0; // box -> floor
                    case 4: return 4; // target
                    case 5: return 4; // box on target -> target
                    default: return 0;
                }
            })
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
        const boxPositions = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 3 || board[i][j] === 5) {
                    boxPositions.push([i, j]);
                }
            }
        }
        
        return {
            fixed: fixedBoard,
            player: playerPos,
            boxes: boxPositions
        };
    }
    
    loadLevel(levelNum) {
        if (levelNum < 1 || levelNum > this.maxLevel || !this.levels[levelNum]) {
            return;
        }
        
        this.currentLevel = levelNum;
        this.moves = 0;
        this.levelComplete = false;
        this.gameComplete = false;
        
        const board = this.layoutToBoard(this.levels[levelNum]);
        this.currentState = this.boardToState(board);
        this.initialState = JSON.parse(JSON.stringify(this.currentState));
        
        this.updateUI();
        this.renderBoard();
    }
    
    resetLevel() {
        this.currentState = JSON.parse(JSON.stringify(this.initialState));
        this.moves = 0;
        this.levelComplete = false;
        this.updateUI();
        this.renderBoard();
    }
    
    isValidAction(state, action) {
        const [dy, dx] = action;
        const [playerY, playerX] = state.player;
        const newY = playerY + dy;
        const newX = playerX + dx;
        
        // Check bounds
        if (newY < 0 || newY >= state.fixed.length || 
            newX < 0 || newX >= state.fixed[0].length) {
            return false;
        }
        
        // Check if new position is a wall
        if (state.fixed[newY][newX] === 1) {
            return false;
        }
        
        // Check if new position has a box
        const boxAtNewPos = state.boxes.find(box => box[0] === newY && box[1] === newX);
        if (boxAtNewPos) {
            // Check if box can be pushed
            const newBoxY = newY + dy;
            const newBoxX = newX + dx;
            
            // Check bounds for box
            if (newBoxY < 0 || newBoxY >= state.fixed.length || 
                newBoxX < 0 || newBoxX >= state.fixed[0].length) {
                return false;
            }
            
            // Check if box destination is wall
            if (state.fixed[newBoxY][newBoxX] === 1) {
                return false;
            }
            
            // Check if there's another box at box destination
            const boxAtBoxDest = state.boxes.find(box => box[0] === newBoxY && box[1] === newBoxX);
            if (boxAtBoxDest) {
                return false;
            }
        }
        
        return true;
    }
    
    handleMove(action) {
        if (this.levelComplete || !this.isValidAction(this.currentState, action)) {
            return;
        }
        
        const [dy, dx] = action;
        const [playerY, playerX] = this.currentState.player;
        const newY = playerY + dy;
        const newX = playerX + dx;
        
        // Check if pushing a box
        const boxIndex = this.currentState.boxes.findIndex(box => box[0] === newY && box[1] === newX);
        if (boxIndex !== -1) {
            // Move the box
            this.currentState.boxes[boxIndex] = [newY + dy, newX + dx];
        }
        
        // Move the player
        this.currentState.player = [newY, newX];
        this.moves++;
        
        // Check if level is complete
        if (this.checkSolved()) {
            this.levelComplete = true;
            if (this.currentLevel === this.maxLevel) {
                this.gameComplete = true;
            }
            this.showCompletionMessage();
        }
        
        this.updateUI();
        this.renderBoard();
    }
    
    checkSolved() {
        // Get all target positions
        const targets = [];
        for (let i = 0; i < this.currentState.fixed.length; i++) {
            for (let j = 0; j < this.currentState.fixed[i].length; j++) {
                if (this.currentState.fixed[i][j] === 4) {
                    targets.push([i, j]);
                }
            }
        }
        
        // Check if all boxes are on targets
        return this.currentState.boxes.every(box => 
            targets.some(target => target[0] === box[0] && target[1] === box[1])
        );
    }
    
    showCompletionMessage() {
        const levelCompleteDiv = document.getElementById('level-complete');
        const gameCompleteDiv = document.getElementById('game-complete');
        
        if (this.gameComplete) {
            gameCompleteDiv.style.display = 'block';
            setTimeout(() => {
                gameCompleteDiv.style.display = 'none';
            }, 5000);
        } else if (this.levelComplete) {
            levelCompleteDiv.style.display = 'block';
            // Message stays visible until button is clicked
        }
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        const board = this.currentState.fixed;
        const cols = board[0].length;
        
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                // Determine cell type and content
                const cellType = board[i][j];
                const isPlayer = this.currentState.player[0] === i && this.currentState.player[1] === j;
                const boxAtPos = this.currentState.boxes.find(box => box[0] === i && box[1] === j);
                const isTarget = cellType === 4;
                
                if (cellType === 1) {
                    // Wall
                    cell.classList.add('wall');
                } else if (isPlayer) {
                    // Player
                    cell.classList.add('player');
                    if (isTarget) {
                        cell.classList.add('target');
                    } else {
                        cell.classList.add('floor');
                    }
                    // Create player indicator (star)
                    const playerIndicator = document.createElement('div');
                    playerIndicator.textContent = '★';
                    playerIndicator.style.cssText = `
                        color: red;
                        font-size: 24px;
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    `;
                    cell.appendChild(playerIndicator);
                } else if (boxAtPos) {
                    // Box
                    if (isTarget) {
                        cell.classList.add('box-on-target');
                    } else {
                        cell.classList.add('box');
                    }
                } else if (isTarget) {
                    // Target
                    cell.classList.add('target');
                } else {
                    // Floor
                    cell.classList.add('floor');
                }
                
                gameBoard.appendChild(cell);
            }
        }
    }
    
    updateUI() {
        document.getElementById('current-level').textContent = this.currentLevel;
        document.getElementById('move-count').textContent = this.moves;
        document.getElementById('final-moves').textContent = this.moves;
        
        // Update level selector
        document.getElementById('level-selector').value = this.currentLevel;
        
        // Update button states
        document.getElementById('prev-level').disabled = this.currentLevel <= 1;
        document.getElementById('next-level').disabled = this.currentLevel >= this.maxLevel;
        
        // Only hide completion messages if level is not complete
        if (!this.levelComplete && !this.gameComplete) {
            document.getElementById('level-complete').style.display = 'none';
            document.getElementById('game-complete').style.display = 'none';
        }
    }
    
    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            // Hide completion message
            document.getElementById('level-complete').style.display = 'none';
            this.loadLevel(this.currentLevel + 1);
        }
    }
    
    previousLevel() {
        if (this.currentLevel > 1) {
            this.loadLevel(this.currentLevel - 1);
        }
    }
    
    selectLevel(levelNum) {
        const level = parseInt(levelNum);
        if (level >= 1 && level <= this.maxLevel) {
            this.loadLevel(level);
        }
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new SokobanGame();
});

// Make game available globally for button onclick handlers
window.game = game;