// 現在時刻を表示する簡単なスクリプト
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ja-JP');
    document.getElementById('time').textContent = timeString;
}

// 初回実行
updateTime();

// 1秒ごとに更新
setInterval(updateTime, 1000);