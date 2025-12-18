import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

// mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api", categoriesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
