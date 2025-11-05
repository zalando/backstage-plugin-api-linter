import { APILinter } from '.';
import { ThemeProvider } from '@material-ui/core';
import { themes } from '@backstage/theme';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { zallyApiRef } from '../../api';
import { mockZallyApi, mockZallyApiEmpty } from './__tests__/mocks';
import schema from './__tests__/schemaMock.json';
import '@testing-library/jest-dom';

const stringSchema = encodeURIComponent(JSON.stringify(schema));

function renderApp(withEmpty = false) {
  const mockApi = withEmpty ? mockZallyApiEmpty : mockZallyApi;
  return renderInTestApp(
    <TestApiProvider apis={[[zallyApiRef, mockApi]]}>
      <ThemeProvider theme={themes.light}>
        <APILinter />
      </ThemeProvider>
    </TestApiProvider>,
  );
}

describe('APILinter', () => {
  let originalSessionStorage: Storage;

  beforeAll(() => {
    originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      value: {
        getItem: jest.fn().mockName('getItem'),
        setItem: jest.fn().mockName('setItem'),
      },
    });
  });

  beforeEach(() => {
    (sessionStorage.getItem as jest.Mock).mockClear();
    (sessionStorage.setItem as jest.Mock).mockClear();
  });

  afterAll(() => {
    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      value: originalSessionStorage,
    });
  });

  it('should render rules', async () => {
    const { getByText, findAllByTestId } = await renderApp();
    fireEvent.click(getByText(/view the rules/i));
    const ruleCards = await findAllByTestId('rule');
    expect(ruleCards.length).toBeGreaterThan(0);
  });

  it('should render URL dialog and display violation', async () => {
    const { getByText, getByTestId, findByTestId, findAllByTestId } =
      await renderApp();

    fireEvent.click(getByText(/import url/i));
    const urlInput = getByText(/Enter the url to import from/i);
    await userEvent.type(urlInput, 'https://www.rawapi.com.br/api.json');
    fireEvent.click(getByTestId(/url-validate/i));
    const violations = await findAllByTestId(/violation/i);
    expect(violations.length).toBe(1);
    expect(await findByTestId('must')).toBeInTheDocument();
  });

  it('should render Schema and display violations', async () => {
    const { getByText, getByTestId, findAllByTestId } = await renderApp();
    const schemaInput = getByText(/Paste a swagger schema here/i);
    expect(schemaInput).toBeInTheDocument();
    await userEvent.type(schemaInput, stringSchema);
    fireEvent.click(getByTestId(/schema-validate/i));
    const violations = await findAllByTestId(/violation/i);
    expect(violations.length).toBe(1);
  });
});

describe('APILinter - No violations / Error', () => {
  it('should display perfect badge when no violations are found', async () => {
    const { getByTestId, getByText, findByTestId } = await renderApp(true);
    fireEvent.click(getByText(/import url/i));
    const urlInput = getByText(/Enter the url to import from/i);
    await userEvent.type(urlInput, 'https://www.perfectapi.com.br/api.json');
    fireEvent.click(getByTestId(/url-validate/i));
    expect(await findByTestId(/perfect/i)).toBeInTheDocument();
  });

  it('should not submit when user types invalid url', async () => {
    const { getByText, getByTestId } = await renderApp(true);
    fireEvent.click(getByText(/import url/i));
    const urlInput = getByText(/Enter the url to import from/i);
    await userEvent.type(urlInput, 'invalid-url');
    fireEvent.click(getByTestId(/url-validate/i));
    expect(getByText(/enter the URL to import from/i)).toBeInTheDocument();
  });

  it('should render Schema and display correct badge when no violations are found', async () => {
    const { getByText, findByTestId } = await renderApp(true);
    const schemaInput = getByText(/Paste a swagger schema here/i);
    await userEvent.type(schemaInput, stringSchema);
    fireEvent.click(getByText(/Validate/i));
    expect(await findByTestId('perfect')).toBeInTheDocument();
  });
});
