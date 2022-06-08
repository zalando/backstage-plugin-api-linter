import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'api-linter',
});

export const schemaIDRouteRef = createRouteRef({
  id: 'api-linter',
  params: ['*/:id'],
});
