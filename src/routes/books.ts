import { Router, Request, Response, response } from 'express';
import { body, validationResult } from 'express-validator';
import { Book } from '../models/book';
import testBooks from '../tests/testBooks';

const router = Router();



let books: Book[] = [];

// Hacky way to generate test data for unit tests
// I populate the server with some data so you can actually test if the API works
// if (process.env.NODE_ENV === 'test') {
    books.push(...testBooks);
// }

const bookValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('discount').notEmpty().withMessage('Discount is required, use 0 if not discounted'),
    body('author').notEmpty().withMessage('Author is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('price').notEmpty().withMessage('Sell price is required'),
    
];

router.post('/', bookValidationRules, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    
    // create a new task:
    const book: Book = {
        id: books.length+1,
        title: req.body.title,
        author: req.body.author,
        discount: req.body.discount,
        genre: req.body.genre,
        price: req.body.price,
    };

    books.push(book);
    res.status(201).json(book)

});

// Update a book with validation
router.put('/:id', bookValidationRules, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const book = books.find((t) => t.id === parseInt(req.params.id));
  
    if (!book) {
      res.status(404).send('Error updating book - book not found');
    } else {
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.discount = req.body.discount || book.discount;
        book.genre = req.body.genre || book.genre;
        book.price = req.body.price || book.price;
  
      res.json(book);
    }
});
  

// retrieve all books
router.get('/', (req: Request, res: Response) => {
    // TODO: Implement multiple-filtering, where both say a genre and an author could be specified.
    // Beyond the scope of the assignment though, so not doing now
    const genre = req.query.genre?.toString();

    if (!genre){
        res.json(books);
    }
    else {
        res.json(getBooks(genre))
    }

    
})

// read a single book by ID
router.get('/:id', (req: Request, res: Response) => {
    const book = books.find((t) => t.id === parseInt(req.params.id));

    if (!book) {
        res.status(404).send('Error reading book - book not found')
    } else {
        res.json(book);
    }
});

//delete a book by ID:
router.delete('/:id', (req: Request, res: Response) => {
    const index = books.findIndex((t) => t.id === parseInt(req.params.id));
  
    if (index === -1) {
        res.status(404).send('Error deleting book - book not found');
    } else {
        books.splice(index, 1);
        res.status(204).send();
    }
  });

export function getBooks(genre: string): Book[] {
    return books.filter(book => book.genre === genre);
}


export default router;