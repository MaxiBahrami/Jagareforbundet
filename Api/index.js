import express  from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { db } from "./db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import fetchDataAndSave from './data-fetching/data-fetching.js';

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: true,
  credentials: true
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000', 'https://jaktharry-app.netlify.app', 'https://jaktharry-app.vercel.app'); // Allow all origins (replace with specific origins if needed)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
})

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
})

// Routes for authentication, users, and posts
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Define a route to trigger the fetchAndSaveNews function immediately
app.get('/fetch-now', async (req, res) => {
  try {
    // Fetch data and save it to the database immediately for testing
    await fetchDataAndSave('riksUrl');
    await fetchDataAndSave('lansUrl');
    // await fetchDataAndSave('lokaltUrl');
    await fetchDataAndSave('aktiviteterUrl');

    res.send('Fetching and saving data now. Check the console for logs.');
  } catch (error) {
    console.error('Error fetching or saving news data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, this is your Express app!');
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    // Schedule the task to run once a day (e.g., at midnight)
    // cron.schedule('0 0 * * *', fetchDataAndSave);

    // app.listen(8800, () => {
    //   console.log("connected!!");
    // });

    const PORT = process.env.PORT || 6969;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }
});
