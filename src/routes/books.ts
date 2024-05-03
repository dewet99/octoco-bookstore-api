import { Router, Request, Response, response } from 'express';
import { body, validationResult } from 'express-validator';
import { Book } from '../models/book';

const router = Router();
let books: Book[] = [];

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
  

// retrieve all tasks
router.get('/', (req: Request, res: Response) => {
    res.json(books);
})

// read a single task by ID
router.get('/:id', (req: Request, res: Response) => {
    const book = books.find((t) => t.id === parseInt(req.params.id));

    if (!book) {
        res.status(404).send('Error reading book - book not found')
    } else {
        res.json(book);
    }
});

//delete a task by ID:
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
    return books.filter((book) => book.genre === genre);
}


export default router;