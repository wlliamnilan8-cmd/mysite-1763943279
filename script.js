// PornDash Pixel Paradise - Main Game Script

class PornDashGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.player = {
            x: 50,
            y: 200,
            width: 30,
            height: 30,
            speed: 5,
            color: '#ec4899'
        };
        this.levels = {
            1: { name: "Início Sensual", difficulty: "Fácil", timeLimit: 60 },
            2: { name: "Fantasias Quentes", difficulty: "Médio", timeLimit: 45 },
            3: { name: "Noites Eróticas", difficulty: "Difícil", timeLimit: 30 },
            4: { name: "Desejos Proibidos", difficulty: "Expert", timeLimit: 25 },
            5: { name: "Paraíso Proibido", difficulty: "Mestre", timeLimit: 20 }
        };
        this.obstacles = [];
        this.collectibles = [];
        this.keys = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.gameLoop();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Level selection
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLevel(parseInt(e.target.dataset.level));
            });
        });

        // Game controls
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // Mobile controls
        document.querySelectorAll('.control-btn').forEach((btn, index) => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const directions = ['ArrowLeft', 'ArrowUp', 'ArrowRight'];
                this.keys[directions[index]] = true;
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const directions = ['ArrowLeft', 'ArrowUp', 'ArrowRight'];
                this.keys[directions[index]] = false;
            });
        });
    }

    setupCanvas() {
        // Set canvas dimensions
        this.canvas.width = 800;
        this.canvas.height = 400;
    }

    selectLevel(level) {
        if (level >= 1 && level <= 5) {
            this.currentLevel = level;
            this.updateUI();
            this.showNotification(`Nível ${level} selecionado: ${this.levels[level].name}`);
        }
    }

    startGame() {
        if (this.gameState === 'menu' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.resetLevel();
            this.showNotification(`Nível ${this.currentLevel} iniciado! Boa sorte!`);
        }
    }

    resetGame() {
        this.gameState = 'menu';
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.updateUI();
        this.showNotification("Jogo resetado!");
    }

    resetLevel() {
        this.player.x = 50;
        this.player.y = 200;
        this.generateObstacles();
        this.generateCollectibles();
    }

    generateObstacles() {
        this.obstacles = [];
        const obstacleCount = 3 + this.currentLevel * 2;
        
        for (let i = 0; i < obstacleCount; i++) {
            this.obstacles.push({
                x: 200 + i * 150,
                y: Math.random() * (this.canvas.height - 50),
                width: 40,
                height: 40,
                color: '#ef4444',
                speed: 1 + this.currentLevel * 0.5
            });
        }
    }

    generateCollectibles() {
        this.collectibles = [];
        const collectibleCount = 5 + this.currentLevel;
        
        for (let i = 0; i < collectibleCount; i++) {
            this.collectibles.push({
                x: 300 + i * 100,
                y: Math.random() * (this.canvas.height - 30),
                width: 20,
                height: 20,
                color: '#10b981',
                collected: false
            });
        }
    }

    updatePlayer() {
        // Movement
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
    }

    updateObstacles() {
        this.obstacles.forEach(obstacle => {
            obstacle.x -= obstacle.speed;
            if (obstacle.x + obstacle.width < 0) {
                obstacle.x = this.canvas.width;
                obstacle.y = Math.random() * (this.canvas.height - 50);
            }

            // Collision detection
            if (this.checkCollision(this.player, obstacle)) {
                this.handleObstacleCollision();
            }
        });
    }

    updateCollectibles() {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected && this.checkCollision(this.player, collectible)) {
                collectible.collected = true;
                this.score += 100 * this.currentLevel;
                this.createParticles(collectible.x, collectible.y, '#10b981');
                this.updateUI();
            }
        });
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    handleObstacleCollision() {
        this.lives--;
        this.createParticles(this.player.x, this.player.y, '#ef4444');
        this.updateUI();

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.player.x = 50;
            this.player.y = 200;
            this.showNotification(`Colisão! ${this.lives} vidas restantes!`);
        }
    }

    checkLevelComplete() {
        const allCollected = this.collectibles.every(c => c.collected);
        if (allCollected) {
            this.levelComplete();
        }
    }

    levelComplete() {
        this.score += 500 * this.currentLevel;
        this.showNotification(`Nível ${this.currentLevel} completo! Próximo nível!`);
        
        if (this.currentLevel < 5) {
            this.currentLevel++;
            this.resetLevel();
        } else {
            this.gameWin();
        }
        this.updateUI();
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.showGameOverModal();
    }

    gameWin() {
        this.gameState = 'gameOver';
        this.showGameWinModal();
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background pattern
        this.drawBackground();

        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Draw collectibles
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                this.ctx.fillStyle = collectible.color;
                this.ctx.beginPath();
                this.ctx.arc(collectible.x + 10, collectible.y + 10, 10, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // Draw HUD
        this.drawHUD();
    }

    drawBackground() {
        // Create a subtle grid pattern
        this.ctx.strokeStyle = 'rgba(236, 72, 153, 0.1)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawHUD() {
        // Score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Pontuação: ${this.score}`, 10, 25);

        // Lives
        this.ctx.fillText(`Vidas: ${this.lives}`, 10, 45);

        // Level info
        this.ctx.fillText(`Nível ${this.currentLevel}: ${this.levels[this.currentLevel].name}`, 10, 65);
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--tx', `${Math.random() * 100 - 50}px`);
            particle.style.setProperty('--ty', `${Math.random() * 100 - 50}px`);
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50';
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showGameOverModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3 class="text-2xl font-bold text-red-400 mb-4">Game Over!</h3>
                <p class="text-gray-300 mb-4">Pontuação final: ${this.score}</p>
                <button class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg mr-2" onclick="this.closest('.modal-overlay').remove(); game.resetGame()">
                    Jogar Novamente
                </button>
                <button class="bg-gray-600 text-white px-6 py-2 rounded-lg" onclick="this.closest('.modal-overlay').remove()">
                    Fechar
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showGameWinModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3 class="text-2xl font-bold text-green-400 mb-4">Parabéns!</h3>
                <p class="text-gray-300 mb-2">Você completou todos os 5 níveis!</p>
                <p class="text-gray-300 mb-4">Pontuação final: ${this.score}</p>
                <div class="achievement-badge mx-auto mb-4">
                    <i data-feather="award"></i>
                </div>
                <button class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg mr-2" onclick="this.closest('.modal-overlay').remove(); game.resetGame()">
                    Jogar Novamente
                </button>
                <button class="bg-gray-600 text-white px-6 py-2 rounded-lg" onclick="this.closest('.modal-overlay').remove()">
                    Fechar
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        feather.replace();
    }

    updateUI() {
        // Update score display
        document.querySelector('.bg-purple-900\\/50 .text-2xl').textContent = this.score;
        
        // Update lives display
        document.querySelector('.bg-red-900\\/50 .text-2xl').textContent = this.lives;
        
        // Update current level indicator
        document.querySelectorAll('.level-btn').forEach((btn, index) => {
            const level = index + 1;
            if (level === this.currentLevel) {
                btn.classList.add('ring-2', 'ring-white', 'ring-opacity-50');
            } else {
                btn.classList.remove('ring-2', 'ring-white', 'ring-opacity-50');
            }
        });
    }

    gameLoop() {
        if (this.gameState === 'playing') {
            this.updatePlayer();
            this.updateObstacles();
            this.updateCollectibles();
            this.checkLevelComplete();
        }

        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is loaded
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new PornDashGame();
});