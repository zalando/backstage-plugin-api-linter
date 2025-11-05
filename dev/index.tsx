import { createDevApp } from '@backstage/dev-utils';
import { APILinter, APILinterPlugin } from '../src';

createDevApp()
  .registerPlugin(APILinterPlugin)
  .addPage({
    element: (
      <div style={{ padding: '1rem' }}>
        <APILinter />
      </div>
    ),
    title: 'Root Page',
    path: '/api-linter',
  })
  .render();
