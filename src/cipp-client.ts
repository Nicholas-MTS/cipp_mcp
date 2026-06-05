import axios, { AxiosInstance } from "axios";

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

export class CippClient {
  private apiUrl: string;
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;
  private scope: string;
  private tokenCache: TokenCache | null = null;
  private http: AxiosInstance;

  constructor(
    apiUrl: string,
    clientId: string,
    clientSecret: string,
    tenantId: string,
    scope: string
  ) {
    this.apiUrl = apiUrl.replace(/\/$/, ""); // strip trailing slash
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tenantId = tenantId;
    this.scope = scope;

    this.http = axios.create({ timeout: 30000 });
  }

  // Get a valid Bearer token, refreshing if expired
  private async getToken(): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && this.tokenCache.expiresAt > now + 60_000) {
      return this.tokenCache.accessToken;
    }

    const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: this.scope,
      grant_type: "client_credentials",
    });

    const res = await this.http.post(tokenUrl, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    this.tokenCache = {
      accessToken: res.data.access_token,
      expiresAt: now + res.data.expires_in * 1000,
    };

    return this.tokenCache.accessToken;
  }

  async get(endpoint: string, params: Record<string, string> = {}) {
    const token = await this.getToken();
    const res = await this.http.get(`${this.apiUrl}/api/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  }

  async post(endpoint: string, body: object = {}, params: Record<string, string> = {}) {
    const token = await this.getToken();
    const res = await this.http.post(
      `${this.apiUrl}/api/${endpoint}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params,
      }
    );
    return res.data;
  }
}
