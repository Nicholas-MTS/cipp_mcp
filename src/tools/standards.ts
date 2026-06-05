import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CippClient } from "../cipp-client.js";

export function registerStandardsTools(server: McpServer, client: CippClient) {

  server.registerTool("list_standards", {
    description: "List deployed CIPP standards for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListStandards", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_alerts_queue", {
    description: "List the CIPP alerts queue for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListAlertsQueue", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_audit_logs", {
    description: "List Microsoft 365 unified audit log entries for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListAuditLogs", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_mailboxes", {
    description: "List all mailboxes in a tenant including user, shared, and resource mailboxes",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListMailboxes", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_groups", {
    description: "List all groups in a tenant including security groups, distribution lists, and M365 groups",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListGroups", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_devices", {
    description: "List Intune-managed devices for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListDevices", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_cipp_alerts", {
    description: "Get current CIPP system alerts and notifications",
    inputSchema: {},
  }, async () => {
    const data = await client.get("GetCippAlerts");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_cipp_logs", {
    description: "List CIPP application logs",
    inputSchema: {},
  }, async () => {
    const data = await client.get("ListLogs");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_oauth_apps", {
    description: "List OAuth/enterprise applications registered in a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListOAuthApps", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });
}
