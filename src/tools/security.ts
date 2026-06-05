import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CippClient } from "../cipp-client.js";

export function registerSecurityTools(server: McpServer, client: CippClient) {

  server.registerTool("list_conditional_access_policies", {
    description: "List all Conditional Access policies for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListConditionalAccessPolicies", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_security_alerts", {
    description: "List Microsoft 365 security alerts for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ExecAlertsList", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_secure_score", {
    description: "Get the Microsoft Secure Score and improvement actions for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListBPA", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_sign_ins", {
    description: "List Azure AD sign-in logs for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListSignIns", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_named_locations", {
    description: "List Conditional Access named locations (IP ranges and countries) for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListNamedLocations", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_gdap_roles", {
    description: "List GDAP roles and access assignments for your partner tenant",
    inputSchema: {},
  }, async () => {
    const data = await client.get("ListGDAPRoles");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_gdap_access_assignments", {
    description: "List all GDAP access assignments across managed tenants",
    inputSchema: {},
  }, async () => {
    const data = await client.get("ListGDAPAccessAssignments");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });
}
