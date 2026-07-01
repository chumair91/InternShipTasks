class Book {
  constructor(title, author, isAvailable = true) {
    this.title = title;
    this.author = author;
    this.isAvailable = isAvailable;
  }

  getInfo() {
    return `Book ${this.title} written by ${this.author} is ${this.isAvailable ? "Available" : "Borrowed"} `;
  }
}

class Member {
  constructor(name) {
    this.name = name;
  }
  borrowedBooks = [];

  borrowBook(book) {
    if (!book.isAvailable) {
      console.log("Book already borrowed");
      return;
    }
    if (book.isAvailable) {
      this.borrowedBooks.push(book);
      book.isAvailable = false;
      return;
    }
  }

  returnBook(book) {
    this.borrowedBooks = this.borrowedBooks.filter((b) => b !== book);
    book.isAvailable = true;
    return;
  }

  getBorrowedBooksDetails() {
    console.log("printing borrowed book details");

    this.borrowedBooks.forEach((b) => {
      console.log(b);
    });
  }
}

class Ebook extends Book{
   constructor(title,author,fileSize){
    super(title,author);
    this.fileSize=fileSize;
   }
    getInfo() {
    return `${super.getInfo()} | File Size: ${this.fileSize}`;
  }
}

const book1 = new Book("Cpp", "umair");
const book2 = new Book("java", "Ali");

console.log(book1.getInfo());
const mem1 = new Member("Huzaifa");
mem1.borrowBook(book1);
mem1.borrowBook(book2);
mem1.getBorrowedBooksDetails();
mem1.returnBook(book1);
mem1.getBorrowedBooksDetails();

const ebook1=new Ebook("javaOnline","murtaza","15mb");

console.log(ebook1.getInfo());
