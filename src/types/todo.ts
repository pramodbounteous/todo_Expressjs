import { Types } from "mongoose";

export interface ITodo {
  title: string;
  description?: string;
  completed: boolean;
  user: Types.ObjectId;
}