import db from "../db/database.js";

//This is the service layer which is common for both HTTP and MCP

//This was earlier using an in-memory store(Array) but now uses Sqlite3 for Persistence.

//This layer's main task is to take the input from either HTTP routes or MCP server and insert data to Database and return confirmation along with object.

function createTodo(title) {
  if (!title || title.trim().length === 0) {
    throw new Error("No title found");
  }
  const result = db
    .prepare("INSERT INTO todos (title,done,user_id) VALUES(?,?,? )")
    .run(title, 0, 1);

  return { id: result.lastInsertRowid, title, done: false, userId: 1 };
}

function deleteTodo(id) {
  if (!Number.isInteger(id)) {
    throw new Error("Not a valid ID");
  }
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);

  if (!todo) {
    throw new Error("ID not found");
  }

  db.prepare("DELETE FROM todos WHERE id = ?").run(id);

  return {
    id: todo.id,
    title: todo.title,
    done: Boolean(todo.done),
    userId: todo.user_id,
  };
}

function toggleTodo(id) {
  if (!Number.isInteger(id)) {
    throw new Error("Not a valid ID");
  }
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);

  if (!todo) {
    throw new Error("ID not found");
  }

  const newDone = todo.done ? 0 : 1;

  db.prepare("UPDATE todos SET done = ? WHERE id = ?").run(newDone, id);

  return {
    id: todo.id,
    title: todo.title,
    done: Boolean(newDone),
    userId: todo.user_id,
  };
}

function listTodos() {
  const rows = db.prepare("SELECT * FROM todos").all();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    done: Boolean(row.done),
    userId: row.user_id,
  }));
}
export { createTodo, deleteTodo, toggleTodo, listTodos };
