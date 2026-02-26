import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import todoRoutes from "./routes/todoRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

connectDB().then(() => {
  app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
});

app.get("/", (_req, res) => {
  res.json({ message: "Todo API Running 🚀" });
});

app.use("/todos", todoRoutes);
