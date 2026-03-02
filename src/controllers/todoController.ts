import { Response } from "express";
import { Todo } from "../models/todoModel";
import { createTodoSchema, updateTodoSchema } from "../validations/todoValidation";
import { AuthRequest } from "../middleware/authMiddleware";

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createTodoSchema.parse(req.body);

    const newTodo = await Todo.create({
      ...validatedData,
      user: req.user!.id,
    });

    res.status(201).json({
      message: "Todo created successfully",
      data: newTodo,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find({ user: req.user!.id }).sort({ createdAt: -1 });

    res.status(200).json({
      count: todos.length,
      data: todos,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTodoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user!.id,
    });

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json(todo);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = updateTodoSchema.parse(req.body);

    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user!.id,
      },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json({
      message: "Todo updated",
      data: updatedTodo,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user!.id,
    });

    if (!deletedTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};