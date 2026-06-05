import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CippClient } from "../cipp-client.js";

export function registerTenantTools(server: McpServer, client: CippClient) {

  server.registerTool("list_tenants", {
    description: "List all managed tenants in CIPP",
    inputSchema: {},
  }, async () => {
    const data = await client.get("ListTenants");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_tenant_details", {
    description: "Get detailed information about a specific tenant",
    inputSchema: {
      tenant_id: z.string().describe("The tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListTenantDetails", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_licenses", {
    description: "List licenses for a tenant including SKU name, total units, and consumed units",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListLicenses", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_service_health", {
    description: "Get Microsoft 365 service health status for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListServiceHealth", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_domains", {
    description: "List all domains registered for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListDomains", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });
}
