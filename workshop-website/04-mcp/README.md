# MCP - Extend Kiro Capabilities

## Apa itu MCP?

Model Context Protocol (MCP) memungkinkan Kiro untuk connect dengan external tools dan services. Ini membuka possibilities untuk integrate dengan databases, APIs, cloud services, dan banyak lagi.

## Konfigurasi

MCP dikonfigurasi via `mcp.json` files:
- User level: `~/.kiro/settings/mcp.json` (global)
- Workspace level: `.kiro/settings/mcp.json` (per project)

## Format Konfigurasi

```json
{
  "mcpServers": {
    "server-name": {
      "command": "uvx",
      "args": ["package-name@latest"],
      "env": {
        "ENV_VAR": "value"
      },
      "disabled": false,
      "autoApprove": ["tool-name"]
    }
  }
}
```

## Popular MCP Servers

### AWS Documentation
```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}
```

### Database Access
Untuk connect ke PostgreSQL, MySQL, SQLite, dll.

### File System
Extended file operations

### Web APIs
Integrate dengan external APIs

## Use Cases untuk Vibe Coding

1. **Database Queries** - Query database langsung dari Kiro
2. **Cloud Services** - Deploy, monitor, manage cloud resources
3. **Documentation** - Access latest docs tanpa leave IDE
4. **Custom Tools** - Build your own MCP server untuk specific needs

## Installation

MCP servers biasanya require `uv` dan `uvx`:
```bash
# Install via pip
pip install uv

# Or via homebrew (macOS)
brew install uv
```

## Management

- View MCP servers di Kiro feature panel
- Reconnect servers dari MCP Server view
- Auto-reconnect on config changes
- Test tools dengan sample calls

## Best Practices

- Start dengan official MCP servers
- Use autoApprove untuk trusted tools
- Set appropriate environment variables
- Monitor logs untuk debugging
