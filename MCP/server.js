import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";
import {
  createTodo,
  deleteTodo,
  toggleTodo,
  listTodos,
} from "../service/todoService.js";

/* This is the MCP server which both creates a MCPserver instance and runs it and registers/exposes all the tools 

This calls the service layer internally

Each tool has 3 main components 
1. Tool description, 
2. Input schema, 
3.Handler function

Input schema is parsed and validated by Zod and handler functions calls the service layer and sends it required data. 

*/

const server = new McpServer(
  {
    name: "todo-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.registerTool(
  "listTodos",
  {
    description: "Return all todos",
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const todos = listTodos();
      return {
        content: [{ type: "text", text: JSON.stringify(todos) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.registerTool(
  "createTodo",
  {
    description: "Create a new Todo",
    inputSchema: z.object({ title: z.string() }),
  },
  async (input) => {
    try {
      const todo = createTodo(input.title);
      return { content: [{ type: "text", text: JSON.stringify(todo) }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error:${error.message}` }],
        isError: true,
      };
    }
  },
);

server.registerTool(
  "toggleTodo",
  {
    description: "Toggle todo status done from false to true and vice versa",
    inputSchema: z.object({ id: z.coerce.number() }),
  },
  async (input) => {
    try {
      const todoObj = toggleTodo(input.id);
      return { content: [{ type: "text", text: JSON.stringify(todoObj) }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error : ${error.message}` }],
        isError: true,
      };
    }
  },
);

server.registerTool(
  "deleteTodo",
  {
    description: "Delete an existing Todo",
    inputSchema: z.object({ id: z.coerce.number() }),
  },
  async (input) => {
    try {
      const todo = deleteTodo(input.id);
      return { content: [{ type: "text", text: JSON.stringify(todo) }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  },
);


const transport = new StdioServerTransport();
await server.connect(transport);
