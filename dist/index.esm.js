import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, oauth2ApiRef, useApi } from '@backstage/core-plugin-api';
import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'brace';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/theme/chrome';
import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/snippets/yaml';
import 'brace/snippets/json';
import 'swagger-ui-react/swagger-ui.css';
import { Box, CircularProgress, styled, Button as Button$1, Card as Card$2, Typography, Collapse, Chip as Chip$1, CardContent, Link as Link$2, Paper, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Drawer as Drawer$1 } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { Link as Link$1 } from '@backstage/core-components';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import SwaggerUI from 'swagger-ui-react';
import { styled as styled$1 } from '@material-ui/core/styles';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { useLocalStorage } from 'react-use';

const zallyApiRef = createApiRef({
  id: "plugin.api-linter"
});
class ZallyApi {
  constructor(apis) {
    this.discoveryApi = apis.discoveryApi;
    this.oauth2Api = apis.oauth2Api;
  }
  async getRules() {
    const { token, serviceUrl } = await this.urlToken("supported-rules");
    const response = await fetch(serviceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    const data = await response.json();
    return data.rules;
  }
  async getApiViolations(request) {
    const { token, serviceUrl } = await this.urlToken("api-violations");
    const response = await fetch(serviceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }
  async getSchemaAndViolations(id) {
    const { token, serviceUrl } = await this.urlToken("api-violations");
    const response = await fetch(`${serviceUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    return response.json();
  }
  async urlToken(path) {
    const token = await this.oauth2Api.getAccessToken();
    const proxyUrl = await this.discoveryApi.getBaseUrl("proxy");
    const serviceUrl = `${proxyUrl}/api-linter/${path}`;
    return { token, serviceUrl };
  }
}

const rootRouteRef = createRouteRef({
  id: "api-linter"
});
createRouteRef({
  id: "api-linter",
  params: ["*/:id"]
});

const APILinterPlugin = createPlugin({
  id: "api-linter",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: zallyApiRef,
      deps: { discoveryApi: discoveryApiRef, oauth2Api: oauth2ApiRef },
      factory: ({ discoveryApi, oauth2Api }) => new ZallyApi({ discoveryApi, oauth2Api })
    })
  ]
});

const Loading = () => /* @__PURE__ */ React.createElement(Box, {
  sx: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50vh"
  }
}, /* @__PURE__ */ React.createElement(CircularProgress, {
  size: "1.5em"
}));

const Button = styled(Button$1)(({ theme }) => ({
  color: theme.palette.warning.dark,
  fontSize: 16,
  textTransform: "inherit",
  fontWeight: 400,
  margin: "12px 0",
  paddingRight: 0
}));
const Card$1 = styled(Card$2)({
  display: "flex",
  flexDirection: "column",
  marginTop: 16,
  backgroundColor: "rgb(242, 242, 242)"
});
const CardText$1 = styled(Typography)({
  color: "#101419",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  hyphens: "auto"
});
const ContentWrapper = styled("div")({
  marginTop: 8,
  borderBottom: "1px solid #10141950",
  padding: 8,
  "&:last-child": {
    borderBottom: "none"
  }
});
const Link = styled(Link$1)({
  wordBreak: "break-word",
  overflowWrap: "break-word",
  hyphens: "auto"
});
const DetailsTitle = styled(Typography)({
  color: "#101419",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  hyphens: "auto",
  marginTop: 20
});

function addIdForPermalink(id) {
  const tokenPattern = /[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}/g;
  const paths = location.pathname.split("/");
  const hasId = paths.filter((path) => tokenPattern.test(path))[0];
  const hasExactId = location.href.includes(id);
  if (hasId && hasExactId) {
    navigator.clipboard.writeText(location.href);
    return;
  }
  if (hasId) {
    const newHref = location.href.replace(tokenPattern, "");
    navigator.clipboard.writeText(`${newHref}${id}`);
    history.pushState("", "", `${newHref}${id}`);
    return;
  }
  navigator.clipboard.writeText(`${location.href}/${id}`);
  history.pushState("", "", `${location.href}/${id}`);
}

const perfectApi = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("strong", null, "Perfect"), "! Your API is compliant with Zalando's Rest API guidelines.");
const mayViolations = /* @__PURE__ */ React.createElement(React.Fragment, null, "Lookin' GOOD! You ", /* @__PURE__ */ React.createElement("strong", null, "MAY"), " resolve any remaining", /* @__PURE__ */ React.createElement("strong", null, " MAY"), " violations, but from our side it's ok if you have other priorities.");
const shouldViolations = /* @__PURE__ */ React.createElement(React.Fragment, null, "Your API violates the ", /* @__PURE__ */ React.createElement("strong", null, "SHOULD"), " rules, so you", /* @__PURE__ */ React.createElement("strong", null, " SHOULD"), " resolve them unless you have a solid reason not to, which you've documented.");
const mustViolations = /* @__PURE__ */ React.createElement(React.Fragment, null, "Your API is ", /* @__PURE__ */ React.createElement("strong", null, "NOT"), " compliant with Zalando's Rest API guidelines. APIs that violate ", /* @__PURE__ */ React.createElement("strong", null, "MUST"), " requirements lose their trustworthiness.");

const Badge = styled(ErrorIcon)(({ theme, paint }) => {
  const colorForViolation = {
    must: theme.palette.error.main,
    should: theme.palette.warning.dark,
    may: theme.palette.success.main
  };
  return {
    color: colorForViolation[paint],
    fontSize: 60,
    marginRight: 10
  };
});
const PerfectApiBadge = styled(CheckCircleRoundedIcon)(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: 60,
  marginRight: 10
}));
const BadgeWrapper = styled("div")({
  paddingBottom: 12,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  color: "#101419"
});

const APIBadge = ({
  violations,
  sendEvent,
  event
}) => {
  const handleEventEmitter = (context, value) => {
    sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: `hover on ${context}`,
      eventAction: `hovers on ${context}: ${value}`
    });
  };
  const getBadgeIcon = () => {
    switch (true) {
      case violations.must > 0:
        return {
          icon: /* @__PURE__ */ React.createElement(Badge, {
            paint: "must",
            "data-testid": "must",
            onMouseEnter: () => handleEventEmitter("api badge", "must")
          }),
          text: mustViolations
        };
      case violations.should > 0:
        return {
          icon: /* @__PURE__ */ React.createElement(Badge, {
            paint: "should",
            "data-testid": "should",
            onMouseEnter: () => handleEventEmitter("api badge", "should")
          }),
          text: shouldViolations
        };
      case violations.may > 0:
        return {
          icon: /* @__PURE__ */ React.createElement(Badge, {
            paint: "may",
            "data-testid": "may",
            onMouseEnter: () => handleEventEmitter("api badge", "may")
          }),
          text: mayViolations
        };
      default:
        return {
          icon: /* @__PURE__ */ React.createElement(PerfectApiBadge, {
            "data-testid": "perfect",
            onMouseEnter: () => handleEventEmitter("api badge", "perfect")
          }),
          text: perfectApi
        };
    }
  };
  const { icon, text } = getBadgeIcon();
  return /* @__PURE__ */ React.createElement(BadgeWrapper, null, icon, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    onMouseEnter: () => handleEventEmitter("api badge text")
  }, text));
};

const getIDFromURL = (baseUrl) => {
  const tokenPattern = /[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}/g;
  const urlToken = baseUrl.split("/").pop();
  if (tokenPattern.test(urlToken))
    return urlToken;
  return "";
};
const isValidHttpUrl = (input) => {
  let url;
  try {
    url = new URL(input);
  } catch (_) {
    return false;
  }
  return url;
};
const aggregateByViolation = (list) => {
  const isRepeated = (item, array) => array.includes(item);
  const generateDescription = (previous, current) => Array.isArray(previous) ? [...previous, current] : [previous, current];
  const aggregated = [];
  list.forEach((item) => {
    const alreadySeen = aggregated.find((i) => i.title === item.title);
    if (!alreadySeen) {
      aggregated.push(item);
    } else {
      if (!isRepeated(item.description, alreadySeen.description)) {
        alreadySeen.description = generateDescription(alreadySeen.description, item.description);
      }
      if (!isRepeated(item.pointer, alreadySeen.paths)) {
        alreadySeen.paths.push(item.pointer);
      }
    }
  });
  return aggregated;
};

const ViolationsDetails = ({
  paths,
  pointer,
  description
}) => {
  const hasMoreThanOnePath = (violat) => violat.length > 1;
  const [collapse, setCollapse] = useState(false);
  const shouldDisplayDescription = Array.isArray(description) && description.length > 0;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, hasMoreThanOnePath(paths) ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button$1, {
    onClick: () => setCollapse((prev) => !prev),
    color: "primary",
    style: { padding: "6px 0px" }
  }, collapse ? "hide" : "show", " ", paths.length, " violation's details", " ", collapse ? /* @__PURE__ */ React.createElement(ArrowDropUp, null) : /* @__PURE__ */ React.createElement(ArrowDropDownIcon, null)), /* @__PURE__ */ React.createElement(Collapse, {
    in: collapse
  }, shouldDisplayDescription && /* @__PURE__ */ React.createElement(DetailsTitle, null, /* @__PURE__ */ React.createElement("strong", null, "Descriptions:")), shouldDisplayDescription && description.map((item, i) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CardText$1, {
    variant: "subtitle1"
  }, /* @__PURE__ */ React.createElement("strong", null, i + 1, " - "), " ", item))), /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DetailsTitle, null, /* @__PURE__ */ React.createElement("strong", null, "Locations:")), paths.map((path) => /* @__PURE__ */ React.createElement(ContentWrapper, null, /* @__PURE__ */ React.createElement(CardText$1, {
    variant: "subtitle1"
  }, path)))))) : /* @__PURE__ */ React.createElement(React.Fragment, null, pointer && /* @__PURE__ */ React.createElement(CardText$1, {
    variant: "subtitle1"
  }, /* @__PURE__ */ React.createElement("strong", null, "Location:"), " ", pointer)));
};

const Card = styled(Card$2)({
  display: "flex",
  flexDirection: "column",
  marginTop: 16,
  backgroundColor: "rgb(242, 242, 242)"
});
const CardText = styled(Typography)({
  color: "#101419"
});
const Chip = styled(Chip$1)(({ theme, label }) => {
  const type = label.split(":")[0];
  const colorForViolation = {
    must: theme.palette.error.main,
    should: theme.palette.warning.dark,
    may: theme.palette.success.main
  };
  return {
    border: `1px solid ${colorForViolation[type]}`,
    color: "#212121",
    backgroundColor: "#fff",
    textTransform: "capitalize",
    fontSize: "12px"
  };
});

const ViolationsCard = ({
  external_id,
  violations,
  violations_count,
  onExternalIdChange,
  sendEvent,
  event
}) => {
  const handleClick = () => {
    onExternalIdChange(external_id);
    addIdForPermalink(external_id);
  };
  const hasViolationType = (count) => count > 0;
  const aggregatedViolations = aggregateByViolation(violations);
  const getRuleNumberFromLink = (link) => link.split("/")[link.split("/").length - 1];
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(Button, {
    onClick: handleClick,
    variant: "text"
  }, "Create permanent URL ", /* @__PURE__ */ React.createElement(LinkIcon, {
    style: { marginLeft: 6 }
  }))), /* @__PURE__ */ React.createElement(APIBadge, {
    violations: violations_count,
    sendEvent,
    event
  }), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center"
  }, hasViolationType(violations_count.must) && /* @__PURE__ */ React.createElement(Chip, {
    label: `must: ${violations_count.must}`
  }), hasViolationType(violations_count.should) && /* @__PURE__ */ React.createElement(Chip, {
    label: `should: ${violations_count.should}`
  }), hasViolationType(violations_count.may) && /* @__PURE__ */ React.createElement(Chip, {
    label: `may: ${violations_count.may}`
  })), aggregatedViolations.map(({ violation_type, title, rule_link, paths, description, pointer }) => {
    return /* @__PURE__ */ React.createElement(Card$1, {
      key: title,
      onClick: () => sendEvent == null ? void 0 : sendEvent({
        ...event,
        eventLabel: `on click violation card`,
        eventAction: `clicks on violation card`
      })
    }, /* @__PURE__ */ React.createElement(CardContent, {
      key: title,
      "data-testid": "violation"
    }, /* @__PURE__ */ React.createElement(Chip, {
      label: violation_type.toLocaleLowerCase(),
      onClick: () => sendEvent == null ? void 0 : sendEvent({
        ...event,
        eventLabel: `on click violation card tag: ${"must".toLocaleLowerCase()}`,
        eventAction: `clicks on violation card tag`
      })
    }), /* @__PURE__ */ React.createElement(CardText$1, {
      variant: "h6"
    }, title), /* @__PURE__ */ React.createElement(Typography, {
      variant: "subtitle1",
      component: "div",
      onClick: () => sendEvent == null ? void 0 : sendEvent({
        ...event,
        eventLabel: `on click violation card link`,
        eventAction: `clicks on violation card ${rule_link}`
      })
    }, /* @__PURE__ */ React.createElement(Link, {
      to: rule_link
    }, "Rule: ", getRuleNumberFromLink(rule_link))), /* @__PURE__ */ React.createElement(CardText$1, {
      variant: "subtitle1",
      key: pointer
    }, !Array.isArray(description) && /* @__PURE__ */ React.createElement(CardText$1, {
      variant: "subtitle1",
      key: pointer
    }, description)), /* @__PURE__ */ React.createElement(ViolationsDetails, {
      paths,
      pointer,
      description
    })));
  }));
};

const ViolationsEmpty = styled(Typography)({
  display: "flex",
  alignItems: "center",
  fontWeight: 400,
  wordBreak: "break-word",
  padding: "0 24px",
  textAlign: "center"
});
const ViolationsWrapper$1 = styled("div")({
  marginLeft: 12,
  marginRight: 12,
  paddingBottom: 32
});
const ViolationsPlaceholder = styled(Typography)({
  marginTop: 52
});

const Violations = ({
  response,
  loading,
  error,
  onExternalIdChange,
  sendEvent,
  event
}) => {
  const hasResponse = !loading && response && response.violations_count && !error;
  const hasError = !loading && !response && !!error;
  const shouldDisplayPlaceholder = !hasResponse && !hasError && !loading;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, hasResponse && /* @__PURE__ */ React.createElement(ViolationsWrapper$1, null, /* @__PURE__ */ React.createElement(ViolationsCard, {
    ...response,
    onExternalIdChange,
    sendEvent,
    event
  })), loading && /* @__PURE__ */ React.createElement(Loading, null), hasError && /* @__PURE__ */ React.createElement(ViolationsEmpty, null, "Error: ", error), shouldDisplayPlaceholder && /* @__PURE__ */ React.createElement(ViolationsPlaceholder, null, "Validation result will", /* @__PURE__ */ React.createElement("br", null), " be presented here"));
};

const Label = styled$1(Typography)({
  display: "flex",
  alignItems: "center",
  fontWeight: 400
});
const UrlLink = styled$1(Link$2)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  cursor: "pointer",
  marginLeft: 8,
  width: 120,
  letterSpacing: 0,
  fontWeight: 500
});
const FlexBox = styled$1(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr .5fr",
  gridTemplateRows: "auto",
  columnGap: "8px",
  gridTemplateAreas: `
    'editor swagger violations'
  `,
  height: "58vh",
  [theme.breakpoints.down("md")]: {
    height: "100vh",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr  1fr",
    rowGap: "8px",
    gridTemplateAreas: `
    'editor'
    'swagger'
    'violations'
  `
  }
}));
const EditorWrapper = styled$1(Paper)(({ theme }) => ({
  display: "grid",
  flexDirection: "column",
  marginTop: 12,
  borderRadius: 2,
  gridArea: "editor",
  overflowY: "scroll",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    height: "60vh"
  }
}));
const SwaggerUIWrapper = styled$1(Paper)(({ theme }) => ({
  display: "grid",
  backgroundColor: "#fff",
  color: "rgb(87, 90, 94)",
  gridArea: "swagger",
  marginTop: 12,
  height: "100%",
  overflowY: "scroll",
  [theme.breakpoints.down("md")]: {
    height: "60vh"
  }
}));
const ViolationsWrapper = styled$1(Paper)(({ theme }) => ({
  display: "grid",
  backgroundColor: "#fff",
  justifyContent: "center",
  marginTop: 12,
  color: "rgb(87, 90, 94)",
  gridArea: "violations",
  height: "100%",
  overflowY: "scroll",
  [theme.breakpoints.down("md")]: {
    height: "60vh"
  }
}));

const Schemas = ({
  onInputChange,
  onSubmit,
  schemaValue,
  response,
  loading,
  error,
  openUrlDialog,
  onExternalIdChange,
  sendEvent,
  event,
  handleSchemaStorage,
  handleClearAll
}) => {
  const handleOnClick = () => {
    openUrlDialog();
    sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: "onClick to import URL link",
      eventAction: "Clicks on import URL link"
    });
  };
  let mode;
  try {
    JSON.parse(schemaValue);
    mode = "json";
  } catch (e) {
    mode = "yaml";
  }
  useEffect(() => {
    handleSchemaStorage(schemaValue);
  }, [schemaValue, handleSchemaStorage]);
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4",
    component: "h2",
    style: { fontSize: 18 }
  }, "Schemas"), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%"
  }, /* @__PURE__ */ React.createElement(Label, {
    variant: "body1"
  }, "Paste a swagger schema here. Or", /* @__PURE__ */ React.createElement(UrlLink, {
    onClick: handleOnClick
  }, /* @__PURE__ */ React.createElement(LinkIcon, null), /* @__PURE__ */ React.createElement("span", null, "IMPORT URL"))), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Button$1, {
    variant: "text",
    onClick: handleClearAll,
    style: { marginBottom: 4, marginRight: 4 },
    color: "primary",
    "data-testid": "schema-validate"
  }, "clear"), /* @__PURE__ */ React.createElement(Button$1, {
    variant: "outlined",
    onClick: onSubmit,
    style: { marginBottom: 4 },
    color: "primary",
    "data-testid": "schema-validate",
    disabled: !schemaValue
  }, "Validate"))), /* @__PURE__ */ React.createElement(FlexBox, null, /* @__PURE__ */ React.createElement(EditorWrapper, null, /* @__PURE__ */ React.createElement(AceEditor, {
    wrapEnabled: true,
    onFocus: () => sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: "onFocus on Schema Editor input",
      eventAction: "focus on Schema Editor input"
    }),
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    mode,
    width: "100%",
    height: "100%",
    theme: "chrome",
    showPrintMargin: false,
    onChange: onInputChange,
    name: "editor",
    value: schemaValue,
    editorProps: { $blockScrolling: true, enableSnippets: true }
  })), /* @__PURE__ */ React.createElement(SwaggerUIWrapper, null, /* @__PURE__ */ React.createElement(SwaggerUI, {
    spec: schemaValue
  })), /* @__PURE__ */ React.createElement(ViolationsWrapper, null, /* @__PURE__ */ React.createElement(Violations, {
    response,
    loading,
    error,
    onExternalIdChange,
    sendEvent,
    event
  }))));
};

const SubtitleLink = styled(Link$1)({
  display: "inline",
  opacity: 0.9,
  marginTop: 8,
  marginLeft: 4,
  textDecoration: "underline"
});
const Title = styled(Typography)({
  marginBottom: 22,
  fontWeight: 500
});
const RulesLink = styled("div")({
  marginTop: 5,
  marginLeft: 5
});
const RulesLinkWrapper = styled("div")({
  color: "#DE7C02",
  display: "flex",
  alignContent: "center",
  cursor: "pointer",
  fontWeight: 500
});
const BookIcon = styled(MenuBookIcon)({
  width: 18,
  marginTop: 2
});

const URLValidator = ({
  onSubmit,
  onInputChange,
  inputValue,
  error,
  open,
  sendEvent,
  event,
  handleClose
}) => /* @__PURE__ */ React.createElement(Dialog, {
  maxWidth: "xl",
  open,
  onClose: handleClose,
  "aria-labelledby": "alert-dialog-title",
  "aria-describedby": "alert-dialog-description"
}, /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(DialogContentText, {
  id: "alert-dialog-description"
}, /* @__PURE__ */ React.createElement(TextField, {
  onFocus: () => sendEvent == null ? void 0 : sendEvent({
    ...event,
    eventLabel: "onFocus import URL input",
    eventAction: "focus on import URL input"
  }),
  error: !!error,
  id: "outlined-error-helper-text",
  label: "Enter the URL to import from",
  placeholder: "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/petstore.json",
  helperText: error,
  fullWidth: true,
  onChange: onInputChange,
  value: inputValue,
  style: {
    width: 650,
    height: 50
  }
}))), /* @__PURE__ */ React.createElement(DialogActions, {
  style: { padding: "0 24px 50px 24px" }
}, /* @__PURE__ */ React.createElement(Button$1, {
  variant: "outlined",
  onClick: handleClose
}, "Cancel"), /* @__PURE__ */ React.createElement(Button$1, {
  variant: "outlined",
  onClick: onSubmit,
  color: "primary",
  "data-testid": "url-validate",
  disabled: !inputValue
}, "Validate")));

const URLComponent = ({
  open,
  onOpen,
  fetchData,
  onResponse,
  onError,
  sendEvent,
  event,
  handleUrlStorage,
  urlStorage
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    setError("");
    setInput(e.target.value);
    handleUrlStorage(e.target.value);
  };
  const handleSubmit = () => {
    setError("");
    onError("");
    onResponse(void 0);
    sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: "onSubmit import URL",
      eventAction: `validates API by URL: ${input}`
    });
    if (!isValidHttpUrl(input)) {
      setError("Please enter a valid url");
      return;
    }
    onOpen(false);
    fetchData({ api_definition_url: input });
  };
  const handleClose = () => {
    onOpen(false);
    sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: "on Close import URL input dialog",
      eventAction: "closes import URL input dialog"
    });
  };
  useEffect(() => {
    if (urlStorage)
      setInput(urlStorage);
  }, [urlStorage]);
  return /* @__PURE__ */ React.createElement(URLValidator, {
    handleClose,
    onSubmit: handleSubmit,
    onInputChange: handleInputChange,
    error,
    open,
    sendEvent,
    event,
    inputValue: input
  });
};

const DetailsCard = ({
  key,
  title,
  type,
  description,
  link,
  pointer,
  sendEvent,
  event,
  isViolation
}) => {
  const cardType = isViolation ? "violation" : "rule";
  return /* @__PURE__ */ React.createElement(Card, {
    key,
    onClick: () => sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: `on click ${cardType} card`,
      eventAction: `clicks on ${cardType} card`
    })
  }, /* @__PURE__ */ React.createElement(CardContent, {
    key: title,
    "data-testid": cardType
  }, /* @__PURE__ */ React.createElement(Chip, {
    label: type.toLocaleLowerCase(),
    onClick: () => sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: `on click ${cardType} card tag: ${type.toLocaleLowerCase()}`,
      eventAction: `clicks on ${cardType} card tag`
    })
  }), /* @__PURE__ */ React.createElement(CardText, {
    variant: "h6"
  }, title), description && /* @__PURE__ */ React.createElement(CardText, {
    variant: "subtitle1"
  }, description), /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1",
    component: "div",
    onClick: () => sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: `on click ${cardType} card link`,
      eventAction: `clicks on ${cardType} card ${link}`
    })
  }, /* @__PURE__ */ React.createElement(Link$1, {
    style: { wordBreak: "break-all" },
    to: link
  }, "Rule: ", link)), pointer && /* @__PURE__ */ React.createElement(CardText, {
    style: { wordBreak: "break-all" },
    variant: "subtitle1"
  }, "Location: ", pointer)));
};

const Drawer = styled(Drawer$1)({
  "& [class*=MuiDrawer-paperAnchorRight-]": {
    width: "25%",
    padding: "24px"
  }
});

const Rules = ({
  openRules,
  toggleDrawer,
  sendEvent,
  event
}) => {
  const [rules, setRules] = useState([]);
  const zally = useApi(zallyApiRef);
  useEffect(() => {
    const fetchData = async () => {
      const response = await zally.getRules();
      const filterdRules = response.filter((item) => item.type !== "HINT");
      setRules(filterdRules);
    };
    fetchData();
  }, [zally]);
  if (!rules.length) {
    return /* @__PURE__ */ React.createElement(Loading, null);
  }
  return /* @__PURE__ */ React.createElement(Drawer, {
    anchor: "right",
    open: openRules,
    onClose: toggleDrawer,
    className: "rules-drawer"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Zalando's API Rules"), /* @__PURE__ */ React.createElement(Button$1, {
    onClick: toggleDrawer
  }, "X")), rules.map(({ code, type, url, title }) => /* @__PURE__ */ React.createElement(Box, {
    key: code,
    "data-testid": "rule"
  }, /* @__PURE__ */ React.createElement(DetailsCard, {
    key: code,
    title,
    type,
    link: url,
    sendEvent,
    event
  }))));
};

const URL_STORAGE_KEY = "api-linter-url";
const SCHEMA_STORAGE_KEY = "api-linter-schema";

const APILinterPage = ({
  sendEvent,
  sendPageView,
  eventInfo
}) => {
  const [externalId, setExternalId] = useState(getIDFromURL(location.pathname));
  const [schemaInput, setSchemaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState();
  const [openURL, setOpenURL] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const zally = useApi(zallyApiRef);
  const [schemaStorage, setSchemaStorage] = useLocalStorage(SCHEMA_STORAGE_KEY, "");
  const [urlStorage, setUrlStorage] = useLocalStorage(URL_STORAGE_KEY, "");
  const event = {
    plugin: (eventInfo == null ? void 0 : eventInfo.plugin) || "api-linter",
    eventCategory: (eventInfo == null ? void 0 : eventInfo.eventCategory) || "API Linter plugin"
  };
  const openUrlDialog = () => {
    setOpenURL(true);
  };
  const handleInputChange = (value) => {
    setError("");
    setSchemaInput(value);
    setSchemaStorage(value);
  };
  const handleJsonParsing = (rawValue) => {
    let schema = rawValue;
    try {
      schema = JSON.parse(rawValue);
    } catch {
      return schema;
    }
    const stringified = JSON.stringify(schema, null, 4);
    return stringified;
  };
  const fetchData = (url) => {
    setLoading(true);
    zally.getApiViolations(url).catch((err) => {
      setError(err.message);
      setSchemaInput("");
    }).then((res) => {
      setResponse(res);
    }).finally(() => setLoading(false));
  };
  const toggleDrawer = () => {
    setOpenRules((prev) => !prev);
  };
  const handleSubmitSchema = () => {
    setError("");
    setResponse(void 0);
    if (!schemaInput)
      return;
    sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: "submit schema",
      eventAction: "validates API by schema"
    });
    fetchData({
      api_definition_string: schemaInput
    });
  };
  useEffect(() => {
    if (externalId) {
      zally.getSchemaAndViolations(externalId).then((data) => {
        setResponse(data);
        setSchemaInput(handleJsonParsing(data.api_definition));
        setSchemaStorage(data.api_definition);
      }).catch((err) => setError(err.message));
    }
  }, [zally, externalId, setSchemaStorage]);
  useEffect(() => {
    if (response == null ? void 0 : response.api_definition) {
      setSchemaInput(handleJsonParsing(response.api_definition));
    }
  }, [response == null ? void 0 : response.api_definition]);
  useEffect(() => {
    sendPageView == null ? void 0 : sendPageView();
  }, [sendPageView]);
  useEffect(() => {
    if (schemaStorage) {
      setSchemaInput(handleJsonParsing(schemaStorage));
    }
  }, [schemaStorage]);
  const clearAll = () => {
    setResponse(void 0);
    setSchemaStorage("");
    setSchemaInput("");
    setUrlStorage("");
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Title, {
    variant: "subtitle1"
  }, "Check if your Swagger Schema conforms to", /* @__PURE__ */ React.createElement(SubtitleLink, {
    to: "https://sunrise.zalando.net/docs/default/Component/api/",
    onClick: () => sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: "onClick to Zalando's guidelines",
      eventAction: "Clicks on Zalando's guidelines link"
    })
  }, "Zalando's RESTful API and Event Guidelines")), /* @__PURE__ */ React.createElement(RulesLinkWrapper, {
    onClick: toggleDrawer
  }, /* @__PURE__ */ React.createElement(BookIcon, null), /* @__PURE__ */ React.createElement(RulesLink, {
    onClick: () => sendEvent == null ? void 0 : sendEvent({
      ...event,
      eventLabel: "onClick to view rules",
      eventAction: "clicks on view rules link"
    })
  }, "VIEW THE RULES"))), /* @__PURE__ */ React.createElement(URLComponent, {
    fetchData,
    open: openURL,
    onOpen: setOpenURL,
    onResponse: setResponse,
    onError: setError,
    sendEvent,
    event,
    handleUrlStorage: setUrlStorage,
    urlStorage
  }), /* @__PURE__ */ React.createElement(Schemas, {
    handleClearAll: clearAll,
    openUrlDialog,
    onSubmit: handleSubmitSchema,
    onInputChange: handleInputChange,
    schemaValue: schemaInput,
    response,
    loading,
    error,
    onExternalIdChange: setExternalId,
    sendEvent,
    event,
    handleSchemaStorage: setSchemaStorage
  }), /* @__PURE__ */ React.createElement(Rules, {
    openRules,
    toggleDrawer,
    sendEvent,
    event
  }));
};

export { APILinterPage, APILinterPlugin };
//# sourceMappingURL=index.esm.js.map
