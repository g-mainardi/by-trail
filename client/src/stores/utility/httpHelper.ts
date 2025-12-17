interface Body {
  [key: string]: any;
}

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];

type URL = string;

export class HttpHelper {

  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = undefined;
  }

  private async request(url: URL, method: HttpMethod, body?: Body): Promise<Response> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async get(url: URL): Promise<Response> {
    return this.request(url, HttpMethod.GET);
  }

  async post(url: URL, body?: Body): Promise<Response> {
    return this.request(url, HttpMethod.POST, body);
  }

  async put(url: URL, body?: Body): Promise<Response> {
    return this.request(url, HttpMethod.PUT, body);
  }

  async delete(url: URL): Promise<Response> {
    return this.request(url, HttpMethod.DELETE);
  }

}

