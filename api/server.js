import express from 'express';
import cors from 'cors';
import promotionsRouter from './routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use('/', promotionsRouter);

app.listen(PORT, () =>
  console.log(`API proxy rodando em http://localhost:${PORT}`)
);