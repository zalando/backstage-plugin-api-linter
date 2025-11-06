import { createDevApp } from '@backstage/dev-utils';
import Box from '@mui/material/Box';
import { APILinter, APILinterPlugin } from '../src';

createDevApp()
  .registerPlugin(APILinterPlugin)
  .addPage({
    element: (
      <Box padding="1rem">
        <APILinter />
      </Box>
    ),
    title: 'Root Page',
    path: '/api-linter',
  })
  .render();
