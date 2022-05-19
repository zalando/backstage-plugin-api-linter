import React from 'react';
import { APILinterPage } from '../APILinterPage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { zallyApiRef } from '../../../api';
import { mockZallyApi, mockZallyApiEmpty } from './mocks';
import schema from './schemaMock.json';

async function renderApp() {
  await renderInTestApp(
    <TestApiProvider apis={[[zallyApiRef, mockZallyApi]]}>
      <ThemeProvider theme={lightTheme}>
        <APILinterPage />
      </ThemeProvider>
    </TestApiProvider>,
  );
}

describe('APILinterPage', () => {
  afterAll(() => {
    // @ts-ignore
    global.Storage.prototype.setItem.mockReset();
    // @ts-ignore
    global.Storage.prototype.getItem.mockReset();
  });
  it('should render rules', async () => {
    renderApp();

    act(() => {
      userEvent.click(screen.getByText(/view the rules/i));
    });

    const ruleCards = await screen.findAllByTestId('rule');
    expect(ruleCards.length).toBeGreaterThan(0);
  });

  it('should render URL dialog and display violation', async () => {
    renderApp();

    userEvent.click(screen.getByText(/import url/i));

    const urlInput = screen.getByText(/Enter the url to import from/i);
    userEvent.type(urlInput, 'https://www.rawapi.com.br/api.json');

    userEvent.click(screen.getByTestId(/url-validate/i));

    const violations = await screen.findAllByTestId(/violation/i);
    expect(violations.length).toBe(1);
    expect(await screen.findByTestId('must')).toBeInTheDocument();
  });

  it('should render Schema and display violations', async () => {
    renderApp();

    const schemaInput = screen.getByText(/Paste a swagger schema here/i);
    expect(schemaInput).toBeInTheDocument();

    act(() => {
      userEvent.type(schemaInput, JSON.stringify(schema));
    });

    await userEvent.click(screen.getByTestId(/schema-validate/i));

    const violations = await screen.findAllByTestId(/violation/i);
    expect(violations.length).toBe(1);
  });
});

describe('APILinterPage - No violations / Error', () => {
  beforeEach(async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[zallyApiRef, mockZallyApiEmpty]]}>
        <ThemeProvider theme={lightTheme}>
          <APILinterPage />
        </ThemeProvider>
      </TestApiProvider>,
    );
  });

  it('should display perfect badge when no violations are found', async () => {
    act(() => {
      userEvent.click(screen.getByText(/import url/i));
    });

    const urlInput = screen.getByText(/Enter the url to import from/i);
    userEvent.type(urlInput, 'https://www.perfectapi.com.br/api.json');

    await userEvent.click(screen.getByTestId(/url-validate/i));

    expect(await screen.findByTestId(/perfect/i)).toBeInTheDocument();
  });

  it('should not submit when user types invalid url', async () => {
    userEvent.click(screen.getByText(/import url/i));

    const urlInput = screen.getByText(/Enter the url to import from/i);
    userEvent.type(urlInput, 'invalid-url');

    userEvent.click(screen.getByTestId(/url-validate/i));

    expect(
      await screen.getByText(/enter the URL to import from/i),
    ).toBeInTheDocument();
  });

  it('should render Schema and display correct badge when no violations are found', async () => {
    const schemaInput = screen.getByText(/Paste a swagger schema here/i);
    act(() => {
      userEvent.type(schemaInput, JSON.stringify(schema));
    });
    await userEvent.click(screen.getByText(/Validate/i));

    expect(await screen.findByTestId('perfect')).toBeInTheDocument();
  });
});
