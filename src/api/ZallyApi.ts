import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import {
  Rule,
  ViolationsByString,
  ViolationsByUrl,
  ViolationsResponse,
  ZallyApiType,
} from './types';

export const zallyApiRef = createApiRef<ZallyApiType>({
  id: 'plugin.api-linter',
});

interface Apis {
  discoveryApi: DiscoveryApi;
}

export class ZallyApi implements ZallyApiType {
  private readonly discoveryApi: DiscoveryApi;

  constructor(apis: Apis) {
    this.discoveryApi = apis.discoveryApi;
  }

  async getRules(): Promise<Rule[]> {
    const serviceUrl = await this.getServiceUrl('supported-rules');

    const response = await fetch(serviceUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data.rules;
  }

  async getApiViolations(
    request: ViolationsByUrl | ViolationsByString,
  ): Promise<ViolationsResponse> {
    const serviceUrl = await this.getServiceUrl('api-violations');

    const response = await fetch(serviceUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response.json();
  }

  async getSchemaAndViolations(id: string) {
    const serviceUrl = await this.getServiceUrl('api-violations');

    const response = await fetch(`${serviceUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response.json();
  }

  private async getServiceUrl(path: string) {
    const url = await this.discoveryApi.getBaseUrl('proxy');

    const serviceUrl = `${url}/api-linter/${path}`;
    return serviceUrl;
  }
}
