// ============================================================
// === ТЕМЫ ===
// ============================================================
const themes = ['dark', 'light', 'blue', 'purple'];
const themeLabels = ['🌙 Тёмная', '☀️ Светлая', '💎 Голубая', '🔮 Фиолетовая'];
const themeIcons = ['🌙', '☀️', '💎', '🔮'];
let currentThemeIndex = 0;

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    const idx = themes.indexOf(savedTheme);
    if (idx !== -1) {
        currentThemeIndex = idx;
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.textContent = themeIcons[idx];
        themeLabel.textContent = themeLabels[idx].replace(/[^\s]+ /, '');
    }
}

themeToggle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.documentElement.setAttribute('data-theme', themes[currentThemeIndex]);
    themeIcon.textContent = themeIcons[currentThemeIndex];
    themeLabel.textContent = themeLabels[currentThemeIndex].replace(/[^\s]+ /, '');
    localStorage.setItem('theme', themes[currentThemeIndex]);
});

// ============================================================
// === ЗАГРУЗЧИК ===
// ============================================================
window.addEventListener('load', () => {
    document.getElementById('loader').classList.add('hidden');
});

// ============================================================
// === ВОЗРАСТ ===
// ============================================================
(function() {
    const birth = new Date(2011, 11, 3);
    function getAge() {
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        const d = now.getDate() - birth.getDate();
        if (m < 0 || (m === 0 && d < 0)) age--;
        return age;
    }
    function update() {
        const a = getAge();
        ['ageDisplay', 'ageInline', 'ageInline2'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = a;
        });
    }
    update();
    setInterval(update, 60000);
})();

// ============================================================
// === ПОСЕТИТЕЛИ ===
// ============================================================
(function() {
    let count = parseInt(localStorage.getItem('visitorCount') || '0');
    count++;
    localStorage.setItem('visitorCount', String(count));
    document.getElementById('visitorCount').textContent = count;
})();

// ============================================================
// === ТАЙМЕР ===
// ============================================================
(function() {
    const birthDay = 3, birthMonth = 11;
    const elDays = document.getElementById('bDays');
    const elHours = document.getElementById('bHours');
    const elMinutes = document.getElementById('bMinutes');
    const elSeconds = document.getElementById('bSeconds');

    function update() {
        const now = new Date();
        let target = new Date(now.getFullYear(), birthMonth, birthDay);
        if (now > target) target = new Date(now.getFullYear() + 1, birthMonth, birthDay);
        const diff = target - now;
        if (diff <= 0) return;

        elDays.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        elHours.textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        elMinutes.textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        elSeconds.textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
})();

// ============================================================
// === ПЛАНЫ (без инлайн-обработчиков) ===
// ============================================================
document.querySelectorAll('.goal-item').forEach(el => {
    el.addEventListener('click', function() {
        const isCompleted = this.classList.toggle('completed');
        this.querySelector('.goal-check').textContent = isCompleted ? '✅' : '⬜';
    });
});

// ============================================================
// === ВКЛАДКИ ===
// ============================================================
document.querySelectorAll('.tabs .tab-btn, .game-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const parent = this.closest('.tabs') || this.closest('.game-tabs');
        if (!parent) return;
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const targetId = this.dataset.tab || this.dataset.game;
        if (!targetId) return;
        const content = this.closest('.card');
        const prefix = this.closest('.game-tabs') ? 'game-' : 'tab-';
        content.querySelectorAll(`.${prefix}content`).forEach(el => el.classList.remove('active'));
        const target = content.querySelector(`#${prefix}${targetId}`);
        if (target) target.classList.add('active');

        if (targetId === 'tetris') drawTetris();
        if (targetId === 'snake') drawSnake();
    });
});

// ============================================================
// === ПОГОДА ===
// ============================================================
(async function getWeather() {
    const city = 'Moscow';
    try {
        const res = await fetch(`https://wttr.in/${city}?format=j1&lang=ru`);
        const data = await res.json();
        const temp = data.current_condition[0].temp_C;
        const desc = data.current_condition[0].weatherDesc[0].value;
        const code = data.current_condition[0].weatherCode;
        const icons = { '113': '☀️', '116': '⛅', '119': '☁️', '122': '☁️', '143': '🌫️', '176': '🌦️', '179': '🌨️', '182': '🌧️', '185': '🌧️', '200': '⛈️', '227': '❄️', '230': '❄️', '248': '🌫️', '260': '🌫️', '263': '🌦️', '266': '🌧️', '281': '🌧️', '284': '🌧️', '293': '🌦️', '296': '🌧️', '299': '🌧️', '302': '🌧️', '305': '🌧️', '308': '🌧️', '311': '🌧️', '314': '🌧️', '317': '🌧️', '320': '🌨️', '323': '🌨️', '326': '🌨️', '329': '❄️', '332': '❄️', '335': '❄️', '338': '❄️', '350': '🌧️', '353': '🌦️', '356': '🌧️', '359': '🌧️', '362': '🌨️', '365': '🌨️', '368': '🌨️', '371': '❄️', '377': '🌧️', '386': '⛈️', '389': '⛈️', '392': '⛈️', '395': '❄️' };
        document.getElementById('weatherIcon').textContent = icons[code] || '🌍';
        document.getElementById('weatherTemp').textContent = `${temp}°`;
        document.getElementById('weatherDesc').textContent = desc;
    } catch {
        document.getElementById('weatherDesc').textContent = 'Не удалось загрузить';
    }
})();

// ============================================================
// === СПОТИФАЙ И СТАТУС (Lanyard) ===
// ============================================================
async function fetchSpotifyAndGames() {
    const userId = '994821782819311636';
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await res.json();
        if (!data.success) throw new Error('Lanyard error');

        const status = data.data;
        // Spotify
        const spotify = status.spotify;
        if (spotify && spotify.song) {
            document.getElementById('spotifyTrack').textContent = spotify.song;
            document.getElementById('spotifyArtist').textContent = spotify.artist;
            document.getElementById('spotifyArtwork').textContent = '🎵';
            document.getElementById('spotifyStatusDot').className = 'spotify-status-dot';
        } else {
            document.getElementById('spotifyTrack').textContent = 'Не играет';
            document.getElementById('spotifyArtist').textContent = '—';
            document.getElementById('spotifyStatusDot').className = 'spotify-status-dot paused';
        }

        // Discord статус
        const activities = status.activities || [];
        const game = activities.find(a => a.type === 0);
        const listening = activities.find(a => a.type === 2);
        const dot = document.getElementById('discordDot');
        const text = document.getElementById('discordText');

        switch (status.discord_status) {
            case 'online':
                dot.style.background = '#44ff88';
                if (game) {
                    let txt = `🎮 <strong>Играет в <span class="game">${game.name}</span></strong>`;
                    if (game.details) txt += ` · <span class="details">${game.details}</span>`;
                    if (game.state) txt += ` <span class="details">${game.state}</span>`;
                    text.innerHTML = txt;
                } else if (listening) {
                    text.innerHTML = `🎵 <strong>Слушает <span class="game">${listening.name}</span></strong>`;
                } else {
                    text.innerHTML = '🟢 <strong>Онлайн</strong> · Не играет';
                }
                break;
            case 'idle':
                dot.style.background = '#ffaa44';
                text.innerHTML = '🌙 <strong>Отошёл</strong>';
                break;
            case 'dnd':
                dot.style.background = '#ff4444';
                text.innerHTML = '🔴 <strong>Не беспокоить</strong>';
                break;
            default:
                dot.style.background = '#888';
                text.innerHTML = '⚫ <strong>Офлайн</strong>';
        }
    } catch {
        document.getElementById('spotifyTrack').textContent = 'Ошибка';
        document.getElementById('spotifyArtist').textContent = '—';
        document.getElementById('discordText').innerHTML = '⚠️ Не удалось загрузить';
    }
}

fetchSpotifyAndGames();
setInterval(fetchSpotifyAndGames, 15000);

// ============================================================
// === ЗАМЕТКИ ===
// ============================================================
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
const notesGrid = document.getElementById('notesGrid');
const noteSearch = document.getElementById('noteSearch');

function renderNotes(filter = '') {
    const filtered = filter ? notes.filter(n =>
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.content.toLowerCase().includes(filter.toLowerCase())
    ) : notes;

    notesGrid.innerHTML = '';
    if (!filtered.length) {
        notesGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:20px;">📝 Нет заметок</div>';
        return;
    }
    filtered.forEach((note, idx) => {
        const realIdx = notes.indexOf(note);
        const card = document.createElement('div');
        card.className = 'note-card';
        card.style.borderLeft = `4px solid ${note.color || 'var(--accent)'}`;
        card.innerHTML = `
            <span class="sticker">${note.sticker || '📌'}</span>
            <div class="title">${note.title}</div>
            <div class="content">${note.content}</div>
            <div class="date">${note.date}</div>
            <button class="delete-btn" data-idx="${realIdx}">✕</button>
        `;
        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Удалить заметку?')) {
                notes.splice(realIdx, 1);
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes(noteSearch.value);
            }
        });
        notesGrid.appendChild(card);
    });
}

noteSearch.addEventListener('input', () => renderNotes(noteSearch.value));

document.getElementById('noteAdd').addEventListener('click', () => {
    const title = document.getElementById('noteTitle').value.trim() || 'Без названия';
    const content = document.getElementById('noteContent').value.trim();
    const color = document.getElementById('noteColor').value;
    const sticker = document.getElementById('noteSticker').value.trim() || '📌';
    if (!content) return alert('Напиши текст заметки!');
    const now = new Date();
    const date = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    notes.unshift({ title, content, color, sticker, date });
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteSticker').value = '📌';
    renderNotes(noteSearch.value);
});

// Экспорт/импорт
document.getElementById('notesExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('notesImport').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    notes = data;
                    localStorage.setItem('notes', JSON.stringify(notes));
                    renderNotes(noteSearch.value);
                }
            } catch { alert('Ошибка при импорте'); }
        };
        reader.readAsText(file);
    };
    input.click();
});

renderNotes();

// ============================================================
// === ЧАТ ===
// ============================================================
let chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
const chatContainer = document.getElementById('chatMessages');

function renderChat() {
    chatContainer.innerHTML = '';
    if (!chatMessages.length) {
        chatContainer.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:12px;">💬 Напиши первое сообщение!</div>';
        return;
    }
    chatMessages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `chat-msg${msg.self ? ' self' : ''}`;
        div.innerHTML = `
            <span class="name">${msg.name}</span>
            <span class="time">${msg.time}</span>
            <div class="text">${msg.text}</div>
        `;
        chatContainer.appendChild(div);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.getElementById('chatSend').addEventListener('click', () => {
    const name = document.getElementById('chatName').value.trim() || 'Аноним';
    const text = document.getElementById('chatInput').value.trim();
    if (!text) return alert('Напиши сообщение!');
    const now = new Date();
    const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    chatMessages.push({ name, text, time, self: name === 'Nneocraft' });
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    document.getElementById('chatInput').value = '';
    renderChat();
});

document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('chatSend').click();
});

renderChat();

// ============================================================
// === ТЕТРИС ===
// ============================================================
const tetrisCanvas = document.getElementById('tetrisCanvas');
const tctx = tetrisCanvas.getContext('2d');
const COLS = 10, ROWS = 20, BS = tetrisCanvas.width / COLS;

let tBoard = [], tPiece = null, tScore = 0, tBest = parseInt(localStorage.getItem('tetrisBest') || '0');
let tInterval = null, tRunning = false, tPaused = false;

const T_PIECES = [
    [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]]
];

document.getElementById('tetrisBest').textContent = tBest;

function initTetris() {
    tBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    tScore = 0;
    tPaused = false;
    document.getElementById('tetrisScore').textContent = 'Счёт: 0';
    document.getElementById('tetrisStatus').textContent = '▶ Игра идёт';
    spawnTetris();
    drawTetris();
}

function spawnTetris() {
    const idx = Math.floor(Math.random() * T_PIECES.length);
    const shape = T_PIECES[idx];
    tPiece = { shape, x: Math.floor((COLS - shape[0].length) / 2), y: 0 };
    if (collision(tPiece.shape, tPiece.x, tPiece.y)) {
        clearInterval(tInterval); tRunning = false; tPiece = null;
        updateTetrisBest();
        document.getElementById('tetrisStatus').textContent = '💥 Игра окончена!';
        alert('💥 Игра окончена! Счёт: ' + tScore);
        return false;
    }
    return true;
}

function collision(shape, offX, offY) {
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[0].length; c++)
            if (shape[r][c]) {
                const x = offX + c, y = offY + r;
                if (x < 0 || x >= COLS || y >= ROWS || y < 0) return true;
                if (y >= 0 && tBoard[y][x]) return true;
            }
    return false;
}

function mergeTetris() {
    if (!tPiece) return;
    const { shape, x, y } = tPiece;
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[0].length; c++)
            if (shape[r][c]) {
                const boardY = y + r, boardX = x + c;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS)
                    tBoard[boardY][boardX] = 1;
            }
    clearLines();
    if (!spawnTetris()) { clearInterval(tInterval); tRunning = false; }
    drawTetris();
}

function clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--)
        if (tBoard[r].every(cell => cell === 1)) {
            tBoard.splice(r, 1);
            tBoard.unshift(Array(COLS).fill(0));
            cleared++; r++;
        }
    if (cleared) {
        tScore += [0, 100, 300, 500, 800][cleared] || 1000;
        document.getElementById('tetrisScore').textContent = 'Счёт: ' + tScore;
        updateTetrisBest();
    }
}

function updateTetrisBest() {
    if (tScore > tBest) {
        tBest = tScore;
        localStorage.setItem('tetrisBest', String(tBest));
        document.getElementById('tetrisBest').textContent = tBest;
        document.getElementById('tetrisSaveStatus').textContent = '🏆 Новый рекорд!';
        setTimeout(() => document.getElementById('tetrisSaveStatus').textContent = '💾 Сохранено', 3000);
    }
}

function drawTetris() {
    tctx.clearRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
            tctx.fillStyle = tBoard[r][c] ? 'rgba(100,180,255,0.12)' : 'rgba(255,255,255,0.02)';
            tctx.fillRect(c * BS, r * BS, BS - 0.5, BS - 0.5);
            if (tBoard[r][c]) {
                tctx.fillStyle = 'var(--accent)';
                tctx.shadowColor = 'var(--accent-glow)';
                tctx.shadowBlur = 8;
                tctx.fillRect(c * BS + 2, r * BS + 2, BS - 4, BS - 4);
                tctx.shadowBlur = 0;
            }
        }
    if (tPiece) {
        const { shape, x, y } = tPiece;
        for (let r = 0; r < shape.length; r++)
            for (let c = 0; c < shape[0].length; c++)
                if (shape[r][c]) {
                    tctx.fillStyle = '#fff';
                    tctx.shadowColor = 'rgba(100,180,255,0.3)';
                    tctx.shadowBlur = 12;
                    tctx.fillRect((x + c) * BS + 2, (y + r) * BS + 2, BS - 4, BS - 4);
                    tctx.shadowBlur = 0;
                }
    }
}

function moveTetris(dx, dy) {
    if (!tPiece || !tRunning || tPaused) return;
    if (!collision(tPiece.shape, tPiece.x + dx, tPiece.y + dy)) {
        tPiece.x += dx; tPiece.y += dy;
        drawTetris();
    } else if (dy === 1) mergeTetris();
}

function rotateTetris() {
    if (!tPiece || !tRunning || tPaused) return;
    const shape = tPiece.shape;
    const rotated = shape[0].map((_, idx) => shape.map(row => row[idx]).reverse());
    if (!collision(rotated, tPiece.x, tPiece.y)) {
        tPiece.shape = rotated;
        drawTetris();
    }
}

function dropTetris() {
    if (!tPiece || !tRunning || tPaused) return;
    while (!collision(tPiece.shape, tPiece.x, tPiece.y + 1)) tPiece.y++;
    mergeTetris(); drawTetris();
}

document.getElementById('tetrisPause').addEventListener('click', () => {
    if (!tRunning) return;
    tPaused = !tPaused;
    document.getElementById('tetrisStatus').textContent = tPaused ? '⏸ Пауза' : '▶ Игра идёт';
});

document.getElementById('tetrisReset').addEventListener('click', () => {
    if (tInterval) clearInterval(tInterval);
    tRunning = true; tPaused = false;
    initTetris();
    tInterval = setInterval(() => { if (tRunning && !tPaused) moveTetris(0, 1); }, 300);
});

document.getElementById('tetrisSave').addEventListener('click', () => {
    localStorage.setItem('tetrisBest', String(tBest));
    document.getElementById('tetrisSaveStatus').textContent = '✅ Сохранено!';
    setTimeout(() => document.getElementById('tetrisSaveStatus').textContent = '💾 Сохранено', 2000);
});

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('tab-games').classList.contains('active')) return;
    if (document.getElementById('game-tetris').classList.contains('active')) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveTetris(-1, 0); }
        if (e.key === 'ArrowRight') { e.preventDefault(); moveTetris(1, 0); }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveTetris(0, 1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); rotateTetris(); }
        if (e.key === ' ') { e.preventDefault(); dropTetris(); }
    }
});

document.querySelectorAll('[data-tetris]').forEach(btn => {
    ['touchstart', 'mousedown'].forEach(ev => btn.addEventListener(ev, (e) => {
        e.preventDefault();
        const a = btn.dataset.tetris;
        if (a === 'left') moveTetris(-1, 0);
        if (a === 'right') moveTetris(1, 0);
        if (a === 'down') moveTetris(0, 1);
        if (a === 'rotate') rotateTetris();
        if (a === 'drop') dropTetris();
    }));
});

// ============================================================
// === ЗМЕЙКА ===
// ============================================================
const snakeCanvas = document.getElementById('snakeCanvas');
const sctx = snakeCanvas.getContext('2d');
const SZ = 15;
const S_COLS = Math.floor(snakeCanvas.width / SZ);
const S_ROWS = Math.floor(snakeCanvas.height / SZ);

let snake = [], sDir = {dx:1,dy:0}, sNext = {dx:1,dy:0}, sFood = null;
let sScore = 0, sBest = parseInt(localStorage.getItem('snakeBest') || '0');
let sRunning = false, sPaused = false, sInterval = null;

document.getElementById('snakeBest').textContent = sBest;

function initSnake() {
    const mx = Math.floor(S_COLS/2), my = Math.floor(S_ROWS/2);
    snake = [{x:mx,y:my}, {x:mx-1,y:my}, {x:mx-2,y:my}];
    sDir = {dx:1,dy:0}; sNext = {dx:1,dy:0};
    sScore = 0; sPaused = false;
    document.getElementById('snakeScore').textContent = 'Счёт: 0';
    document.getElementById('snakeStatus').textContent = '▶ Игра идёт';
    spawnFood(); drawSnake();
}

function spawnFood() {
    let pos, attempts = 0;
    do {
        pos = { x: Math.floor(Math.random() * S_COLS), y: Math.floor(Math.random() * S_ROWS) };
        attempts++;
    } while (snake.some(s => s.x === pos.x && s.y === pos.y) && attempts < 100);
    sFood = pos;
}

function drawSnake() {
    sctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    for (let r = 0; r < S_ROWS; r++)
        for (let c = 0; c < S_COLS; c++)
            sctx.fillStyle = 'rgba(255,255,255,0.01)';
    if (sFood) {
        sctx.fillStyle = '#ff6b6b';
        sctx.shadowColor = 'rgba(255,100,100,0.2)';
        sctx.shadowBlur = 15;
        sctx.beginPath();
        sctx.arc(sFood.x * SZ + SZ/2, sFood.y * SZ + SZ/2, SZ/2 - 2, 0, Math.PI * 2);
        sctx.fill();
        sctx.shadowBlur = 0;
    }
    snake.forEach((seg, idx) => {
        const isHead = idx === 0;
        sctx.fillStyle = isHead ? '#fff' : 'var(--accent)';
        sctx.shadowColor = `rgba(100,180,255,${isHead ? 0.2 : 0.05})`;
        sctx.shadowBlur = isHead ? 15 : 5;
        sctx.fillRect(seg.x * SZ + 1, seg.y * SZ + 1, SZ - 2, SZ - 2);
        sctx.shadowBlur = 0;
    });
}

function moveSnake() {
    if (!sRunning || sPaused) return;
    sDir = { ...sNext };
    const head = { ...snake[0] };
    head.x += sDir.dx; head.y += sDir.dy;
    if (head.x < 0 || head.x >= S_COLS || head.y < 0 || head.y >= S_ROWS) { gameOverSnake(); return; }
    if (snake.some((seg, idx) => idx > 0 && seg.x === head.x && seg.y === head.y)) { gameOverSnake(); return; }
    snake.unshift(head);
    if (sFood && head.x === sFood.x && head.y === sFood.y) {
        sScore += 10;
        document.getElementById('snakeScore').textContent = 'Счёт: ' + sScore;
        updateSnakeBest();
        spawnFood();
    } else snake.pop();
    drawSnake();
}

function updateSnakeBest() {
    if (sScore > sBest) {
        sBest = sScore;
        localStorage.setItem('snakeBest', String(sBest));
        document.getElementById('snakeBest').textContent = sBest;
        document.getElementById('snakeSaveStatus').textContent = '🏆 Новый рекорд!';
        setTimeout(() => document.getElementById('snakeSaveStatus').textContent = '💾 Сохранено', 3000);
    }
}

function gameOverSnake() {
    clearInterval(sInterval); sRunning = false;
    document.getElementById('snakeStatus').textContent = '💥 Игра окончена!';
    alert('💥 Игра окончена! Счёт: ' + sScore);
    initSnake(); sRunning = true;
    sInterval = setInterval(moveSnake, 130);
}

document.getElementById('snakePause').addEventListener('click', () => {
    if (!sRunning) return;
    sPaused = !sPaused;
    document.getElementById('snakeStatus').textContent = sPaused ? '⏸ Пауза' : '▶ Игра идёт';
});

document.getElementById('snakeReset').addEventListener('click', () => {
    if (sInterval) clearInterval(sInterval);
    sRunning = true; sPaused = false;
    initSnake();
    sInterval = setInterval(moveSnake, 130);
});

document.getElementById('snakeSave').addEventListener('click', () => {
    localStorage.setItem('snakeBest', String(sBest));
    document.getElementById('snakeSaveStatus').textContent = '✅ Сохранено!';
    setTimeout(() => document.getElementById('snakeSaveStatus').textContent = '💾 Сохранено', 2000);
});

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('tab-games').classList.contains('active')) return;
    if (document.getElementById('game-snake').classList.contains('active')) {
        e.preventDefault();
        if (e.key === 'ArrowUp' && sDir.dy !== 1) sNext = {dx:0, dy:-1};
        if (e.key === 'ArrowDown' && sDir.dy !== -1) sNext = {dx:0, dy:1};
        if (e.key === 'ArrowLeft' && sDir.dx !== 1) sNext = {dx:-1, dy:0};
        if (e.key === 'ArrowRight' && sDir.dx !== -1) sNext = {dx:1, dy:0};
        if (!sRunning) {
            sRunning = true;
            if (sInterval) clearInterval(sInterval);
            sInterval = setInterval(moveSnake, 130);
        }
    }
});

document.querySelectorAll('[data-snake]').forEach(btn => {
    ['touchstart', 'mousedown'].forEach(ev => btn.addEventListener(ev, (e) => {
        e.preventDefault();
        if (!sRunning) {
            sRunning = true;
            if (sInterval) clearInterval(sInterval);
            sInterval = setInterval(moveSnake, 130);
        }
        const a = btn.dataset.snake;
        if (a === 'up' && sDir.dy !== 1) sNext = {dx:0, dy:-1};
        if (a === 'down' && sDir.dy !== -1) sNext = {dx:0, dy:1};
        if (a === 'left' && sDir.dx !== 1) sNext = {dx:-1, dy:0};
        if (a === 'right' && sDir.dx !== -1) sNext = {dx:1, dy:0};
    }));
});

// === СТАРТ ИГР ===
initTetris();
tRunning = true;
tInterval = setInterval(() => { if (tRunning && !tPaused) moveTetris(0, 1); }, 300);

initSnake();
