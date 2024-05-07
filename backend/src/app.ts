import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// Middleware for handling CORS POLICY
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET'],
        allowedHeaders: ['Content-Type'],
    })
);

routes(app);

app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
});
