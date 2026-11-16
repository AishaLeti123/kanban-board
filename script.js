// Это то, что мы будем сохранять в localStorage
const appData = {
  boards: [
    {
      id: 'board-1', // Уникальный ID для каждой доски
      title: 'Запуск продукта',
      description: 'План работ по релизу MVP',
      createdAt: '2023-10-27T10:00:00Z',
      columns: [
        {
          id: 'col-1',
          title: 'To Do',
          cards: [
            {
              id: 'card-1',
              title: 'Разработать прототип',
              description: 'Создать wireframes в Figma',
              deadline: '2023-11-05',
              assignee: 'Алексей',
              image: 'path/to/image.jpg' // Путь к изображению (пока пустой)
            },
            {
              id: 'card-2',
              title: 'Написать ТЗ',
              description: '',
              deadline: null,
              assignee: 'Мария',
              image: null
            }
          ]
        },
        {
          id: 'col-2',
          title: 'In Progress',
          cards: []
        },
        {
          id: 'col-3',
          title: 'Done',
          cards: []
        }
      ]
    },
    // ... другие доски
  ]
};
// --- Глобальные переменные и константы ---
const STORAGE_KEY = 'kanbanData';
let appData = {};

// --- Инициализация приложения ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderBoardsPage();
    setupEventListeners();
});

// --- Функции для работы с LocalStorage ---
function loadData() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        appData = JSON.parse(storedData);
    } else {
        // Начальные данные, если хранилище пустое
        appData = {
            boards: []
        };
        saveData();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    updateBoardsCount(); // Обновляем счетчик после сохранения
}

// --- Рендеринг страницы досок ---
function renderBoardsPage() {
    const boardsContainer = document.getElementById('boards-container');
    boardsContainer.innerHTML = ''; // Очищаем контейнер

    appData.boards.forEach(board => {
        const boardCard = createBoardCardElement(board);
        boardsContainer.appendChild(boardCard);
    });
    
    updateBoardsCount();
}

function createBoardCardElement(board) {
    const card = document.createElement('div');
    card.className = 'board-card';
    card.dataset.id = board.id; // Сохраняем ID доски в data-атрибуте

    const totalTasks = board.columns.reduce((sum, col) => sum + col.cards.length, 0);

    card.innerHTML = `
        <h3>${board.title}</h3>
        <p>${board.description || 'Без описания'}</p>
        <div class="meta">
            <span>${board.columns.length} колонок · ${totalTasks} задач</span>
            <span>${new Date(board.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
        </div>
    `;
    
    // При клике на карточку переходим на страницу доски
    card.addEventListener('click', () => {
        window.location.href = `board.html?id=${board.id}`;
    });

    return card;
}

function updateBoardsCount() {
    const boardsCountEl = document.getElementById('boards-count');
    const totalBoards = appData.boards.length;
    const totalTasks = appData.boards.reduce((sum, board) => {
        return sum + board.columns.reduce((colSum, col) => colSum + col.cards.length, 0);
    }, 0);
    boardsCountEl.textContent = `${totalBoards} досок · ${totalTasks} задач`;
}

// --- Обработчики событий ---
function setupEventListeners() {
    const createBoardBtn = document.getElementById('create-board-btn');
    const addBoardPlaceholder = document.querySelector('.add-board-placeholder');

    const handleCreateBoard = () => {
        const newBoard = {
            id: 'board-' + Date.now(), // Генерируем уникальный ID
            title: 'Новая доска',
            description: '',
            createdAt: new Date().toISOString(),
            columns: [
                { id: 'col-' + Date.now() + '-1', title: 'To Do', cards: [] },
                { id: 'col-' + Date.now() + '-2', title: 'In Progress', cards: [] },
                { id: 'col-' + Date.now() + '-3', title: 'Done', cards: [] }
            ]
        };
        appData.boards.push(newBoard);
        saveData();
        renderBoardsPage();
    };

    createBoardBtn.addEventListener('click', handleCreateBoard);
    addBoardPlaceholder.addEventListener('click', handleCreateBoard);
}