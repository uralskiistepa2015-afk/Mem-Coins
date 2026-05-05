document.addEventListener('DOMContentLoaded', () => {
  // Инициализация данных пользователя
  const currentUser = localStorage.getItem('currentUser') || 'guest';

  let users = JSON.parse(localStorage.getItem('users')) || {};
  if (!users[currentUser]) {
    users[currentUser] = { balance: 100, transactions: [] };
    localStorage.setItem('users', JSON.stringify(users));
  }

  let userBalance = users[currentUser].balance;

  // Обновление баланс
  function updateBalance() {
    const balanceDiv = document.getElementById('balanceDisplay');
    if (balanceDiv) {
      balanceDiv.textContent = 'Баланс: ' + userBalance + ' МС';
    }
  }

  // Сохранение данных пользователя
  function saveUser() {
    users[currentUser].balance = userBalance;
    localStorage.setItem('users', JSON.stringify(users));
  }

  updateBalance();

  // Навигация
  document.getElementById('exitBtn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  document.getElementById('ticTacToeBtn')?.addEventListener('click', () => {
    window.location.href = 'tic-tac-toe.html';
  });
  document.getElementById('speedClickBtn')?.addEventListener('click', () => {
    window.location.href = 'speed-click.html';
  });
  document.getElementById('speedClickBetBtn')?.addEventListener('click', () => {
    window.location.href = 'speed-click.html';
  });

  // =======================
  // Игра "Speed Click" =======================
  const gameContainer = document.getElementById('gameContainer');
  if (gameContainer) {
    let gameActive = false;
    let animationId = null;
    let progress = 0;
    let moveDirection = 1; // 1 — вправо, -1 — влево
    let moveSpeed = 0.02; // скорость движения
    let greenZoneStart = Math.random() * 0.4;
    let greenZoneEnd = greenZoneStart + 0.2;
    let timerInterval = null;
    const gameDuration = 30; // сек
    let timeLeft = gameDuration;

    const greenRect = document.getElementById('greenRect'); // замените стрелку на зеленый прямоугольник
    const statusMsg = document.getElementById('statusMessage');
    const timeDisplay = document.getElementById('timeLeft');
    const betInput = document.getElementById('betAmount');
    const startBtn = document.getElementById('startGameBtn');

    // Запуск игры
    function startGame() {
      const betVal = parseFloat(betInput.value);
      if (isNaN(betVal) || betVal <= 0 || betVal > userBalance) {
        alert('Некорректная ставка или недостаточно средств!');
        return;
      }

      localStorage.setItem('currentBet', betVal);
      document.getElementById('betContainer').style.display = 'none';
      document.getElementById('gameArea').style.display = 'block';

      // Сброс переменных
      progress = 0;
      moveDirection = 1;
      gameActive = true;
      timeLeft = gameDuration;
      timeDisplay.textContent = 'Время: ' + timeLeft + ' сек';

      // случайная зеленая зона
      greenZoneStart = Math.random() * 0.4;
      greenZoneEnd = greenZoneStart + 0.2;

      // Таймер для отсчета времени
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          endGame(false);
        }
        if (timeDisplay) timeDisplay.textContent = 'Время: ' + timeLeft + ' сек';
      }, 1000);

      // Анимация
      if (animationId) cancelAnimationFrame(animationId);
      animate();
    }

    // Анимация зеленого прямоугольника
    function animate() {
      if (!gameActive) return;
      progress += moveSpeed * moveDirection;

      if (progress >= 1) {
        progress = 1;
        moveDirection = -1;
      }
      if (progress <= 0) {
        progress = 0;
        moveDirection = 1;
      }

      const containerWidth = document.getElementById('gameArea').offsetWidth;
      const rectWidth = document.getElementById('greenRect').offsetWidth;
      const maxX = containerWidth - rectWidth;
      document.getElementById('greenRect').style.transform = `translateX(${progress * maxX}px)`;

      animationId = requestAnimationFrame(animate);
    }

    // Обработчик клика - попробовать выиграть
    document.getElementById('gameArea')?.addEventListener('click', () => {
      if (!gameActive) return;
      // Проверка попадания в зеленую зону
      if (progress >= greenZoneStart && progress <= greenZoneEnd) {
        endGame(true);
      } else {
        endGame(false);
      }
    });

    // Завершение игры
    function endGame(win) {
      gameActive = false;
      cancelAnimationFrame(animationId);
      clearInterval(timerInterval);
      document.getElementById('betContainer').style.display = 'block';
      document.getElementById('gameArea').style.display = 'none';

      const bet = parseFloat(localStorage.getItem('currentBet')) || 10;

      if (win) {
        // выигрыш
        const winnings = bet * 2;
        userBalance += winnings;
        alert('Вы выиграли ' + winnings + ' МС!');
        if (statusMsg) statusMsg.textContent = 'Вы выиграли!';
      } else {
        // проигрыш: ставка вычитается
        userBalance -= bet;
        if (userBalance < 0) userBalance = 0;
        alert('Вы проиграли! Ставка ' + bet + ' вычтена из баланса.');
        if (statusMsg) statusMsg.textContent = 'Вы проиграли!';
      }
      saveUser();
      updateBalance();
    }

    // Кнопка старт
    startBtn?.addEventListener('click', startGame);
  }
  const regForm = document.getElementById("registerForm")
    regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("username").value;
    localStorage.setItem("currentUser", name);
    let allUsers = JSON.parse(localStorage.getItem("users")) ||{};
    if (!allUsers[name]) {
      allUsers[name] = {balance: 100, transactions: [] };

      window.location.href ="index.html";
    });
}
