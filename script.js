const cards = document.querySelectorAll('.mode-card');
const startButton = document.getElementById('startButton');
const logoTop = document.querySelector('.logo-top');
const modeSelection = document.getElementById('modeSelection');
const gameSetup = document.getElementById('gameSetup');
const passRevealPhase = document.getElementById('passRevealPhase');
const resultScreen = document.getElementById('resultScreen');
const modeName = document.getElementById('modeName');
const playerNameInput = document.getElementById('playerNameInput');
const addPlayerButton = document.getElementById('addPlayerButton');
const playersList = document.getElementById('playersList');
const playerCount = document.getElementById('playerCount');
const playersStatus = document.getElementById('playersStatus');
const startGameButton = document.getElementById('startGameButton');
const impostorSlider = document.getElementById('impostorInput');
const impostorCount = document.getElementById('impostorInput');
const sliderHint = document.getElementById('inputHint');
const addBotsButton = document.getElementById('addBotsButton');
const settingsButton = document.getElementById('settingsButton');
const backHomeButton = document.getElementById('backHomeButton');
const backHomeButton2 = document.getElementById('backHomeButton2');
const backHomeButton3 = document.getElementById('backHomeButton3');
const decreaseImpostor = document.getElementById('decreaseImpostor');
const increaseImpostor = document.getElementById('increaseImpostor');

// Pass & Reveal elements
const currentPlayerName = document.getElementById('currentPlayerName');
const cardFlip = document.getElementById('cardFlip');
const cardContainer = document.getElementById('cardContainer');
const roleIcon = document.getElementById('roleIcon');
const roleTitle = document.getElementById('roleTitle');
const roleDescription = document.getElementById('roleDescription');
const passActions = document.getElementById('passActions');
const nextPlayerButton = document.getElementById('nextPlayerButton');
const cardFront = document.getElementById('cardFront');

// Result screen elements
const revealCard = document.getElementById('revealCard');
const impostorList = document.getElementById('impostorList');
const allPlayersList = document.getElementById('allPlayersList');
const revealButton = document.getElementById('revealButton');
const playAgainButton = document.getElementById('playAgainButton');

// Password modal elements
const passwordModal = document.getElementById('passwordModal');
const passwordOverlay = document.getElementById('passwordOverlay');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');
const passwordCancel = document.getElementById('passwordCancel');
const passwordConfirm = document.getElementById('passwordConfirm');

let pendingModeCard = null;

let selectedMode = null;
let players = [];
let botCounter = 1;
let gameData = [];
let currentPlayerIndex = 0;

// Word pools for different modes
const wordPools = {
  polite: [
    'قميص', 'جاكيت', 'بنطلون', 'تيشيرت', 'هودي', 'فستان', 'حذاء', 'جورب', 'قبعة', 'وشاح', 
    'بدلة', 'معطف', 'سترة', 'حزام', 'نظارة', 'بيتزا', 'برجر', 'مكرونة', 'أرز', 'دجاج',
    'سمك', 'سلطة', 'ساندويتش', 'شوربة', 'تفاح', 'موز', 'برتقال', 'آيس كريم', 'شوكولاتة', 'كيك',
    'هاتف', 'لابتوب', 'كتاب', 'قلم', 'دفتر', 'حقيبة', 'ساعة', 'طاولة', 'كرسي', 'زجاجة',
    'شاحن', 'كاميرا', 'تلفاز', 'ريموت', 'مفتاح', 'طبيب', 'مهندس', 'معلم', 'مبرمج', 'مصمم',
    'طباخ', 'ممرضة', 'طيار', 'كاتب', 'مصور', 'محاسب', 'صيدلي', 'شرطي', 'محامي', 'عامل',
    'مدرسة', 'مستشفى', 'مطعم', 'منزل', 'مكتب', 'جامعة', 'مكتبة', 'حديقة', 'مدينة', 'شارع',
    'بحر', 'شاطئ', 'مطار', 'محطة', 'فندق', 'لعبة', 'فيلم', 'موسيقى', 'أغنية', 'كتاب',
    'كرة', 'فريق', 'صديق', 'عائلة', 'احتفال', 'عيد', 'رحلة', 'سيارة', 'دراجة', 'قطار',
    'وقت', 'يوم', 'ليل', 'شمس', 'قمر', 'نجمة', 'مطر', 'حلم', 'نجاح', 'حب'
  ],
  impolite: [
    'اختبار حمل', 'رقص', 'خازوق', 'شاور', 'مايوه', 'مفجوع', 'سجن', 'شطافة', 'توته 🍑', 
    'حامل', 'تحرش', 'خروف', 'خمرة', 'حمام', 'ديسكو', 'لبوسة', 'مناكير', 'بوكسر', 
    'رقاصة', 'بامبرز', 'مريم 😉', 'عيادة أمراض نساء'
  ],
  all: [] // Will be combined dynamically
};

const IMPOLITE_PASSWORD = '0000';
let impoliteUnlocked = false;

let selectedWord = null;

// Get random word from pool based on mode
function getRandomWord(mode) {
  let pool = [];
  
  if (mode === 'polite') {
    pool = wordPools.polite;
  } else if (mode === 'impolite') {
    pool = wordPools.impolite;
  } else if (mode === 'all') {
    // Combine both pools for All Mode
    pool = [...wordPools.polite, ...wordPools.impolite];
  } else {
    pool = wordPools.polite; // Fallback
  }
  
  if (pool.length === 0) return 'Word'; // Fallback
  
  // Shuffle pool and pick random word
  const shuffledPool = shuffleArray([...pool]);
  return shuffledPool[0];
}

// Reset to default background
function resetToDefaultBackground() {
  const body = document.body;
  body.style.background = 'radial-gradient(circle at top left, rgba(102, 126, 255, 0.12), transparent 18%), radial-gradient(circle at top right, rgba(205, 97, 255, 0.14), transparent 16%), radial-gradient(circle at bottom right, rgba(64, 79, 255, 0.08), transparent 18%), linear-gradient(180deg, #02040a 0%, #04070f 40%, #02030a 100%)';
  logoTop.style.background = 'linear-gradient(90deg, #b794f6 0%, #9333ea 25%, #7c3aed 50%, #a855f7 75%, #d8b4fe 100%)';
  logoTop.style.webkitBackgroundClip = 'text';
  logoTop.style.backgroundClip = 'text';
}

function setModeBackground(mode) {
  const body = document.body;
  if (mode === 'polite') {
    body.style.background = 'radial-gradient(circle at top left, rgba(52, 211, 153, 0.18), transparent 18%), radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 16%), radial-gradient(circle at bottom right, rgba(5, 150, 105, 0.12), transparent 18%), linear-gradient(180deg, #065f46 0%, #047857 40%, #065f46 100%)';
    logoTop.style.background = 'linear-gradient(90deg, #d1fae5 0%, #6ee7b7 25%, #34d399 50%, #10b981 75%, #a7f3d0 100%)';
  } else if (mode === 'impolite') {
    body.style.background = 'radial-gradient(circle at top left, rgba(248, 113, 113, 0.18), transparent 18%), radial-gradient(circle at top right, rgba(239, 68, 68, 0.15), transparent 16%), radial-gradient(circle at bottom right, rgba(220, 38, 38, 0.12), transparent 18%), linear-gradient(180deg, #7f1d1d 0%, #991b1b 40%, #7f1d1d 100%)';
    logoTop.style.background = 'linear-gradient(90deg, #fecaca 0%, #fca5a5 25%, #f87171 50%, #ef4444 75%, #fca5a5 100%)';
  } else if (mode === 'all') {
    body.style.background = 'radial-gradient(circle at top left, rgba(139, 92, 246, 0.15), transparent 18%), radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 16%), radial-gradient(circle at bottom right, rgba(109, 40, 217, 0.1), transparent 18%), linear-gradient(180deg, #2e1065 0%, #4c1d95 40%, #2e1065 100%)';
    logoTop.style.background = 'linear-gradient(90deg, #b794f6 0%, #9333ea 25%, #7c3aed 50%, #a855f7 75%, #d8b4fe 100%)';
  }
  logoTop.style.webkitBackgroundClip = 'text';
  logoTop.style.backgroundClip = 'text';
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const mode = card.dataset.mode;
    
    // Check if Impolite mode requires password
    if (mode === 'impolite' && !impoliteUnlocked) {
      showPasswordPrompt(card);
      return;
    }
    
    // Proceed with mode selection
    selectMode(card, mode);
  });
});

function showPasswordPrompt(card) {
  pendingModeCard = card;
  passwordModal.style.display = 'flex';
  passwordInput.value = '';
  passwordError.style.display = 'none';
  setTimeout(() => passwordInput.focus(), 100);
}

function closePasswordModal() {
  passwordModal.style.display = 'none';
  pendingModeCard = null;
  passwordInput.value = '';
  passwordError.style.display = 'none';
}

function checkPassword() {
  const enteredPassword = passwordInput.value;
  
  if (enteredPassword === IMPOLITE_PASSWORD) {
    impoliteUnlocked = true;
    closePasswordModal();
    if (pendingModeCard) {
      selectMode(pendingModeCard, 'impolite');
    }
  } else {
    passwordError.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Password modal events
passwordCancel.addEventListener('click', closePasswordModal);
passwordOverlay.addEventListener('click', closePasswordModal);

passwordConfirm.addEventListener('click', checkPassword);

passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkPassword();
  }
});

function selectMode(card, mode) {
  cards.forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  card.classList.add('active');
  card.setAttribute('aria-pressed', 'true');
  selectedMode = mode;
  startButton.disabled = false;
  
  // Change background based on selected mode
  setModeBackground(selectedMode);
}

startButton.addEventListener('click', () => {
  if (!selectedMode) return;
  
  // Hide mode selection and show game setup
  modeSelection.style.display = 'none';
  gameSetup.style.display = 'block';
  
  // Set mode name
  const modeNames = {
    'polite': 'Polite Mode',
    'impolite': 'Impolite Mode',
    'all': 'All Mode'
  };
  modeName.textContent = modeNames[selectedMode];
  
  // Apply mode-specific colors to mode name
  if (selectedMode === 'polite') {
    modeName.style.color = '#34d399';
  } else if (selectedMode === 'impolite') {
    modeName.style.color = '#f87171';
  } else if (selectedMode === 'all') {
    modeName.style.color = '#a855f7';
  }
});

// Add player functionality
function addPlayer(name, isBot = false) {
  if (players.length >= 15) {
    alert('Maximum 15 players allowed!');
    return;
  }
  
  const player = {
    id: Date.now() + Math.random(),
    name: name.trim(),
    isBot: isBot
  };
  
  players.push(player);
  renderPlayers();
  updateUI();
  playerNameInput.value = '';
}

function removePlayer(id) {
  players = players.filter(p => p.id !== id);
  renderPlayers();
  updateUI();
}

function renderPlayers() {
  if (players.length === 0) {
    playersList.innerHTML = '<p class="empty-state">Waiting for players...</p>';
    return;
  }
  
  playersList.innerHTML = players.map(player => `
    <div class="player-item">
      <span class="player-name">${player.name}${player.isBot ? ' (Bot)' : ''}</span>
      <button class="remove-player-button" onclick="removePlayer(${player.id})">Remove</button>
    </div>
  `).join('');
}

function updateUI() {
  const count = players.length;
  playerCount.textContent = count;
  
  // Update status
  if (count < 3) {
    playersStatus.textContent = `Need ${3 - count} more to start`;
    startGameButton.disabled = true;
    startGameButton.innerHTML = '<span class="start-icon">▶</span> WAITING FOR PLAYERS';
  } else {
    playersStatus.textContent = 'Ready to start!';
    startGameButton.disabled = false;
    startGameButton.innerHTML = '<span class="start-icon">▶</span> START GAME';
  }
  
  // Update impostor input max and validation
  const maxImpostors = Math.floor(count / 2);
  impostorSlider.max = Math.max(1, maxImpostors);
  
  const currentValue = parseInt(impostorSlider.value) || 1;
  if (currentValue > maxImpostors) {
    impostorSlider.value = Math.max(1, maxImpostors);
  }
  
  // Update buttons state
  updateImpostorButtons();
  
  // Update hint
  if (count < 4) {
    sliderHint.textContent = 'Need at least 4 players for more impostors.';
    sliderHint.style.color = 'rgba(255, 255, 255, 0.5)';
  } else {
    sliderHint.textContent = `You can have up to ${maxImpostors} impostors.`;
    sliderHint.style.color = 'rgba(255, 255, 255, 0.6)';
  }
}

function updateImpostorButtons() {
  const value = parseInt(impostorSlider.value) || 1;
  const min = parseInt(impostorSlider.min) || 1;
  const max = parseInt(impostorSlider.max) || 5;
  
  decreaseImpostor.disabled = value <= min;
  increaseImpostor.disabled = value >= max;
}

function validateAndSetValue(value) {
  const min = parseInt(impostorSlider.min) || 1;
  const max = parseInt(impostorSlider.max) || 5;
  
  let numValue = parseInt(value);
  
  if (isNaN(numValue) || numValue < min) {
    numValue = min;
  } else if (numValue > max) {
    numValue = max;
  }
  
  impostorSlider.value = numValue;
  updateImpostorButtons();
  return numValue;
}

// Decrease button
decreaseImpostor.addEventListener('click', () => {
  const currentValue = parseInt(impostorSlider.value) || 1;
  const newValue = Math.max(parseInt(impostorSlider.min) || 1, currentValue - 1);
  impostorSlider.value = newValue;
  
  // Add animation
  impostorSlider.classList.remove('value-increased', 'value-decreased');
  void impostorSlider.offsetWidth; // Trigger reflow
  impostorSlider.classList.add('value-decreased');
  
  updateImpostorButtons();
});

// Increase button
increaseImpostor.addEventListener('click', () => {
  const currentValue = parseInt(impostorSlider.value) || 1;
  const newValue = Math.min(parseInt(impostorSlider.max) || 5, currentValue + 1);
  impostorSlider.value = newValue;
  
  // Add animation
  impostorSlider.classList.remove('value-increased', 'value-decreased');
  void impostorSlider.offsetWidth; // Trigger reflow
  impostorSlider.classList.add('value-increased');
  
  updateImpostorButtons();
});

// Input change validation
impostorSlider.addEventListener('input', (e) => {
  validateAndSetValue(e.target.value);
});

impostorSlider.addEventListener('blur', (e) => {
  // Ensure valid value on blur
  validateAndSetValue(e.target.value);
});

// Remove animation class after animation ends
impostorSlider.addEventListener('animationend', () => {
  impostorSlider.classList.remove('value-increased', 'value-decreased', 'value-changed');
});

// Initialize on load
updateImpostorButtons();

// Make removePlayer global
window.removePlayer = removePlayer;

addPlayerButton.addEventListener('click', () => {
  const name = playerNameInput.value.trim();
  if (name) {
    addPlayer(name, false);
  }
});

playerNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const name = playerNameInput.value.trim();
    if (name) {
      addPlayer(name, false);
    }
  }
});

impostorSlider.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    validateAndSetValue(e.target.value);
    e.target.blur();
  }
});

addBotsButton.addEventListener('click', () => {
  const botsToAdd = Math.min(3, 15 - players.length);
  for (let i = 0; i < botsToAdd; i++) {
    addPlayer(`Bot ${botCounter++}`, true);
  }
});

settingsButton.addEventListener('click', () => {
  // Reset to mode selection
  modeSelection.style.display = 'block';
  gameSetup.style.display = 'none';
  players = [];
  botCounter = 1;
  renderPlayers();
  updateUI();
});

backHomeButton.addEventListener('click', () => {
  // Reset everything and go back to home
  modeSelection.style.display = 'block';
  gameSetup.style.display = 'none';
  
  // Reset selections
  cards.forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  selectedMode = null;
  startButton.disabled = true;
  
  // Reset players
  players = [];
  botCounter = 1;
  renderPlayers();
  updateUI();
  
  // Reset background to default
  resetToDefaultBackground();
});

backHomeButton2.addEventListener('click', resetGame);
backHomeButton3.addEventListener('click', resetGame);

function resetGame() {
  // Hide all screens
  gameSetup.style.display = 'none';
  passRevealPhase.style.display = 'none';
  resultScreen.style.display = 'none';
  modeSelection.style.display = 'block';
  
  // Reset all data
  cards.forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  selectedMode = null;
  selectedWord = null;
  impoliteUnlocked = false; // Reset password unlock
  startButton.disabled = true;
  players = [];
  gameData = [];
  currentPlayerIndex = 0;
  botCounter = 1;
  
  // Reset card
  cardFlip.classList.remove('flipped');
  passActions.style.opacity = '0';
  passActions.style.pointerEvents = 'none';
  
  renderPlayers();
  updateUI();
  resetToDefaultBackground();
}

startGameButton.addEventListener('click', () => {
  if (players.length >= 3) {
    startPassPhase();
  }
});

// Fisher-Yates shuffle algorithm for true randomness
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random unique indices for impostor selection
function getRandomImpostorIndices(totalPlayers, numImpostors) {
  const indices = [];
  const availableIndices = Array.from({ length: totalPlayers }, (_, i) => i);
  
  // Randomly select unique indices
  for (let i = 0; i < numImpostors; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    indices.push(availableIndices[randomIndex]);
    availableIndices.splice(randomIndex, 1);
  }
  
  return indices;
}

function startPassPhase() {
  // Step 1: Select random word for this round
  selectedWord = getRandomWord(selectedMode);
  
  // Step 2: Shuffle all players randomly (Fisher-Yates)
  const shuffledPlayers = shuffleArray(players);
  
  // Step 3: Get random impostor count
  const numImpostors = parseInt(impostorSlider.value);
  
  // Step 4: Randomly select impostor indices (NOT first N players)
  const impostorIndices = getRandomImpostorIndices(shuffledPlayers.length, numImpostors);
  
  // Step 5: Assign roles based on random indices
  gameData = shuffledPlayers.map((player, index) => ({
    ...player,
    role: impostorIndices.includes(index) ? 'impostor' : 'crew',
    word: selectedWord // All players get the same word for now
  }));
  
  // Step 6: Shuffle the final game data again for pass order randomness
  gameData = shuffleArray(gameData);
  
  currentPlayerIndex = 0;
  
  // Hide setup, show pass phase
  gameSetup.style.display = 'none';
  passRevealPhase.style.display = 'flex';
  
  // Apply mode class
  passRevealPhase.className = 'pass-reveal-phase mode-' + selectedMode;
  
  showCurrentPlayer();
}

function showCurrentPlayer() {
  const player = gameData[currentPlayerIndex];
  currentPlayerName.textContent = player.name;
  
  // Reset card
  cardFlip.classList.remove('flipped', 'shuffle');
  passActions.style.opacity = '0';
  passActions.style.pointerEvents = 'none';
  
  // Set up card content
  if (player.role === 'impostor') {
    roleTitle.textContent = 'IMPOSTOR';
    roleDescription.textContent = 'You must deceive others without being caught! Guess the secret word!';
    cardFront.style.borderColor = 'rgba(239, 68, 68, 0.4)';
  } else {
    roleTitle.textContent = 'CREW MEMBER';
    roleDescription.innerHTML = `Your secret word is:<br><strong style="font-size: 1.8rem; color: #34d399; margin-top: 0.5rem; display: block;">${player.word}</strong>`;
    cardFront.style.borderColor = 'rgba(52, 211, 153, 0.4)';
  }
}

// Card flip interaction
cardContainer.addEventListener('click', () => {
  if (!cardFlip.classList.contains('flipped')) {
    // Add shuffle effect
    cardFlip.classList.add('shuffle');
    
    setTimeout(() => {
      cardFlip.classList.remove('shuffle');
      cardFlip.classList.add('flipped');
      
      // Show next button after flip
      setTimeout(() => {
        passActions.style.opacity = '1';
        passActions.style.pointerEvents = 'auto';
      }, 600);
    }, 600);
  }
});

nextPlayerButton.addEventListener('click', () => {
  currentPlayerIndex++;
  
  if (currentPlayerIndex < gameData.length) {
    showCurrentPlayer();
  } else {
    showResultScreen();
  }
});

function showResultScreen() {
  passRevealPhase.style.display = 'none';
  resultScreen.style.display = 'flex';
  resultScreen.className = 'result-screen mode-' + selectedMode;
}

revealButton.addEventListener('click', () => {
  revealButton.style.display = 'none';
  revealCard.style.display = 'block';
  playAgainButton.style.display = 'block';
  
  // Show impostors
  const impostors = gameData.filter(p => p.role === 'impostor');
  impostorList.innerHTML = impostors.map((impostor, index) => `
    <div class="impostor-item" style="animation-delay: ${index * 0.1}s">
      ${impostor.name}
    </div>
  `).join('');
  
  // Show all players
  allPlayersList.innerHTML = gameData.map((player, index) => `
    <div class="player-role-item" style="animation-delay: ${index * 0.05}s">
      <span class="player-role-name">${player.name}</span>
      <span class="player-role-badge ${player.role}">
        ${player.role === 'impostor' ? 'Impostor' : 'Crew'}
      </span>
    </div>
  `).join('');
});

playAgainButton.addEventListener('click', () => {
  // Reset to setup with same players
  resultScreen.style.display = 'none';
  gameSetup.style.display = 'block';
  
  // Reset reveal
  revealCard.style.display = 'none';
  revealButton.style.display = 'flex';
  playAgainButton.style.display = 'none';
  
  // Reset game data for new round (this will generate a new word)
  gameData = [];
  currentPlayerIndex = 0;
  selectedWord = null; // Clear word for new round
  cardFlip.classList.remove('flipped');
  passActions.style.opacity = '0';
  passActions.style.pointerEvents = 'none';
});

