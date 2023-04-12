import { BookAPI } from './api-service';
const categoriesEl = document.querySelector('.categories-list');
const categoryBooksEl = document.querySelector('.category-books');
// const BookEl = document.querySelector('.book');

const bookApi = new BookAPI();

// handleRenderTopBooks(); // списки топ книг по категориям - пока віводится список категорий, книги  только в консоле
categoriesEl.addEventListener('click', handleRenderCategoryItem);
categoryBooksEl.addEventListener('click', handleBook);
// Рендерим список категорий
const renderCategories = async () => {
  try {
    const response = await bookApi.getCategories();
    const categoriesList = [...response.data].sort((a, b) => {
      return a.list_name.localeCompare(b.list_name);
    });
    categoriesEl.innerHTML = `<li class="category" data-id="all-categories">
  All categories
 </li>
    ${categoriesList
      .map(
        el => `<li class="category" >
  ${el.list_name}
 </li>`
      )
      .join('')}
    `;
  } catch (error) {
    console.log(error.message);
  }
};
renderCategories();

// список топ книг по категориям, загружаются сразу по умолчанию. надо подумать как прорисовать
function handleRenderTopBooks() {
  bookApi.getBooksTop().then(response => {
    const categoriesBooksList = [...response.data];
    // console.log(categoriesBooksList);
    categoriesBooksList.forEach(el => {
      //   console.log(el.books);
      categoriesBooksEl.insertAdjacentHTML(
        'beforeend',
        `<ul class="category-books data-${el.list_name}">${el.list_name}</ul>`
      );
      //   const categoryBooksEl =
      //     categoriesBooksEl.querySelector('.category-books');
      //   console.log(categoryBooksEl);
      //   el.books.forEach(e =>
      //     categoryBooksEl.insertAdjacentHTML(
      //       'beforeend',
      //       `<li class= categories-item><img class="book-link" src="${e.book_image}" > </img></li>`
      //     )
      //   );
    });
  });
}

//запрос книu по выбранной категории - считываем категорию со списка категорий - и нужно прорисовать книги из нее
async function handleRenderCategoryItem(event) {
  if (event.target.nodeName !== 'LI') {
    return;
  }
  event.preventDefault();
  console.log(event);

  try {
    const category = event.target.textContent.trim();

    if (category !== 'All categories') {
      const response = await bookApi.getBooksByCategories(category);
      const categoryBooks = response.data;
      console.log(categoryBooks);
      categoryBooksEl.innerHTML = `
    ${categoryBooks
      .map(
        el => `<li class="category-books" > <a href= "" class ="book"> <img src = ${el.book_image} data-id= ${el._id}> </a>
 </li>`
      )
      .join('')}
    `;
    }
    console.log('Категория: ', category); //надо будет вставить ссылку  на отрисовку топов
  } catch (error) {
    console.log(error.message);
  }
}
async function handleBook(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const id = event.target.dataset.id;
  console.log(id);
  const response = await bookApi.getBooksById(id);
  console.log(response.data); // откріваем модалку со всеми данніми по книге
}
