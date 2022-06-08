import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  oauth2ApiRef,
  identityApiRef, configApiRef
} from '@backstage/core-plugin-api';

import { ZallyApi, zallyApiRef } from './api';

import { rootRouteRef } from './routes';

export const APILinterPlugin = createPlugin({
  id: 'api-linter',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: zallyApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef, configApi: configApiRef },
      factory: ({ discoveryApi, identityApi, configApi }) =>
        new ZallyApi({ discoveryApi, identityApi, configApi }),
    }),
  ],
});
