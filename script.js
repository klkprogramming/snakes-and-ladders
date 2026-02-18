// ============================================================
// GAME CONFIGURATION
// ============================================================
const BOARD_SIZE = 10;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

const SNAKES = {
    16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80
};

const LADDERS = {
    2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98
};

const PLAYER_COLORS = [
    '#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#ff8787', '#845ef7'
];

const PLAYER_EMOJIS = ['🦁', '🐸', '🦊', '🐵', '🐰', '🐱'];

const SNAKE_THEMES = [
    { body: '#22c55e', dark: '#15803d', belly: '#86efac', pattern: '#166534' },
    { body: '#a855f7', dark: '#7e22ce', belly: '#d8b4fe', pattern: '#581c87' },
    { body: '#ef4444', dark: '#b91c1c', belly: '#fca5a5', pattern: '#7f1d1d' },
    { body: '#f97316', dark: '#c2410c', belly: '#fdba74', pattern: '#7c2d12' },
    { body: '#3b82f6', dark: '#1d4ed8', belly: '#93c5fd', pattern: '#1e3a5f' },
    { body: '#ec4899', dark: '#be185d', belly: '#f9a8d4', pattern: '#831843' },
    { body: '#14b8a6', dark: '#0f766e', belly: '#5eead4', pattern: '#134e4a' },
    { body: '#eab308', dark: '#a16207', belly: '#fde047', pattern: '#713f12' },
    { body: '#8b5cf6', dark: '#6d28d9', belly: '#c4b5fd', pattern: '#4c1d95' },
    { body: '#06b6d4', dark: '#0e7490', belly: '#67e8f9', pattern: '#155e75' },
];

const LADDER_THEMES = [
    { side: '#92400e', rung: '#b45309', highlight: '#d97706', shadow: '#78350f' },
    { side: '#854d0e', rung: '#a16207', highlight: '#ca8a04', shadow: '#713f12' },
    { side: '#7c2d12', rung: '#9a3412', highlight: '#c2410c', shadow: '#611a09' },
    { side: '#6b4423', rung: '#8b5e3c', highlight: '#a67c5b', shadow: '#4a2f16' },
    { side: '#78350f', rung: '#92400e', highlight: '#b45309', shadow: '#5c2d0e' },
    { side: '#965028', rung: '#b06838', highlight: '#c88450', shadow: '#6e3a1c' },
    { side: '#6d4c41', rung: '#8d6e63', highlight: '#a1887f', shadow: '#4e342e' },
    { side: '#5d4037', rung: '#795548', highlight: '#8d6e63', shadow: '#3e2723' },
    { side: '#a0522d', rung: '#cd853f', highlight: '#deb887', shadow: '#8b4513' },
    { side: '#8b6914', rung: '#b8860b', highlight: '#daa520', shadow: '#6b5200' },
];

const CELL_COLORS = [
    '#ede9fe', '#dbeafe', '#d1fae5', '#fce7f3',
    '#e0e7ff', '#cffafe', '#f3e8ff', '#fce4ec',
    '#e8eaf6', '#dcedc8', '#e1f5fe', '#f3e5f5'
];

const DICE_PATTERNS = {
    1: [false, false, false, false, true, false, false, false, false],
    2: [false, false, true, false, false, false, true, false, false],
    3: [false, false, true, false, true, false, true, false, false],
    4: [true, false, true, false, false, false, true, false, true],
    5: [true, false, true, false, true, false, true, false, true],
    6: [true, false, true, true, false, true, true, false, true],
};

const POWERUP_CELLS = [10, 30, 45, 57, 73, 90];

const POWERUP_TYPES = [
    { id: 'double', name: 'Double Roll', emoji: '⚡', description: 'Next roll is doubled!', instant: false },
    { id: 'shield', name: 'Snake Shield', emoji: '🛡️', description: 'Blocks the next snake!', instant: false },
    { id: 'boost', name: 'Rocket Boost', emoji: '🚀', description: 'Jump 5 extra spaces!', instant: true },
    { id: 'extra', name: 'Extra Turn', emoji: '🎯', description: 'Roll again!', instant: true },
];

// ============================================================
// AUDIO SYSTEM
// ============================================================
let audioContext;
let sounds = {};

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createSounds();
    } catch (e) {
        console.warn('Audio not supported:', e);
    }
}

function createSounds() {
    if (!audioContext) return;

    sounds.diceRoll = () => {
        for (let i = 0; i < 4; i++) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = 150 + Math.random() * 200;
            osc.type = 'square';
            const t = audioContext.currentTime + i * 0.05;
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
            osc.start(t);
            osc.stop(t + 0.05);
        }
    };

    sounds.move = () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 500 + Math.random() * 200;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.12, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.1);
    };

    sounds.snake = () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(400, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.6);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.25, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.6);
    };

    sounds.ladder = () => {
        const notes = [300, 400, 500, 600, 700];
        notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            const t = audioContext.currentTime + i * 0.08;
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
            osc.start(t);
            osc.stop(t + 0.12);
        });
    };

    sounds.powerup = () => {
        const notes = [600, 800, 1000, 1200];
        notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            const t = audioContext.currentTime + i * 0.06;
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            osc.start(t);
            osc.stop(t + 0.15);
        });
    };

    sounds.shield = () => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(300, audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(300, audioContext.currentTime + 0.3);
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.25, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.4);
    };

    sounds.win = () => {
        const melody = [523, 587, 659, 784, 880, 1047];
        melody.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            const t = audioContext.currentTime + i * 0.12;
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.3);
        });
    };
}

// ============================================================
// GAME STATE
// ============================================================
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    gameWon: false
};

let drawerOpen = false;

// ============================================================
// INITIALIZATION
// ============================================================
function initGame() {
    createBoard();
    updateUI();
    initAudio();

    document.getElementById('roll-dice').addEventListener('click', rollDice);
    document.getElementById('reset-game').addEventListener('click', resetGame);
    document.getElementById('add-player').addEventListener('click', addPlayer);

    // Mobile bar buttons
    const mobileRollBtn = document.getElementById('mobile-roll-btn');
    if (mobileRollBtn) mobileRollBtn.addEventListener('click', rollDice);

    const mobileResetBtn = document.getElementById('mobile-reset-btn');
    if (mobileResetBtn) mobileResetBtn.addEventListener('click', resetGame);

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);

    // Drawer buttons
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

    const drawerOverlay = document.getElementById('drawer-overlay');
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    const drawerAddPlayer = document.getElementById('drawer-add-player');
    if (drawerAddPlayer) drawerAddPlayer.addEventListener('click', () => { addPlayer(); updateDrawerPlayers(); });

    const drawerReset = document.getElementById('drawer-reset');
    if (drawerReset) drawerReset.addEventListener('click', () => { closeDrawer(); resetGame(); });

    // Tapping the dice also rolls
    document.getElementById('dice').addEventListener('click', rollDice);

    addPlayer();
    addPlayer();
}

// ============================================================
// MOBILE DRAWER
// ============================================================
function openDrawer() {
    drawerOpen = true;
    updateDrawerPlayers();
    updateDrawerLog();
    document.getElementById('drawer-panel').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawerOpen = false;
    document.getElementById('drawer-panel').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function updateDrawerPlayers() {
    const container = document.getElementById('drawer-players');
    if (!container) return;
    container.innerHTML = '';

    gameState.players.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'drawer-player-item';
        if (index === gameState.currentPlayerIndex && gameState.gameStarted) {
            item.classList.add('active');
        }
        item.style.borderLeftColor = player.color;
        const badgeHtml = player.powerup ? `<span class="powerup-badge">${player.powerup.emoji}</span>` : '';
        item.innerHTML = `
            <span class="drawer-player-emoji">${player.emoji}</span>
            <div class="drawer-player-info">
                <div class="drawer-player-name">${player.name} ${badgeHtml}</div>
                <div class="drawer-player-pos">Position: ${player.position === 0 ? 'Start' : player.position}${player.powerup ? ` · ${player.powerup.name}` : ''}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function updateDrawerLog() {
    const drawerLog = document.getElementById('drawer-log');
    const mainLog = document.getElementById('log');
    if (!drawerLog || !mainLog) return;
    drawerLog.innerHTML = mainLog.innerHTML;
}

// ============================================================
// BOARD CREATION
// ============================================================
function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        const isReverse = row % 2 === (BOARD_SIZE - 1) % 2;
        const start = isReverse ? BOARD_SIZE - 1 : 0;
        const end = isReverse ? -1 : BOARD_SIZE;
        const step = isReverse ? -1 : 1;

        for (let col = start; col !== end; col += step) {
            const cellNumber = row * BOARD_SIZE + col + 1;
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.cellNumber = cellNumber;
            cell.dataset.row = row;
            cell.dataset.col = col;

            const visualRow = BOARD_SIZE - 1 - row;
            const colorIndex = (visualRow + col) % CELL_COLORS.length;
            cell.style.background = CELL_COLORS[colorIndex];

            const numberSpan = document.createElement('span');
            numberSpan.className = 'cell-number';
            numberSpan.textContent = cellNumber;
            cell.appendChild(numberSpan);

            if (cellNumber === 1) {
                cell.classList.add('start');
            } else if (cellNumber === TOTAL_CELLS) {
                cell.classList.add('end');
            } else if (SNAKES[cellNumber]) {
                cell.classList.add('snake-start');
                cell.title = `Snake! Slides to ${SNAKES[cellNumber]}`;
                const icon = document.createElement('span');
                icon.className = 'cell-icon';
                icon.textContent = '🐍';
                cell.appendChild(icon);
            } else if (Object.values(SNAKES).includes(cellNumber)) {
                cell.classList.add('snake-end');
            } else if (LADDERS[cellNumber]) {
                cell.classList.add('ladder-start');
                cell.title = `Ladder! Climbs to ${LADDERS[cellNumber]}`;
                const icon = document.createElement('span');
                icon.className = 'cell-icon';
                icon.textContent = '⬆️';
                cell.appendChild(icon);
            } else if (Object.values(LADDERS).includes(cellNumber)) {
                cell.classList.add('ladder-end');
            } else if (POWERUP_CELLS.includes(cellNumber)) {
                cell.classList.add('powerup-cell');
                cell.title = 'Power-up! Land here for a special power!';
                const icon = document.createElement('span');
                icon.className = 'cell-icon powerup-icon';
                icon.textContent = '⭐';
                cell.appendChild(icon);
            }

            const delay = ((BOARD_SIZE - 1 - row) * BOARD_SIZE + Math.abs(col - (isReverse ? BOARD_SIZE - 1 : 0))) * 15;
            cell.classList.add('animate-in');
            cell.style.animationDelay = `${delay}ms`;

            board.appendChild(cell);
        }
    }

    setTimeout(() => drawSnakesAndLadders(), 100);
}

// ============================================================
// SNAKE & LADDER SVG DRAWING
// ============================================================
function drawSnakesAndLadders() {
    const board = document.getElementById('game-board');
    const existing = board.querySelector('.snakes-ladders-overlay');
    if (existing) existing.remove();

    setTimeout(() => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'snakes-ladders-overlay');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '3';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.appendChild(defs);

        Object.entries(LADDERS).forEach(([start, end], index) => {
            const startPos = getCellPosition(parseInt(start));
            const endPos = getCellPosition(parseInt(end));
            const theme = LADDER_THEMES[index % LADDER_THEMES.length];
            drawLadder(svg, defs, startPos, endPos, theme, index);
        });

        Object.entries(SNAKES).forEach(([start, end], index) => {
            const startPos = getCellPosition(parseInt(start));
            const endPos = getCellPosition(parseInt(end));
            const theme = SNAKE_THEMES[index % SNAKE_THEMES.length];
            drawSnake(svg, defs, startPos, endPos, theme, index);
        });

        board.appendChild(svg);
    }, 80);
}

function generateSnakeBodyPath(sx, sy, ex, ey) {
    const dx = ex - sx;
    const dy = ey - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1) {
        return {
            pathData: `M ${sx} ${sy} L ${ex} ${ey}`,
            points: [{ x: sx, y: sy }, { x: ex, y: ey }]
        };
    }

    const nx = -dy / dist;
    const ny = dx / dist;
    const numWaves = Math.max(1.5, dist / 12);
    const maxAmp = Math.min(4.5, dist * 0.18);
    const numPoints = 50;
    const points = [];

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const bx = sx + dx * t;
        const by = sy + dy * t;
        const phase = t * Math.PI * 2 * numWaves;
        const envelope = Math.sin(t * Math.PI);
        const amp = maxAmp * (0.15 + 0.85 * envelope);
        const offset = Math.sin(phase) * amp;

        points.push({
            x: bx + nx * offset,
            y: by + ny * offset
        });
    }

    let pathData = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];

        const tension = 6;
        const cp1x = p1.x + (p2.x - p0.x) / tension;
        const cp1y = p1.y + (p2.y - p0.y) / tension;
        const cp2x = p2.x - (p3.x - p1.x) / tension;
        const cp2y = p2.y - (p3.y - p1.y) / tension;

        pathData += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    return { pathData, points };
}

function drawSnake(svg, defs, startPos, endPos, theme, index) {
    const { pathData, points } = generateSnakeBodyPath(startPos.x, startPos.y, endPos.x, endPos.y);
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const gradId = `snakeGrad${index}`;
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '100%');
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', theme.body);
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', theme.dark);
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);

    const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shadowPath.setAttribute('d', pathData);
    shadowPath.setAttribute('stroke', 'rgba(0,0,0,0.2)');
    shadowPath.setAttribute('stroke-width', '3');
    shadowPath.setAttribute('fill', 'none');
    shadowPath.setAttribute('stroke-linecap', 'round');
    shadowPath.setAttribute('stroke-linejoin', 'round');
    shadowPath.setAttribute('transform', 'translate(0.3, 0.3)');
    group.appendChild(shadowPath);

    const outlinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outlinePath.setAttribute('d', pathData);
    outlinePath.setAttribute('stroke', theme.dark);
    outlinePath.setAttribute('stroke-width', '2.8');
    outlinePath.setAttribute('fill', 'none');
    outlinePath.setAttribute('stroke-linecap', 'round');
    outlinePath.setAttribute('stroke-linejoin', 'round');
    group.appendChild(outlinePath);

    const bodyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bodyPath.setAttribute('d', pathData);
    bodyPath.setAttribute('stroke', `url(#${gradId})`);
    bodyPath.setAttribute('stroke-width', '2.2');
    bodyPath.setAttribute('fill', 'none');
    bodyPath.setAttribute('stroke-linecap', 'round');
    bodyPath.setAttribute('stroke-linejoin', 'round');
    bodyPath.setAttribute('class', 'snake-body-main');
    bodyPath.setAttribute('stroke-dasharray', '4 0');
    group.appendChild(bodyPath);

    const bellyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bellyPath.setAttribute('d', pathData);
    bellyPath.setAttribute('stroke', theme.belly);
    bellyPath.setAttribute('stroke-width', '0.8');
    bellyPath.setAttribute('fill', 'none');
    bellyPath.setAttribute('stroke-linecap', 'round');
    bellyPath.setAttribute('stroke-linejoin', 'round');
    bellyPath.setAttribute('opacity', '0.6');
    group.appendChild(bellyPath);

    const markingInterval = Math.max(4, Math.floor(points.length / 10));
    for (let i = markingInterval; i < points.length - markingInterval; i += markingInterval) {
        const p = points[i];
        const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        diamond.setAttribute('cx', p.x.toFixed(2));
        diamond.setAttribute('cy', p.y.toFixed(2));
        diamond.setAttribute('r', '0.6');
        diamond.setAttribute('fill', theme.pattern);
        diamond.setAttribute('opacity', '0.5');
        group.appendChild(diamond);
    }

    drawSnakeHead(group, points, theme, index);
    drawSnakeTail(group, points, theme);

    svg.appendChild(group);
}

function drawSnakeHead(group, points, theme, index) {
    const headX = points[0].x;
    const headY = points[0].y;
    const nextX = points[Math.min(3, points.length - 1)].x;
    const nextY = points[Math.min(3, points.length - 1)].y;

    const bodyDx = nextX - headX;
    const bodyDy = nextY - headY;
    const bodyAngle = Math.atan2(bodyDy, bodyDx);
    const headAngle = bodyAngle + Math.PI;

    const headG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const hx = headX + Math.cos(headAngle) * 0.5;
    const hy = headY + Math.sin(headAngle) * 0.5;

    const headShape = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    headShape.setAttribute('cx', hx.toFixed(2));
    headShape.setAttribute('cy', hy.toFixed(2));
    headShape.setAttribute('rx', '1.8');
    headShape.setAttribute('ry', '1.4');
    headShape.setAttribute('fill', theme.body);
    headShape.setAttribute('stroke', theme.dark);
    headShape.setAttribute('stroke-width', '0.3');
    headShape.setAttribute('transform', `rotate(${(headAngle * 180 / Math.PI).toFixed(1)} ${hx.toFixed(2)} ${hy.toFixed(2)})`);
    headG.appendChild(headShape);

    const perpAngle = headAngle + Math.PI / 2;
    const eyeDist = 0.7;
    const eyeForward = 0.6;

    for (const side of [-1, 1]) {
        const ex = hx + Math.cos(headAngle) * eyeForward + Math.cos(perpAngle) * eyeDist * side;
        const ey = hy + Math.sin(headAngle) * eyeForward + Math.sin(perpAngle) * eyeDist * side;

        const eyeWhite = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        eyeWhite.setAttribute('cx', ex.toFixed(2));
        eyeWhite.setAttribute('cy', ey.toFixed(2));
        eyeWhite.setAttribute('r', '0.55');
        eyeWhite.setAttribute('fill', 'white');
        eyeWhite.setAttribute('stroke', theme.dark);
        eyeWhite.setAttribute('stroke-width', '0.15');
        headG.appendChild(eyeWhite);

        const px = ex + Math.cos(headAngle) * 0.15;
        const py = ey + Math.sin(headAngle) * 0.15;
        const pupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pupil.setAttribute('cx', px.toFixed(2));
        pupil.setAttribute('cy', py.toFixed(2));
        pupil.setAttribute('r', '0.28');
        pupil.setAttribute('fill', '#111');
        pupil.setAttribute('class', 'snake-eyes');
        headG.appendChild(pupil);

        const glint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glint.setAttribute('cx', (px - 0.08).toFixed(2));
        glint.setAttribute('cy', (py - 0.08).toFixed(2));
        glint.setAttribute('r', '0.1');
        glint.setAttribute('fill', 'white');
        headG.appendChild(glint);
    }

    const tongueStart = hx + Math.cos(headAngle) * 1.8;
    const tongueStartY = hy + Math.sin(headAngle) * 1.8;
    const tongueMid = hx + Math.cos(headAngle) * 3;
    const tongueMidY = hy + Math.sin(headAngle) * 3;
    const forkAngle1 = headAngle + 0.4;
    const forkAngle2 = headAngle - 0.4;
    const forkLen = 0.8;

    const tongue = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const tongueD = `M ${tongueStart.toFixed(2)} ${tongueStartY.toFixed(2)} ` +
        `L ${tongueMid.toFixed(2)} ${tongueMidY.toFixed(2)} ` +
        `M ${tongueMid.toFixed(2)} ${tongueMidY.toFixed(2)} ` +
        `L ${(tongueMid + Math.cos(forkAngle1) * forkLen).toFixed(2)} ${(tongueMidY + Math.sin(forkAngle1) * forkLen).toFixed(2)} ` +
        `M ${tongueMid.toFixed(2)} ${tongueMidY.toFixed(2)} ` +
        `L ${(tongueMid + Math.cos(forkAngle2) * forkLen).toFixed(2)} ${(tongueMidY + Math.sin(forkAngle2) * forkLen).toFixed(2)}`;
    tongue.setAttribute('d', tongueD);
    tongue.setAttribute('stroke', '#ef4444');
    tongue.setAttribute('stroke-width', '0.25');
    tongue.setAttribute('fill', 'none');
    tongue.setAttribute('stroke-linecap', 'round');
    tongue.setAttribute('class', 'snake-tongue');
    headG.appendChild(tongue);

    group.appendChild(headG);
}

function drawSnakeTail(group, points, theme) {
    const last = points[points.length - 1];
    const prev = points[Math.max(0, points.length - 4)];

    const dx = last.x - prev.x;
    const dy = last.y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.1) return;

    const dirX = dx / dist;
    const dirY = dy / dist;

    const tipX = last.x + dirX * 1.2;
    const tipY = last.y + dirY * 1.2;
    const perpX = -dirY;
    const perpY = dirX;
    const w = 0.8;

    const tailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const td = `M ${(last.x + perpX * w).toFixed(2)} ${(last.y + perpY * w).toFixed(2)} ` +
        `Q ${tipX.toFixed(2)} ${tipY.toFixed(2)} ${(last.x - perpX * w).toFixed(2)} ${(last.y - perpY * w).toFixed(2)}`;
    tailPath.setAttribute('d', td);
    tailPath.setAttribute('fill', theme.dark);
    tailPath.setAttribute('stroke', 'none');
    tailPath.setAttribute('opacity', '0.7');
    group.appendChild(tailPath);
}

function drawLadder(svg, defs, startPos, endPos, theme, index) {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length < 1) return;

    const perpX = (-dy / length) * 1.8;
    const perpY = (dx / length) * 1.8;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const gradId = `ladderGrad${index}`;
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '0%');
    const gs1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    gs1.setAttribute('offset', '0%');
    gs1.setAttribute('stop-color', theme.highlight);
    const gs2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    gs2.setAttribute('offset', '50%');
    gs2.setAttribute('stop-color', theme.side);
    const gs3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    gs3.setAttribute('offset', '100%');
    gs3.setAttribute('stop-color', theme.shadow);
    grad.appendChild(gs1);
    grad.appendChild(gs2);
    grad.appendChild(gs3);
    defs.appendChild(grad);

    const rungGradId = `rungGrad${index}`;
    const rungGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    rungGrad.setAttribute('id', rungGradId);
    rungGrad.setAttribute('x1', '0%');
    rungGrad.setAttribute('y1', '0%');
    rungGrad.setAttribute('x2', '0%');
    rungGrad.setAttribute('y2', '100%');
    const rgs1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    rgs1.setAttribute('offset', '0%');
    rgs1.setAttribute('stop-color', theme.highlight);
    const rgs2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    rgs2.setAttribute('offset', '100%');
    rgs2.setAttribute('stop-color', theme.rung);
    rungGrad.appendChild(rgs1);
    rungGrad.appendChild(rgs2);
    defs.appendChild(rungGrad);

    for (const offset of [0.4, -0.4]) {
        const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        shadow.setAttribute('x1', (startPos.x + perpX * offset + 0.3).toFixed(2));
        shadow.setAttribute('y1', (startPos.y + perpY * offset + 0.3).toFixed(2));
        shadow.setAttribute('x2', (endPos.x + perpX * offset + 0.3).toFixed(2));
        shadow.setAttribute('y2', (endPos.y + perpY * offset + 0.3).toFixed(2));
        shadow.setAttribute('stroke', 'rgba(0,0,0,0.15)');
        shadow.setAttribute('stroke-width', '1.2');
        shadow.setAttribute('stroke-linecap', 'round');
        group.appendChild(shadow);
    }

    for (const side of [1, -1]) {
        const rail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rail.setAttribute('x1', (startPos.x + perpX * side * 0.5).toFixed(2));
        rail.setAttribute('y1', (startPos.y + perpY * side * 0.5).toFixed(2));
        rail.setAttribute('x2', (endPos.x + perpX * side * 0.5).toFixed(2));
        rail.setAttribute('y2', (endPos.y + perpY * side * 0.5).toFixed(2));
        rail.setAttribute('stroke', `url(#${gradId})`);
        rail.setAttribute('stroke-width', '1');
        rail.setAttribute('stroke-linecap', 'round');
        group.appendChild(rail);

        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        highlight.setAttribute('x1', (startPos.x + perpX * side * 0.5 - 0.15).toFixed(2));
        highlight.setAttribute('y1', (startPos.y + perpY * side * 0.5 - 0.15).toFixed(2));
        highlight.setAttribute('x2', (endPos.x + perpX * side * 0.5 - 0.15).toFixed(2));
        highlight.setAttribute('y2', (endPos.y + perpY * side * 0.5 - 0.15).toFixed(2));
        highlight.setAttribute('stroke', theme.highlight);
        highlight.setAttribute('stroke-width', '0.25');
        highlight.setAttribute('stroke-linecap', 'round');
        highlight.setAttribute('opacity', '0.5');
        group.appendChild(highlight);
    }

    const numRungs = Math.max(3, Math.floor(length / 4));
    for (let i = 1; i < numRungs; i++) {
        const t = i / numRungs;
        const rx = startPos.x + dx * t;
        const ry = startPos.y + dy * t;

        const rungShadow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rungShadow.setAttribute('x1', (rx + perpX * 0.5 + 0.2).toFixed(2));
        rungShadow.setAttribute('y1', (ry + perpY * 0.5 + 0.2).toFixed(2));
        rungShadow.setAttribute('x2', (rx - perpX * 0.5 + 0.2).toFixed(2));
        rungShadow.setAttribute('y2', (ry - perpY * 0.5 + 0.2).toFixed(2));
        rungShadow.setAttribute('stroke', 'rgba(0,0,0,0.1)');
        rungShadow.setAttribute('stroke-width', '0.6');
        rungShadow.setAttribute('stroke-linecap', 'round');
        group.appendChild(rungShadow);

        const rung = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rung.setAttribute('x1', (rx + perpX * 0.5).toFixed(2));
        rung.setAttribute('y1', (ry + perpY * 0.5).toFixed(2));
        rung.setAttribute('x2', (rx - perpX * 0.5).toFixed(2));
        rung.setAttribute('y2', (ry - perpY * 0.5).toFixed(2));
        rung.setAttribute('stroke', `url(#${rungGradId})`);
        rung.setAttribute('stroke-width', '0.5');
        rung.setAttribute('stroke-linecap', 'round');
        group.appendChild(rung);

        const rungHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rungHighlight.setAttribute('x1', (rx + perpX * 0.45 - 0.1).toFixed(2));
        rungHighlight.setAttribute('y1', (ry + perpY * 0.45 - 0.1).toFixed(2));
        rungHighlight.setAttribute('x2', (rx - perpX * 0.45 - 0.1).toFixed(2));
        rungHighlight.setAttribute('y2', (ry - perpY * 0.45 - 0.1).toFixed(2));
        rungHighlight.setAttribute('stroke', theme.highlight);
        rungHighlight.setAttribute('stroke-width', '0.15');
        rungHighlight.setAttribute('stroke-linecap', 'round');
        rungHighlight.setAttribute('opacity', '0.4');
        rungHighlight.setAttribute('class', 'ladder-glow');
        group.appendChild(rungHighlight);
    }

    const topCap = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    topCap.setAttribute('cx', endPos.x.toFixed(2));
    topCap.setAttribute('cy', endPos.y.toFixed(2));
    topCap.setAttribute('r', '0.6');
    topCap.setAttribute('fill', theme.highlight);
    topCap.setAttribute('stroke', theme.side);
    topCap.setAttribute('stroke-width', '0.2');
    group.appendChild(topCap);

    const botCap = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    botCap.setAttribute('cx', startPos.x.toFixed(2));
    botCap.setAttribute('cy', startPos.y.toFixed(2));
    botCap.setAttribute('r', '0.6');
    botCap.setAttribute('fill', theme.highlight);
    botCap.setAttribute('stroke', theme.side);
    botCap.setAttribute('stroke-width', '0.2');
    group.appendChild(botCap);

    svg.appendChild(group);
}

// ============================================================
// POSITION CALCULATION
// ============================================================
function getCellPosition(cellNumber) {
    if (cellNumber < 1 || cellNumber > TOTAL_CELLS) {
        return { x: 0, y: 0 };
    }

    const row = Math.floor((cellNumber - 1) / BOARD_SIZE);
    const col = (cellNumber - 1) % BOARD_SIZE;

    const visualRow = BOARD_SIZE - 1 - row;
    const isReverse = visualRow % 2 === 0;
    const actualCol = isReverse ? BOARD_SIZE - 1 - col : col;

    const cellWidth = 100 / BOARD_SIZE;
    const cellHeight = 100 / BOARD_SIZE;
    const x = (actualCol * cellWidth) + (cellWidth / 2);
    const y = (visualRow * cellHeight) + (cellHeight / 2);

    return { x, y };
}

// ============================================================
// PLAYER MANAGEMENT
// ============================================================
function addPlayer() {
    if (gameState.players.length >= 6) {
        alert('Maximum 6 players allowed!');
        return;
    }

    const playerNumber = gameState.players.length + 1;
    const player = {
        id: playerNumber,
        name: `Player ${playerNumber}`,
        position: 0,
        color: PLAYER_COLORS[playerNumber - 1],
        emoji: PLAYER_EMOJIS[playerNumber - 1],
        powerup: null
    };

    gameState.players.push(player);
    updatePlayersList();
    updatePlayerTokens();
    updateDrawerPlayers();
    addLog(`${player.emoji} ${player.name} joined the game!`, player.color);
}

function updatePlayersList() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';

    gameState.players.forEach((player, index) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        if (index === gameState.currentPlayerIndex && gameState.gameStarted) {
            playerItem.classList.add('active');
        }
        playerItem.style.borderLeftColor = player.color;

        const badgeHtml = player.powerup ? `<span class="powerup-badge">${player.powerup.emoji}</span>` : '';
        playerItem.innerHTML = `
            <span class="player-emoji">${player.emoji}</span>
            <div class="player-info">
                <div class="player-name">${player.name} ${badgeHtml}</div>
                <div class="player-position">Position: ${player.position === 0 ? 'Start' : player.position}${player.powerup ? ` · ${player.powerup.name}` : ''}</div>
            </div>
        `;

        playersList.appendChild(playerItem);
    });
}

function updatePlayerTokens() {
    const container = document.getElementById('players-container');
    container.innerHTML = '';

    gameState.players.forEach((player, index) => {
        if (player.position <= 0) return;

        const token = document.createElement('div');
        token.className = 'player-token';
        token.style.backgroundColor = player.color;
        token.textContent = player.emoji;
        token.id = `player-token-${player.id}`;

        const position = getCellPosition(player.position);
        const offsetX = (index % 2) * 2 - 1;
        const offsetY = Math.floor(index / 2) * 2 - 1;
        token.style.left = `${position.x + offsetX * 0.8}%`;
        token.style.top = `${position.y + offsetY * 0.8}%`;
        token.style.transform = 'translate(-50%, -50%)';

        container.appendChild(token);
    });
}

// ============================================================
// DICE
// ============================================================
function renderDiceFace(value) {
    const face = document.getElementById('dice-face');
    const pattern = DICE_PATTERNS[value] || DICE_PATTERNS[1];
    const dots = face.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('visible', pattern[i]);
    });
}

function setRollButtonsDisabled(disabled) {
    const desktopBtn = document.getElementById('roll-dice');
    const mobileBtn = document.getElementById('mobile-roll-btn');
    if (desktopBtn) desktopBtn.disabled = disabled;
    if (mobileBtn) mobileBtn.disabled = disabled;
}

function rollDice() {
    if (gameState.gameWon || gameState.players.length < 2) return;
    if (!gameState.gameStarted) gameState.gameStarted = true;

    const diceDisplay = document.getElementById('dice');
    const diceValueEl = document.getElementById('dice-value');

    setRollButtonsDisabled(true);
    diceDisplay.classList.add('rolling');
    diceDisplay.classList.remove('landed');

    if (sounds.diceRoll) sounds.diceRoll();

    let flickerCount = 0;
    const flickerInterval = setInterval(() => {
        renderDiceFace(Math.floor(Math.random() * 6) + 1);
        flickerCount++;
        if (flickerCount > 8) clearInterval(flickerInterval);
    }, 60);

    setTimeout(() => {
        clearInterval(flickerInterval);
        const value = Math.floor(Math.random() * 6) + 1;
        renderDiceFace(value);
        diceDisplay.classList.remove('rolling');
        diceDisplay.classList.add('landed');

        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        let finalValue = value;

        if (currentPlayer.powerup && currentPlayer.powerup.id === 'double') {
            finalValue = value * 2;
            currentPlayer.powerup = null;
            diceValueEl.textContent = `⚡ ${value} × 2 = ${finalValue}!`;
            addLog(`⚡ ${currentPlayer.name}'s roll was DOUBLED! ${value} → ${finalValue}!`, '#eab308');
            updatePlayersList();
            updateDrawerPlayers();
        } else {
            diceValueEl.textContent = `Rolled: ${value}`;
        }

        setTimeout(() => diceDisplay.classList.remove('landed'), 400);
        movePlayer(finalValue);
    }, 700);
}

// ============================================================
// MOVEMENT
// ============================================================
async function movePlayer(steps) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (currentPlayer.position === 0) {
        if (steps >= 1) {
            currentPlayer.position = 1;
            updatePlayerTokens();
            addLog(`${currentPlayer.emoji} ${currentPlayer.name} rolled ${steps} and enters the board!`, currentPlayer.color);
        } else {
            addLog(`${currentPlayer.emoji} ${currentPlayer.name} rolled ${steps} - need 1+ to start!`, currentPlayer.color);
            nextTurn();
            return;
        }
    }

    let currentPos = currentPlayer.position + steps;

    if (currentPos > TOTAL_CELLS) {
        const overshoot = currentPos - TOTAL_CELLS;
        currentPos = TOTAL_CELLS - overshoot;
        addLog(`${currentPlayer.emoji} ${currentPlayer.name} rolled ${steps} — bounced back to ${currentPos}!`, '#f97316');
    } else {
        addLog(`${currentPlayer.emoji} ${currentPlayer.name} rolled ${steps} → position ${currentPos}`, currentPlayer.color);
    }

    await animatePlayerMovement(currentPlayer, currentPos);

    let grantExtraTurn = false;

    if (POWERUP_CELLS.includes(currentPos)) {
        const powerup = collectPowerup(currentPlayer);
        showPowerupNotification(powerup);
        if (sounds.powerup) sounds.powerup();

        if (powerup.id === 'boost') {
            let boostedPos = currentPos + 5;
            if (boostedPos > TOTAL_CELLS) {
                boostedPos = TOTAL_CELLS - (boostedPos - TOTAL_CELLS);
            }
            addLog(`🚀 ${currentPlayer.name} rockets forward to ${boostedPos}!`, '#8b5cf6');
            await delay(400);
            await animatePlayerMovement(currentPlayer, boostedPos);
            currentPos = boostedPos;
        } else if (powerup.id === 'extra') {
            grantExtraTurn = true;
        }
    }

    if (SNAKES[currentPos]) {
        if (currentPlayer.powerup && currentPlayer.powerup.id === 'shield') {
            currentPlayer.powerup = null;
            showEventAnimation('🛡️', '#6366f1');
            if (sounds.shield) sounds.shield();
            addLog(`🛡️ ${currentPlayer.name}'s Shield blocked the snake!`, '#6366f1');
            updatePlayersList();
            updateDrawerPlayers();
            await delay(600);
        } else {
            const snakeDest = SNAKES[currentPos];
            showEventAnimation('🐍', '#ff6b6b');
            screenShake();
            if (sounds.snake) sounds.snake();
            addLog(`😱 ${currentPlayer.name} hit a SNAKE! Sliding to ${snakeDest}!`, '#ef4444');

            await delay(400);

            const token = document.getElementById(`player-token-${currentPlayer.id}`);
            if (token) token.classList.add('snake-slide');
            await animatePlayerMovement(currentPlayer, snakeDest);
            if (token) setTimeout(() => token.classList.remove('snake-slide'), 600);
            currentPos = snakeDest;
        }
    } else if (LADDERS[currentPos]) {
        const ladderDest = LADDERS[currentPos];
        showEventAnimation('🌟', '#51cf66');
        if (sounds.ladder) sounds.ladder();
        addLog(`🎉 ${currentPlayer.name} found a LADDER! Climbing to ${ladderDest}!`, '#22c55e');

        await delay(400);

        const token = document.getElementById(`player-token-${currentPlayer.id}`);
        if (token) token.classList.add('ladder-climb');
        await animatePlayerMovement(currentPlayer, ladderDest);
        if (token) setTimeout(() => token.classList.remove('ladder-climb'), 600);
        currentPos = ladderDest;
    }

    currentPlayer.position = currentPos;
    updatePlayerTokens();

    if (currentPos === TOTAL_CELLS) {
        gameState.gameWon = true;
        showWinner(currentPlayer);
        if (sounds.win) sounds.win();
        addLog(`🏆 ${currentPlayer.emoji} ${currentPlayer.name} WINS! 🏆`, currentPlayer.color);
        return;
    }

    if (grantExtraTurn) {
        addLog(`🎯 ${currentPlayer.name} gets an EXTRA TURN!`, '#d946ef');
        updatePlayersList();
        updateDrawerPlayers();
        setTimeout(() => setRollButtonsDisabled(false), 600);
        return;
    }

    setTimeout(() => nextTurn(), 800);
}

function nextTurn() {
    setTimeout(() => {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        updateUI();
        setRollButtonsDisabled(false);
    }, 200);
}

function animatePlayerMovement(player, targetPosition) {
    return new Promise((resolve) => {
        const startPos = player.position;
        const steps = targetPosition - startPos;

        if (steps === 0) { resolve(); return; }

        let token = document.getElementById(`player-token-${player.id}`);
        if (!token && startPos > 0) {
            updatePlayerTokens();
            token = document.getElementById(`player-token-${player.id}`);
        }
        if (!token) {
            player.position = targetPosition;
            updatePlayerTokens();
            resolve();
            return;
        }

        let currentPos = startPos;
        let stepCount = 0;
        const playerIndex = gameState.players.findIndex(p => p.id === player.id);

        const moveInterval = setInterval(() => {
            if (stepCount < Math.abs(steps)) {
                currentPos += steps > 0 ? 1 : -1;
                stepCount++;

                const position = getCellPosition(currentPos);
                const offsetX = (playerIndex % 2) * 2 - 1;
                const offsetY = Math.floor(playerIndex / 2) * 2 - 1;
                token.style.left = `${position.x + offsetX * 0.8}%`;
                token.style.top = `${position.y + offsetY * 0.8}%`;
                token.classList.add('moving');

                if (sounds.move && stepCount % 2 === 0) {
                    setTimeout(() => sounds.move(), 30);
                }

                setTimeout(() => token.classList.remove('moving'), 250);
            } else {
                clearInterval(moveInterval);
                player.position = targetPosition;
                resolve();
            }
        }, 120);
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// EFFECTS
// ============================================================
function collectPowerup(player) {
    const powerup = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];

    if (!powerup.instant) {
        player.powerup = { ...powerup };
        updatePlayersList();
        updateDrawerPlayers();
    }

    addLog(`⭐ ${player.name} got ${powerup.emoji} ${powerup.name}! ${powerup.description}`, '#d946ef');
    return powerup;
}

function showPowerupNotification(powerup) {
    const notif = document.getElementById('powerup-notification');
    if (!notif) return;
    notif.innerHTML = `
        <div class="powerup-notif-emoji">${powerup.emoji}</div>
        <div class="powerup-notif-text">
            <div class="powerup-notif-name">${powerup.name}</div>
            <div class="powerup-notif-desc">${powerup.description}</div>
        </div>
    `;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 2200);
}

function showEventAnimation(emoji, color) {
    const anim = document.getElementById('event-animation');
    anim.textContent = emoji;
    anim.style.color = color;
    anim.classList.add('show');
    setTimeout(() => anim.classList.remove('show'), 1200);
}

function screenShake() {
    const container = document.querySelector('.board-container');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 500);
}

function showWinner(player) {
    createConfetti();

    const celebration = document.createElement('div');
    celebration.className = 'winner-celebration show';
    celebration.innerHTML = `
        <div class="winner-content">
            <span class="winner-emoji">🎉🏆🎉</span>
            <h2>Winner!</h2>
            <p style="color: ${player.color}">${player.emoji} ${player.name} Wins!</p>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove(); resetGame();">🔄 Play Again</button>
        </div>
    `;
    document.body.appendChild(celebration);
}

// ============================================================
// CONFETTI SYSTEM
// ============================================================
function createConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#c44dff', '#ff9f43', '#00d2d3', '#feca57', '#ff6348'];
    const particles = [];
    const count = window.innerWidth < 500 ? 100 : 200;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * -1 - 50,
            w: Math.random() * 12 + 4,
            h: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            speed: Math.random() * 4 + 2,
            rotSpeed: (Math.random() - 0.5) * 12,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.06 + 0.02,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }

    let frame = 0;
    const maxFrames = 300;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if (p.y < canvas.height + 30) {
                active = true;
                p.y += p.speed;
                p.x += Math.sin(p.wobble) * 1.5;
                p.wobble += p.wobbleSpeed;
                p.rotation += p.rotSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.globalAlpha = Math.min(1, (canvas.height + 30 - p.y) / 100);
                ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        });

        frame++;
        if (active && frame < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ============================================================
// UI UPDATES
// ============================================================
function updateUI() {
    updatePlayersList();
    updatePlayerTokens();
    updateDrawerPlayers();

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer) {
        document.getElementById('current-player-name').textContent = `${currentPlayer.emoji} ${currentPlayer.name}`;
        document.getElementById('current-player-name').style.color = currentPlayer.color;
    }
}

function addLog(message, color = '#4c1d95') {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.style.borderLeftColor = color;
    entry.textContent = message;
    log.insertBefore(entry, log.firstChild);

    while (log.children.length > 25) {
        log.removeChild(log.lastChild);
    }

    if (drawerOpen) {
        updateDrawerLog();
    }
}

// ============================================================
// RESET
// ============================================================
function resetGame() {
    gameState.players.forEach(player => {
        player.position = 0;
        player.powerup = null;
    });
    gameState.currentPlayerIndex = 0;
    gameState.gameStarted = false;
    gameState.gameWon = false;

    renderDiceFace(1);
    document.getElementById('dice-value').textContent = 'Roll the dice!';
    setRollButtonsDisabled(false);
    document.getElementById('log').innerHTML = '';

    const celebration = document.querySelector('.winner-celebration');
    if (celebration) celebration.remove();

    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    createBoard();
    updateUI();
    addLog('🔄 Game reset! Ready to play!', '#4c1d95');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', initGame);

document.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

document.addEventListener('touchstart', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });
