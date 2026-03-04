# Agentic Todo Backend with MCP and HTTP API

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Architecture](https://img.shields.io/badge/architecture-service--layer-lightgrey)
![Protocol](https://img.shields.io/badge/protocol-MCP-black)

This project demonstrates how a backend system can expose functionality to both traditional applications and AI agents.

The system provides a Todo management backend that can be accessed in two ways:

1. Through a standard HTTP REST API
2. Through the Model Context Protocol (MCP), allowing AI agents such as Claude Desktop to call backend tools directly

Both interfaces share the same service layer and database, ensuring consistent behavior regardless of how the system is accessed.

## TLDR
Create and modify To-Do's from anywhere including AI agents when chatting with them. 
I'm building a multi-agentic system that will allow anyone to modify their todos from any agent. 
Setup guide and explanation of architecture given below, feel free to knock yourself out!
Also have Developer notes for a more raw take of my approach and future plan.



## Project Goals

The goal of this project was to understand how AI agents interact with real backend systems.

This project explores:

- Exposing backend capabilities as tools for AI agents
- Designing a shared service layer usable by multiple interfaces
- Persisting application data using SQLite
- Connecting Claude Desktop to a custom MCP server


## Architecture Overview

The system separates responsibilities into three layers.

- Interface layer (HTTP API and MCP tools)
- Service layer (business logic)
- Data layer (SQLite)

Both AI agents and traditional clients interact with the same service layer.





## Setup Guide

Follow the steps below to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/agentic-todo-mcp.git
cd agentic-todo-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the HTTP API

Run the REST API server.

```bash
node http/server.js
```

The API will start at:

```
http://localhost:3000
```

### 4. Test the HTTP API

Create a todo:

```bash
curl -X POST http://localhost:3000/todos \
-H "Content-Type: application/json" \
-d '{"title":"Learn MCP architecture"}'
```

Fetch all todos:

```bash
curl http://localhost:3000/todos
```

### 5. Start the MCP Server

Open a new terminal and run:

```bash
node mcp/server.js
```

The MCP server will wait for an AI client connection.

### 6. Configure Claude Desktop

Open Claude Desktop and go to:

```
Settings → Developer → Local MCP Servers
```

Edit the configuration file and add:

```json
{
  "mcpServers": {
    "todo-server": {
      "command": "node",
      "args": ["C:/absolute/path/to/agentic-todo-mcp/mcp/server.js"]
    }
  }
}
```

Replace the path with the actual path to your project directory.

### 7. Restart Claude Desktop

Close and reopen Claude Desktop so it loads the MCP server.

### 8. Test the MCP Tools

You can now interact with the backend using natural language.

Example prompts:

```
Create a todo called "Finish MCP tutorial"
```

```
List my todos
```

```
Toggle todo with id 1
```

Claude will call the MCP tools and interact with the backend.

### Database

The SQLite database is created automatically at:

```
db/todos.db
```

No manual setup is required.




## Key Learnings

This project provided practical experience with:

- Designing service layer architecture
- Exposing backend functionality to AI agents
- Building MCP servers
- Integrating Claude Desktop with custom tools
- Persisting application data using SQLite
- Structuring backend systems for extensibility



## Future Improvements

Planned extensions include:

- Multi-user authentication
- HTTP-based MCP server for remote agent access
- Collaborative project and bug tracking system
- Frontend dashboard for human interaction
- Support for additional AI agents and development environments

## Developer Notes

This project was intentionally structured to keep the service layer independent of the interface layer.

Both the HTTP API and MCP server call the same service functions, ensuring that business logic is defined in a single location.

This approach makes it easy to extend the system with additional interfaces in the future, such as:

- Web frontends
- CLI tools
- Other AI agents
- Remote MCP servers
  
Right now I'm using stdio transport protocol for MCP but upon shifting to HTTP, we'll be able to call these tools from various other agents.

If you want to use Langchain agents to call these tools we will need separate tool definitions as Langchain doesn't support MCP. I might do that next as well, depending on my mood.

