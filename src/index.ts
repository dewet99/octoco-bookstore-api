import express, { NextFunction, Request, Response } from 'express';
import bookRoutes from './routes/books'
import discountedPriceRoutes from './routes/discounted-price'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Enable JSON parsing in req body
app.use('/books/discounted-price', discountedPriceRoutes);
app.use('/books', bookRoutes); //


// Define a route:
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TS EXPRESS!');
})

// Error handling middleware:
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong')
})

// start the server:
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });