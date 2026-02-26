import mongoose, { Schema, Document } from "mongoose";
import { ITodo } from "../types/todo";

export interface ITodoDocument extends ITodo, Document {}

const todoSchema = new Schema<ITodoDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodoDocument>("Todo", todoSchema);