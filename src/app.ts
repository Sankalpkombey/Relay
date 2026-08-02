import express from 'express';
import { urlRouter } from './routes/urls';

const app = express();

app.use(express.json());
app.use("/", urlRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Relay running on port ${PORT}`)
})