import { Request, Response } from "express";
import { Todo } from "../models/todoModel";
import { createTodoSchema, updateTodoSchema } from "../validations/todoValidation";

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createTodoSchema.parse(req.body);

    const newTodo = await Todo.create(validatedData);

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

export const getTodos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });

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

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findById(req.params.id);

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

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateTodoSchema.parse(req.body);

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
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

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

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