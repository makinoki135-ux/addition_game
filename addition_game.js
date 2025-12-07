// --- ゲーム要素の取得 ---
const leftNumDisplay = document.getElementById('left-num');
const rightNumDisplay = document.getElementById('right-num');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const startButton = document.getElementById('start-button');

// --- ゲームの状態変数 ---
let score = 0;
let timeLeft = 60; // 1分 (60秒)
let timerInterval;
let isGameActive = false;
let currentLeftNum = 0;
let currentRightNum = 0;

const TIME_LIMIT = 60;

// --- 1. ゲームの初期化と開始 ---

// 数字をランダムに生成 (0～9)
function generateNewNumbers() {
    currentLeftNum = Math.floor(Math.random() * 10);
    currentRightNum = Math.floor(Math.random() * 10);
    
    leftNumDisplay.textContent = currentLeftNum;
    rightNumDisplay.textContent = currentRightNum;
}

// タイマーの開始
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

// ゲーム開始処理
function startGame() {
    score = 0;
    timeLeft = TIME_LIMIT;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    isGameActive = true;
    
    messageDisplay.textContent = "";
    startButton.style.display = 'none'; // スタートボタンを隠す
    
    generateNewNumbers(); // 最初の問題を表示
    startTimer();
    // キーボードイベントリスナーを有効化
    document.addEventListener('keydown', handleKeyPress);
}

// --- 2. 判定ロジック ---

// 正しいキーを計算する関数
function getCorrectKey(left, right) {
    if (left + right === 10) {
        // 最優先：足して10になる場合
        return 'ArrowUp';
    } else if (left === right) {
        // 次に判定：左右の数字が等しい場合
        return 'ArrowDown';
    } else if (left > right) {
        // 左の数字が大きい場合
        return 'ArrowLeft';
    } else { // right > left の場合
        // 右の数字が大きい場合
        return 'ArrowRight';
    }
}

// ユーザー入力の処理
function handleKeyPress(event) {
    if (!isGameActive) return; // ゲームがアクティブでない場合は無視
    
    const keyPressed = event.key;
    const correctKey = getCorrectKey(currentLeftNum, currentRightNum);
    
    let isCorrect = false;
    
    // 矢印キーのみをチェック対象とする
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(keyPressed)) {
        event.preventDefault(); // 画面のスクロールを防ぐ
        
        if (keyPressed === correctKey) {
            isCorrect = true;
        }
        
        handleResult(isCorrect);
    }
}

// 結果の処理（スコア更新とメッセージ表示）
function handleResult(isCorrect) {
    if (isCorrect) {
        score++;
        messageDisplay.textContent = "○ 正解！";
        messageDisplay.style.color = "#28a745";
    } else {
        score = Math.max(0, score - 1); // 1減点（ただしスコアは0未満にならない）
        messageDisplay.textContent = "× 不正解... -1点";
        messageDisplay.style.color = "#dc3545";
    }
    
    scoreDisplay.textContent = score;
    generateNewNumbers(); // 新しい問題へ
    
    // メッセージを短時間表示して消す
    setTimeout(() => {
        messageDisplay.textContent = "";
    }, 500);
}

// --- 3. ゲーム終了処理 ---

function gameOver() {
    isGameActive = false;
    document.removeEventListener('keydown', handleKeyPress); // キー入力を無効化
    
    leftNumDisplay.textContent = ":)";
    rightNumDisplay.textContent = ":D";
    messageDisplay.textContent = `ゲーム終了！最終スコアは ${score} 点です！`;
    messageDisplay.style.color = "#007bff";
    
    startButton.textContent = "もう一度プレイ！";
    startButton.style.display = 'block'; // スタートボタンを再表示
}

// --- 4. イベントリスナー ---
startButton.addEventListener('click', startGame);

// 初期表示
leftNumDisplay.textContent = "?";
rightNumDisplay.textContent = "?";