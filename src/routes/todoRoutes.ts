import { Router } from "express";
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createTodo);
router.get("/", authenticate, getTodos);
router.get("/:id", authenticate, getTodoById);
router.put("/:id", authenticate, updateTodo);
router.delete("/:id", authenticate, deleteTodo);

export default router;