import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './connect.js';
import route from './routes/index.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const PORT = process.env.PORT;
const URI = process.env.URI;

route(app);
connectDB(URI);
app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
