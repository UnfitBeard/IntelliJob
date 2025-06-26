import express from 'express'
import pool from './db/db.config'
import cors from 'cors'
import authRoutes from './Routes/authRoutes'
import usersRoutes from './Routes/userRoutes'
import jobRouter from './Routes/jobRoutes'
import geminiRouter from './Routes/AIGeminiRoutes'
import { AppDataSource } from './db/dataSource'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  }));

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", usersRoutes)
app.use("/api/v1/jobs", jobRouter)
app.use("/api/v1/gemini", geminiRouter)

app.listen(3000, async () => {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log('Database initialized successfully');

    // Start listening for incoming requests only after the database is initialized
    console.log('The server is listening on port 3000');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit the process if database connection fails
  }
});