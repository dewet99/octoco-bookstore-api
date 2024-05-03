import { Router, Request, Response, response } from 'express';
import { body, validationResult } from 'express-validator';
import { Book } from '../models/book';
import { getBooks } from './books'; // Import the getBooks function

const router = Router();

// Calculate and return discounted price
router.get('/', (req: Request, res: Response) => {
    const genre = req.query.genre as string;
    const discountPercentage = parseFloat(req.query.discount as string);
    
    // debug

    // Validate query parameters
    if (!genre || isNaN(discountPercentage) || discountPercentage<0 || discountPercentage>100) {
        return res.status(400).json({error: "Invalid genre or discount percentage value"});
    }

    // Filter books by the specified genre:
    const genreBooks = getBooks(genre);
    // Calculate total price and discounted price
    const totalPrice = genreBooks.reduce((total, book) => total + book.price, 0);
    const total_discounted_price = totalPrice * (1-discountPercentage/100);

    res.json({genre, discountPercentage, total_discounted_price });
});

export default router;