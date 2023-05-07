import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import Post from "./models/Post.js";
import authRoutes from "./routes/auth.js"
import { register } from "./controllers/auth.js";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { verifyToken } from "./middleware/auth.js";
import {createPost} from "./controllers/posts.js" 

const userIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
  ];

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
const upload = multer({ storage });
app.post("/auth/register", register)
app.post("/posts", verifyToken, upload.single('picture'), createPost)


app.get("/home", (req, res)=> {
  res.send("hello world")
})

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use('/posts', postRoutes)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
    // User.insertMany({
    //     _id: userIds[0],
    //     firstName: "test",
    //     lastName: "me",
    //     email: "aaaaaaa@gmail.com",
    //     password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    //     picturePath: "p11.jpeg",
    //     friends: [],
    //     location: "San Fran, CA",
    //     occupation: "Software Engineer",
    //     viewedProfile: 14561,
    //     impressions: 888822,
    //     createdAt: 1115211422,
    //     updatedAt: 1115211422,
    //     __v: 0,
    //   })
  })
  .catch((error) => console.log(`${error} did not connect`));