import { APILinter } from "../APILinter";
import { ThemeProvider } from "@material-ui/core";
import { themes } from "@backstage/theme";
import { renderInTestApp, TestApiProvider } from "@backstage/test-utils";
import userEvent from "@testing-library/user-event";
import { RenderResult } from "@testing-library/react";
import { zallyApiRef } from "../../../api";
import { mockZallyApi, mockZallyApiEmpty } from "./mocks";
import schema from "./schemaMock.json";

function renderApp() {
  return renderInTestApp(
    <TestApiProvider apis={[[zallyApiRef, mockZallyApi]]}>
      <ThemeProvider theme={themes.light}>
        <APILinter />
      </ThemeProvider>
    </TestApiProvider>,
  );
}

describe("APILinter", () => {
  let originalSessionStorage: Storage;

  beforeAll(() => {
    originalSessionStorage = window.sessionStorage;
    // @ts-ignore
    delete window.sessionStorage;
    Object.defineProperty(window, "sessionStorage", {
      writable: true,
      value: {
        getItem: jest.fn().mockName("getItem"),
        setItem: jest.fn().mockName("setItem"),
      },
    });
  });

  beforeEach(() => {
    (sessionStorage.getItem as jest.Mock).mockClear();
    (sessionStorage.setItem as jest.Mock).mockClear();
  });

  afterAll(() => {
    Object.defineProperty(window, "sessionStorage", {
      writable: true,
      value: originalSessionStorage,
    });
  });
  it("should render rules", async () => {
    const { getByText, findAllByTestId } = await renderApp();

    await userEvent.click(getByText(/view the rules/i));

    const ruleCards = await findAllByTestId("rule");
    expect(ruleCards.length).toBeGreaterThan(0);
  });

  it("should render URL dialog and display violation", async () => {
    const { getByText, getByTestId, findAllByTestId, findByTestId } =
      await renderApp();

    await userEvent.click(getByText(/import url/i));
    const urlInput = getByText(/Enter the url to import from/i);
    await userEvent.type(urlInput, "https://www.rawapi.com.br/api.json");
    await userEvent.click(getByTestId(/url-validate/i));

    const violations = await findAllByTestId(/violation/i);
    expect(violations.length).toBe(1);
    expect(await findByTestId("must")).toBeInTheDocument();
  });

  it("should render Schema and display violations", async () => {
    const { getByText, getByTestId, findAllByTestId } = await renderApp();

    const schemaInput = getByText(/Paste a swagger schema here/i);
    expect(schemaInput).toBeInTheDocument();

    const stringSchema = encodeURIComponent(JSON.stringify(schema));
    await userEvent.type(schemaInput, stringSchema);
    await userEvent.click(getByTestId(/schema-validate/i));

    const violations = await findAllByTestId(/violation/i);
    expect(violations.length).toBe(1);
  });
});

describe("APILinter - No violations / Error", () => {
  let renderResult: RenderResult = {} as any;

  beforeEach(async () => {
    renderResult = await renderInTestApp(
      <TestApiProvider apis={[[zallyApiRef, mockZallyApiEmpty]]}>
        <ThemeProvider theme={themes.light}>
          <APILinter />
        </ThemeProvider>
      </TestApiProvider>,
    );
  });

  it("should display perfect badge when no violations are found", async () => {
    const { getByText, getByTestId, findByTestId } = renderResult;
    await userEvent.click(getByText(/import url/i));
    const urlInput = getByText(/Enter the url to import from/i);
    await userEvent.type(urlInput, "https://www.perfectapi.com.br/api.json");
    await userEvent.click(getByTestId(/url-validate/i));

    expect(await findByTestId(/perfect/i)).toBeInTheDocument();
  });

  it("should not submit when user types invalid url", async () => {
    const { getByText, getByTestId } = renderResult;
    await userEvent.click(getByText(/import url/i));
    const urlInput = getByText(/Enter the url to import from/i);
    await userEvent.type(urlInput, "invalid-url");
    await userEvent.click(getByTestId(/url-validate/i));

    expect(getByText(/enter the URL to import from/i)).toBeInTheDocument();
  });

  it("should render Schema and display correct badge when no violations are found", async () => {
    const { getByText, findByTestId } = renderResult;
    const schemaInput = getByText(/Paste a swagger schema here/i);
    const stringSchema = encodeURIComponent(JSON.stringify(schema));
    await userEvent.type(schemaInput, stringSchema);
    await userEvent.click(getByText(/Validate/i));

    expect(await findByTestId("perfect")).toBeInTheDocument();
  });
});
