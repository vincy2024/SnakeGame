// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

// 游戏参数
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 5; // 默认中等速度

// 蛇的初始位置和状态
let snake = [
    { x: 10, y: 10, color: 'lime' } // 初始蛇头颜色
];
let snakeColors = ['lime']; // 存储蛇身体每个部分的颜色
let velocityX = 0;
let velocityY = 0;
let nextVelocityX = 0;
let nextVelocityY = 0;

// 食物位置和颜色
let foodX = 5;
let foodY = 5;
let foodColor = 'red'; // 默认食物颜色

// 可用的食物颜色 - 彩虹色系
const foodColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

// 游戏状态
let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// 游戏主循环
function gameLoop() {
    if (gameRunning && !gamePaused) {
        updateGame();
        drawGame();
    }
    
    if (!gameOver) {
        setTimeout(gameLoop, 1000 / speed);
    }
}

// 更新游戏状态
function updateGame() {
    // 更新蛇的方向
    velocityX = nextVelocityX;
    velocityY = nextVelocityY;
    
    // 移动蛇
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    snake.unshift(head);
    
    // 检测是否吃到食物
    if (head.x === foodX && head.y === foodY) {
        // 将食物颜色添加到颜色数组的开头（对应新的头部）
        snakeColors.unshift('lime'); // 蛇头始终为绿色
        // 将食物颜色添加到颜色数组的末尾
        snakeColors.push(foodColor);
        
        // 增加分数
        score += 10;
        scoreElement.textContent = score;
        
        // 更新最高分
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // 生成新的食物
        generateFood();
        
        // 每得50分增加速度
        if (score % 50 === 0) {
            speed += 1;
        }
    } else {
        // 如果没吃到食物，移除尾部和对应的颜色
        snake.pop();
        snakeColors.pop();
        // 确保蛇头颜色始终为绿色
        snakeColors[0] = 'lime';
    }
    
    // 检测游戏结束条件
    checkGameOver();
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格
    drawGrid();
    
    // 绘制食物
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        // 使用颜色数组中的颜色
        ctx.fillStyle = snakeColors[index] || 'lime';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        
        // 绘制蛇身体的边框
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // 统一使用半透明黑色边框
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
    
    // 游戏结束显示
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '20px Arial';
        ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
}

// 生成食物
function generateFood() {
    // 随机生成食物位置
    function getRandomPosition() {
        return Math.floor(Math.random() * tileCount);
    }
    
    // 随机选择食物颜色
    foodColor = foodColors[Math.floor(Math.random() * foodColors.length)];
    
    // 确保食物不会生成在蛇身上
    let newFoodPosition = false;
    while (!newFoodPosition) {
        foodX = getRandomPosition();
        foodY = getRandomPosition();
        
        // 检查是否与蛇身重叠
        newFoodPosition = true;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === foodX && snake[i].y === foodY) {
                newFoodPosition = false;
                break;
            }
        }
    }
}

// 检测游戏结束
function checkGameOver() {
    // 撞墙
    if (
        snake[0].x < 0 ||
        snake[0].x >= tileCount ||
        snake[0].y < 0 ||
        snake[0].y >= tileCount
    ) {
        endGame();
        return;
    }
    
    // 撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            endGame();
            return;
        }
    }
}

// 游戏结束
function endGame() {
    gameOver = true;
    gameRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// 开始游戏
function startGame() {
    if (!gameRunning) {
        // 重置游戏状态
        if (gameOver) {
            resetGame();
        }
        
        gameRunning = true;
        gamePaused = false;
        gameOver = false;
        
        // 设置初始方向（向右）
        nextVelocityX = 1;
        nextVelocityY = 0;
        
        // 更新按钮状态
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        // 开始游戏循环
        gameLoop();
    }
}

// 暂停游戏
function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? '继续' : '暂停';
    }
}

// 重置游戏
function resetGame() {
    // 重置蛇和颜色数组
    snake = [{ x: 10, y: 10 }];
    snakeColors = ['lime']; // 重置颜色数组，蛇头为绿色
    
    velocityX = 0;
    velocityY = 0;
    nextVelocityX = 0;
    nextVelocityY = 0;
    score = 0;
    scoreElement.textContent = score;
    speed = parseInt(speedSlider.value);
    gameOver = false;
    gamePaused = false;
    generateFood();
    
    // 更新按钮状态
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = '暂停';
}

// 键盘控制
function changeDirection(e) {
    // 防止反向移动
    const preventReverse = (newX, newY) => {
        return (newX === 0 && velocityX === 0) || 
               (newY === 0 && velocityY === 0) || 
               (newX !== -velocityX || newY !== -velocityY);
    };
    
    // 方向键控制
    switch (e.key) {
        case 'ArrowUp':
            if (preventReverse(0, -1)) {
                nextVelocityX = 0;
                nextVelocityY = -1;
            }
            break;
        case 'ArrowDown':
            if (preventReverse(0, 1)) {
                nextVelocityX = 0;
                nextVelocityY = 1;
            }
            break;
        case 'ArrowLeft':
            if (preventReverse(-1, 0)) {
                nextVelocityX = -1;
                nextVelocityY = 0;
            }
            break;
        case 'ArrowRight':
            if (preventReverse(1, 0)) {
                nextVelocityX = 1;
                nextVelocityY = 0;
            }
            break;
    }
}

// 绘制网格
function drawGrid() {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    
    // 绘制垂直线
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    
    // 绘制水平线
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// 速度控制功能
function updateSpeedDisplay() {
    let speedText = '';
    const speedValue = parseInt(speedSlider.value);
    
    if (speedValue <= 2) {
        speedText = '非常慢';
    } else if (speedValue <= 4) {
        speedText = '慢';
    } else if (speedValue <= 6) {
        speedText = '中等';
    } else if (speedValue <= 8) {
        speedText = '快';
    } else {
        speedText = '非常快';
    }
    
    document.getElementById('speedValue').textContent = speedText;
    speed = speedValue;
}

// 事件监听
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', changeDirection);
speedSlider.addEventListener('input', updateSpeedDisplay);

// 初始化
pauseBtn.disabled = true;
generateFood();
updateSpeedDisplay(); // 初始化速度显示
drawGame();