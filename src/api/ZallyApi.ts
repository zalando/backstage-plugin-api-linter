import {
  ConfigApi,
  createApiRef,
  DiscoveryApi,
  IdentityApi,
  OAuthApi,
} from "@backstage/core-plugin-api";
import {
  Rule,
  ViolationsByString,
  ViolationsByUrl,
  ViolationsResponse,
  ZallyApiType,
} from "./types";

export const zallyApiRef = createApiRef<ZallyApiType>({
  id: "plugin.api-linter",
});

interface Apis {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
  configApi: ConfigApi;
}

export class ZallyApi implements ZallyApiType {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly configApi: ConfigApi;

  constructor(apis: Apis) {
    this.discoveryApi = apis.discoveryApi;
    this.identityApi = apis.identityApi;
    this.configApi = apis.configApi;
  }

  async getRules(): Promise<Rule[]> {
    const { token, serviceUrl } = await this.getUrlAndToken("supported-rules");

    const response = await fetch(`https://infrastructure-api-linter.zalandoapis.com`, {
      headers: {
        Authorization: `Bearer eyJraWQiOiJwbGF0Zm9ybS1pYW0tdmNlaHloajYiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiI2MDljMTVkYS0xOTM1LTQxMDktYTdhMi1hODQ1ZmEwMzZkMTciLCJodHRwczovL2lkZW50aXR5LnphbGFuZG8uY29tL3JlYWxtIjoidXNlcnMiLCJodHRwczovL2lkZW50aXR5LnphbGFuZG8uY29tL3Rva2VuIjoiQmVhcmVyIiwiaHR0cHM6Ly9pZGVudGl0eS56YWxhbmRvLmNvbS9tYW5hZ2VkLWlkIjoibnBlaXhvdG8iLCJhenAiOiJ6dG9rZW4iLCJodHRwczovL2lkZW50aXR5LnphbGFuZG8uY29tL2JwIjoiODEwZDFkMDAtNDMxMi00M2U1LWJkMzEtZDgzNzNmZGQyNGM3IiwiYXV0aF90aW1lIjoxNjUyMjgwNTM4LCJpc3MiOiJodHRwczovL2lkZW50aXR5LnphbGFuZG8uY29tIiwiZXhwIjoxNjU0NjIyMjc3LCJpYXQiOjE2NTQ2MDc4Njd9.aa4zXobmEtuXtLdLusyD5ZQg77A5dqTvdfCP1sE1mbtACTpUz5Fos_LC7NmZiEPJBA8LITFwy4GlY4FOfof__A`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    return data.rules;
  }

  async getApiViolations(
    request: ViolationsByUrl | ViolationsByString
  ): Promise<ViolationsResponse> {
    const { token, serviceUrl } = await this.getUrlAndToken("api-violations");

    const response = await fetch(serviceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response.json();
  }

  async getSchemaAndViolations(id: string) {
    const { token, serviceUrl } = await this.getUrlAndToken("api-violations");

    const response = await fetch(`https://infrastructure-api-linter.zalandoapis.com/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return response.json();
  }

  private async getUrlAndToken(path: string) {
    const { token } = await this.identityApi.getCredentials();
    const url = await this.discoveryApi.getBaseUrl("proxy");

    console.log({ url });

    const serviceUrl = `${url}/api-linter/${path}`;
    return { token, serviceUrl };
  }
}
