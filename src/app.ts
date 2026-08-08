import express from 'express';
import { urlRouter } from './routes/urls';
import { authRouter } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use("/", urlRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Relay running on port ${PORT}`)
})