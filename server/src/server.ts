import express from 'express';
import cors from 'cors';
import { userRouter } from './app/router/userRouter';
import { connectToDatabase } from './database/mongodb';
import { initRedis } from './services/redis';
import cookieParser from 'cookie-parser';
import { sellerRouter } from './app/router/sellerRouter';
import { adminRouter } from './app/router/adminRouter';
import { limiter } from './utils/rateLimitter';
import helmet from 'helmet';
import config from './config';

const app = express();

app.use(cors({
  origin: config.CORS_URL,
  credentials: true
}));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(limiter);

app.use('/api/', userRouter);
app.use('/api/seller/', sellerRouter);
app.use('/api/admin/', adminRouter)

const PORT = config.port;

const startServer = async () => {
  try {
      await connectToDatabase();
      await initRedis();
      app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
  } catch (error) {
    console.log('Error starting server', error);
  }
};

startServer();
