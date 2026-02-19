import express from "express";
import cors from "cors";
import { connection } from "./src/Database/db.js";
import { userRouter } from "./src/Routes/userRoutes.js";
import authRouter from "./src/Routes/authRoutes.js"; 
import studyMaterialRouter from "./src/Routes/studyMaterialRoutes.js";
import path from "path"; 
import "./src/Model/userModel.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));

// parse JSON bodies
app.use(express.json());

app.use("/uploads/materials", express.static(path.join("./uploads/materials")));
app.use("/uploads/profiles", express.static(path.join("./uploads/profiles")));

// DB connection
connection()
  .then(async () => {
    console.log("Database connected");
  })
  .catch((err) => console.error("DB connection failed:", err));

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/materials", studyMaterialRouter);



// Landing page
app.get("/", (req, res) => res.send("User API is running"));

app.listen(5000, () => console.log("Server running on port 5000"));
