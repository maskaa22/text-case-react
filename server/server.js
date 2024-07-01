import express from 'express';

import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/', transactionRouter);
app.use('/login', authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});