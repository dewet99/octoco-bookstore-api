import request from 'supertest'; // Import supertest for making HTTP requests
import app from '../index'; // Import your Express app
import { getBooks } from '../routes/books';
import testBooks from './testBooks';


// Mock book data
const books = testBooks;


describe('GET /books/discounted-price', () => {
    test('Returns 400 with error message for invalid genre', async () => {
        // Make a request with an invalid genre
        const response = await request(app).get('/books/discounted-price?genre=&discount=10');
        
        // Assert that the response has a 400 status code and contains an error message
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    test('Calculates discounted price correctly', async () => {
        // Make a request with valid genre and discount percentage
        const response = await request(app).get('/books/discounted-price?genre=Fiction&discount=10');
        
        // Assert that the response has a 200 status code
        expect(response.status).toBe(200);

        // Assert that the response body contains the expected properties
        expect(response.body).toHaveProperty('genre', 'Fiction');
        expect(response.body).toHaveProperty('discountPercentage', 10);
        expect(response.body).toHaveProperty('total_discounted_price');

        // Calculate expected discounted price
        const totalPrice = books.filter(book => book.genre === 'Fiction').reduce((total, book) => total + book.price, 0);
        const expectedDiscountedPrice = totalPrice * (1 - 0.1); // 10% discount

        // Assert that the calculated discounted price matches the one in the response
        expect(response.body.total_discounted_price).toBe(expectedDiscountedPrice);
    });
});