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

    const response = await fetch(serviceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
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

    const response = await fetch(`${serviceUrl}/${id}`, {
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

    const serviceUrl = `${url}/api-linter/${path}`;
    return { token, serviceUrl };
  }
}
