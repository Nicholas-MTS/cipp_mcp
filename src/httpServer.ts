import http from "http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { CippClient } from "./cipp-client.js";
import { registerTenantTools } from "./tools/tenants.js";
import { registerUserTools } from "./tools/users.js";
import { registerSecurityTools } from "./tools/security.js";
import { registerStandardsTools } from "./tools/standards.js";

const PORT = parseInt(process.env.PORT ?? "8080", 10);

const CIPP_API_URL = process.env.CIPP_API_URL;
const CIPP_CLIENT_ID = process.env.CIPP_CLIENT_ID;
const CIPP_CLIENT_SECRET = process.env.CIPP_CLIENT_SECRET;
const CIPP_TENANT_ID = process.env.CIPP_TENANT_ID;
const CIPP_SCOPE = process.env.CIPP_SCOPE;

if (!CIPP_API_URL || !CIPP_CLIENT_ID || !CIPP_CLIENT_SECRET || !CIPP_TENANT_ID || !CIPP_SCOPE) {
  console.error(
    "ERROR: Missing required environment variables.\n" +
    "  CIPP_API_URL      — e.g. https://cipprvczu.azurewebsites.net\n" +
    "  CIPP_CLIENT_ID    — App registration client ID\n" +
    "  CIPP_CLIENT_SECRET — App registration client secret\n" +
    "  CIPP_TENANT_ID    — Your CIPP tenant ID\n" +
    "  CIPP_SCOPE        — e.g. api://20001ddd-xxxx/.default"
  );
  process.exit(1);
}

function buildServer(): McpServer {
  const client = new CippClient(
    CIPP_API_URL!,
    CIPP_CLIENT_ID!,
    CIPP_CLIENT_SECRET!,
    CIPP_TENANT_ID!,
    CIPP_SCOPE!
  );

  const server = new McpServer({
    name: "cipp-mcp",
    version: "1.0.0",
  });

  registerTenantTools(server, client);
  registerUserTools(server, client);
  registerSecurityTools(server, client);
  registerStandardsTools(server, client);

  return server;
}

const httpServer = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", transport: "streamable-http" }));
    return;
  }

  if (req.url === "/mcp") {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close().catch(() => {});
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.error(`CIPP MCP server listening on port ${PORT}`);
  console.error(`MCP endpoint:  http://0.0.0.0:${PORT}/mcp`);
  console.error(`Health check:  http://0.0.0.0:${PORT}/health`);
  console.error(`CIPP API:      ${CIPP_API_URL}`);
});

httpServer.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});
