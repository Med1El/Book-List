class Book {

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}

class UI {

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href='#' class="link-background edit" >□</a></td>
         <td><a href='#' class="link-background delete" >x</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(target) {
            target.parentElement.parentElement.remove();
    }

    static updateBooksList(){
        const Tbody = document.querySelector('#book-list');
        Tbody.innerHTML = '';
        this.displayBooks();
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static fillFields(isbn) {
        const book = Store.getBookByIsbn(isbn);
        document.querySelector('#title').value = book.title;
        document.querySelector('#author').value = book.author;
        document.querySelector('#isbn').value = book.isbn;
    }

    static showAlert(className, message) {
        const alert = document.querySelector('#alert');
        alert.hidden = false;
        alert.className = className;
        alert.innerHTML = message;
        //alert.appendChild(document.createTextNode(message));
        setTimeout( function () { alert.hidden = true }, 2500);
    }

    static disableIsbn(){
        document.querySelector('#isbn').disabled=true;
        document.querySelector('#isbn').classList.add('grayed');
    }

    static enableIsbn(){
        document.querySelector('#isbn').disabled=false;
        document.querySelector('#isbn').classList.remove('grayed');
    }

}

class Store {

    static isUpdate = false;

    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static saveOrUpdateBook(book){
        if(this.isUpdate){
        const books = Store.getBooks();
        books.forEach((bk, index)=>{
            if(bk.isbn===book.isbn){
                //books.splice(index,1);
                books[index]=book;
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
        this.isUpdate=false;
        } else {
            const books = Store.getBooks();
            books.push(book);
            localStorage.setItem('books',JSON.stringify(books));
        }
    }

    static getBookByIsbn(isbn){
        const books = Store.getBooks();
        let book = null;
        books.forEach((bk, index) => {
            if(bk.isbn===isbn){
                book = bk;
            }
        });
        return book;
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }
}

//==Events==//

document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('error','Please Fill in All the Fields');
    }
    else if (Store.isUpdate) {
        const book = new Book(title, author, isbn);
        Store.saveOrUpdateBook(book);
        UI.updateBooksList();
        //UI.addBookToList(book);
        UI.clearFields();
        UI.showAlert('success','Book Updated');
        UI.enableIsbn();
    } else {
        const book = new Book(title, author, isbn);
        Store.saveOrUpdateBook(book);
        UI.addBookToList(book);
        UI.clearFields();
        UI.showAlert('success','Book Added'); 
    }
});

document.querySelector('#book-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    UI.deleteBook(e.target);
    UI.showAlert('success','Book Removed');
    } else if (e.target.classList.contains('edit')) {
        UI.fillFields(e.target.parentElement.previousElementSibling.textContent);
        UI.disableIsbn();
        Store.isUpdate=true;

    }
});