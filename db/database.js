import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

//This is the persistence layer created with Better-sqlite3 library, 
// unlike traditional sqlite3 which has complex callbacks and promises 
// this allows us to setup and use database in a more simpler and faster way due to it's synchronous nature

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "todos.db");
const db = new Database(dbPath);

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    user_id INTEGER
  )
`,
).run();

export default db;
