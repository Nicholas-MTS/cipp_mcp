import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CippClient } from "../cipp-client.js";

export function registerUserTools(server: McpServer, client: CippClient) {

  server.registerTool("list_users", {
    description: "List all users in a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListUsers", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_user", {
    description: "Get details for a specific user in a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
      user_id: z.string().describe("User ID or UPN (email address)"),
    },
  }, async ({ tenant_id, user_id }) => {
    const data = await client.get("ListUsers", { tenantFilter: tenant_id, userId: user_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_mfa_users", {
    description: "List all users and their MFA registration status for a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListMFAUsers", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_user_sign_in_logs", {
    description: "Get recent sign-in logs for a specific user",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
      user_id: z.string().describe("User ID or UPN"),
    },
  }, async ({ tenant_id, user_id }) => {
    const data = await client.get("ListUserSigninLogs", { tenantFilter: tenant_id, userId: user_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("list_inactive_accounts", {
    description: "List user accounts that have not signed in recently across a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
    },
  }, async ({ tenant_id }) => {
    const data = await client.get("ListInactiveAccounts", { tenantFilter: tenant_id });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("reset_user_password", {
    description: "Reset a user password in a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
      user_id: z.string().describe("User ID or UPN"),
      new_password: z.string().describe("New password for the user"),
      must_change: z.boolean().optional().describe("Force password change on next login (default: true)"),
    },
  }, async ({ tenant_id, user_id, new_password, must_change }) => {
    const data = await client.post("ExecResetPass", {
      tenantFilter: tenant_id,
      userId: user_id,
      newPassword: new_password,
      mustChange: must_change ?? true,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("revoke_user_sessions", {
    description: "Revoke all active sessions and refresh tokens for a user",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
      user_id: z.string().describe("User ID or UPN"),
    },
  }, async ({ tenant_id, user_id }) => {
    const data = await client.post("ExecRevokeSessions", {
      tenantFilter: tenant_id,
      userId: user_id,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("disable_user", {
    description: "Disable or enable a user account in a tenant",
    inputSchema: {
      tenant_id: z.string().describe("Tenant ID or default domain"),
      user_id: z.string().describe("User ID or UPN"),
      disable: z.boolean().describe("True to disable, false to enable"),
    },
  }, async ({ tenant_id, user_id, disable }) => {
    const data = await client.post("ExecDisableUser", {
      tenantFilter: tenant_id,
      userId: user_id,
      Enable: !disable,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });
}
