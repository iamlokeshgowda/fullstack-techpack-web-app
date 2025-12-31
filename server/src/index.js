import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import prductsRoutes from "./routes/product.routes.js";
import s3Routes from "./routes/s3.routes.js";
import publicRoutes from "./routes/public.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// mount auth routes
app.use("/api/auth", authRoutes);

//only admin can access these routes
app.use("/api/admin", prductsRoutes);
app.use("/api/admin", categoriesRoutes);
app.use("/api/admin/s3", s3Routes);
app.use("/api/public", publicRoutes);

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
