export interface Book {
    id: number;
    title: string;
    author: string,
    genre: string,
    price: number,
    discount: number,
  }

  // curl -X POST -H "Content-Type: application/json" -d '{"title": "Book Title", "genre": "Fiction", "author": "This Guy", "price": 10.99, "description": "Lorem ipsum", "discount": 0}' http://localhost:3000/books
