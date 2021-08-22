$(document).ready(function() {

    const listEl = $('.task__list');
    const emptyMessageEl = $('.task__empty-text');

    const addFormEl = $('.add__form');
    const addTaskInputEl = $('.add__task-input', addFormEl);
    const addDescInputEl = $('.add__desc-input', addFormEl);

    //настройка нижнего пэддинга и расчет максимальной высоты блока с описанием

    const calculateItemHeight = function(itemEl) {
        const descEl = $('.task__article-desc', itemEl);
        const descLineHeight = parseInt(descEl.css('lineHeight'));
        const descFontSize = parseInt(descEl.css('fontSize'));
        const descHeight = descEl.outerHeight();
        const minDescHeight = descLineHeight * 3 + descFontSize;

        if (descHeight < minDescHeight) {
            const paddingBottom = minDescHeight - descHeight + descFontSize * 0.5;

            descEl.css('paddingBottom', `${paddingBottom}px`);
        }
    };

    // обработчик отправки формы

    addFormEl.on('submit', function(evt) {
        evt.preventDefault();
        const taskInput = addTaskInputEl.val();
        const descInput = addDescInputEl.val();
        const descId = `f${(~~(Math.random()*1e8)).toString(16)}`;

        emptyMessageEl.hide();

        listEl.prepend(`<li class="task__item">
											<article class="task__article">
												<header class="task__article-header">
													<h3 class="task__article-title">${taskInput}</h3>
													<button class="task__article-delete" type="button">
														<span class="visually-hidden">Удалить дело</span>
													</button>
													<button class="task__article-hide" type="button" aria-expanded="true" aria-controls="${descId}">
														<span class="visually-hidden">Описание</span>
													</button>
												</header>
												<div class="task__article-desc-wrap">
													<p id="${descId}" class="task__article-desc">${descInput}</p>
												</div>
											</article>
										</li>`);

        const newItemEl = $('li:first-child', listEl);

        calculateItemHeight(newItemEl);

        this.reset();
        addTaskInputEl.focus();
    });

    //делегированная функция удаления дела

    listEl.on('click', '.task__article-delete', function(evt) {
        $(this).closest('.task__item').remove();

        if (!listEl.children().length) {
            emptyMessageEl.show();
            addTaskInputEl.focus();
        }

    });

    //делегированная функция сворачивания описания

    listEl.on('click', '.task__article-hide', function(evt) {
        const articleEl = $(this).closest('.task__article');
        const descWrapEl = $('.task__article-desc-wrap', articleEl);

        //установка артибута aria-expanded

        const expanded = $(this).attr('aria-expanded') === 'true';

        $(this).attr('aria-expanded', !expanded);

        //анимация сворачивания описания и повотора стрелки

        $(this).toggleClass('rotate');
        descWrapEl.slideToggle(300);
    });
});