const listEl = document.querySelector('.task__list');
const emptyMessageEl = document.querySelector('.task__empty-text');

const addFormEl = document.querySelector('.add__form');
const addTaskInputEl = addFormEl.querySelector('.add__task-input');
const addDescInputEl = addFormEl.querySelector('.add__desc-input');

const itemsElements = listEl.children;

//шаблонизатор элементов списка дел
const makeItem = (task, description) => {
    const itemEl = document.createElement('li');
    const descId = `f${(~~(Math.random()*1e8)).toString(16)}`;

    itemEl.classList.add('task__item');
    itemEl.insertAdjacentHTML('afterbegin',
        `<article class="task__article">
						<header class="task__article-header">
							<h3 class="task__article-title">${task}</h3>
							<button class="task__article-delete" type="button">
								<span class="visually-hidden">Удалить дело</span>
							</button>
							<button class="task__article-hide" type="button" aria-expanded="true" aria-controls="${descId}">
								<span class="visually-hidden">Описание</span>
							</button>
						</header>
						<div class="task__article-desc-wrap">
							<p id="${descId}" class="task__article-desc">${description}</p>
						</div>
					</article>`);
    return itemEl;
};

//настройка нижнего пэддинга и расчет максимальной высоты блока с описанием
const calculateItemHeight = (itemEl) => {
    const descEl = itemEl.querySelector('.task__article-desc');
    const descStyle = getComputedStyle(descEl);
    const descLineHeight = parseInt(descStyle.lineHeight);
    const descFontSize = parseInt(descStyle.fontSize);
    const descHeight = descEl.offsetHeight;
    const minDescHeight = descLineHeight * 3 + descFontSize;

    if (descHeight < minDescHeight) {
        const paddingBottom = minDescHeight - descHeight + descFontSize * 0.5;
        descEl.style.paddingBottom = paddingBottom + 'px';
    }

    const descWrapEl = itemEl.querySelector('.task__article-desc-wrap');
    descWrapEl.style.maxHeight = descWrapEl.scrollHeight + 'px';
};

addFormEl.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const taskInput = addTaskInputEl.value;
    const descInput = addDescInputEl.value;
    const newItemEl = makeItem(taskInput, descInput);

    if (!itemsElements.length) {
        emptyMessageEl.classList.toggle('display-none');
    }

    listEl.prepend(newItemEl);
    calculateItemHeight(newItemEl);

    addFormEl.reset();
    addTaskInputEl.focus();
});


//делегированная функция удаления дела
listEl.addEventListener('click', (evt) => {
    evt.preventDefault();
    const targetEl = evt.target;

    if (targetEl.classList.contains('task__article-delete')) {
        targetEl.closest('.task__item').remove();

        if (!itemsElements.length) {
            emptyMessageEl.classList.toggle('display-none');
            addTaskInputEl.focus();
        }
    }
});

//делегированная функция сворачивания описания
listEl.addEventListener('click', (evt) => {
    evt.preventDefault();
    const targetEl = evt.target;

    if (targetEl.classList.contains('task__article-hide')) {
        const articleEl = targetEl.closest('.task__article');
        const descWrapEl = articleEl.querySelector('.task__article-desc-wrap');

        //установка артибута aria-expanded
        let expanded = targetEl.getAttribute('aria-expanded') === 'true';

        targetEl.setAttribute('aria-expanded', !expanded);

        //анимация сворачивания описания и повотора стрелки
        targetEl.classList.toggle('rotate');

        if (expanded) {
            descWrapEl.style.maxHeight = 0;
            setTimeout(() => descWrapEl.classList.add('display-none'), 300);
        } else {
            descWrapEl.classList.remove('display-none');
            descWrapEl.style.maxHeight = descWrapEl.scrollHeight + 'px';
        }
    }
});