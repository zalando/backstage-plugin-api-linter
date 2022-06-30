import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
} from "@backstage/core-plugin-api";

import { ZallyApi, zallyApiRef } from "./api";

import { rootRouteRef } from "./routes";

export const APILinterPlugin = createPlugin({
  id: "api-linter",
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: zallyApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new ZallyApi({ discoveryApi }),
    }),
  ],
});
