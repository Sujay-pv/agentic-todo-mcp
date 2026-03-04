import express, { json } from "express";
import {
  createTodo,
  deleteTodo,
  listTodos,
  toggleTodo,
} from "../service/todoService.js";

//This is a traditional node server that exposes http api's, this intakes requests and calls the service layer internally

const app = express();
const port = 3000;
app.listen(port);

// For context this is the in-memory store I was using earlier just to test out, literally no setup.
// const todos = [];
// let nextId = 1;

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/todos", (req, res) => {
  const todos = listTodos();
  res.json(todos);
});

app.use(json());

app.post("/test", (req, res) => {
  const receivedData = req.body;
  console.log(receivedData);
  res.json({ message: "Data received", data: receivedData });
});

app.post("/todos", (req, res) => {
  try {
    const title = req.body.title;
    const todoObj = createTodo(title);
    res.status(201).json({ data: todoObj });
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedObj = deleteTodo(id);
    res.status(200).json({ message: "Deleted Successfully", data: deletedObj });
  } catch (error) {
    res.json({ message: `${error.message}` });
  }
});

app.patch("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const updatedTodo = toggleTodo(id);
    res
      .status(200)
      .json({ message: "Successfully Updated", data: updatedTodo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
