// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createDevApp } from '@backstage/dev-utils';
import { APILinterPlugin } from '../src/plugin';
import { APILinter } from '../src';

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
