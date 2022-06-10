import {
  Box,
  Link,
  Paper,
  Typography,
  Button as ButtonUI,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

export const Label = styled(Typography)({
  display: "flex",
  alignItems: "center",
  fontWeight: 400,
});

export const UrlLink = styled(Link)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  cursor: "pointer",
  marginLeft: 8,
  letterSpacing: 0,
  fontWeight: 500,
  color: "#DE7C02",
});

export const FlexBox = styled(Box)(({ theme }) => ({
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
  `,
  },
}));

export const EditorWrapper = styled(Paper)(({ theme }) => ({
  display: "grid",
  flexDirection: "column",
  marginTop: 12,
  borderRadius: 2,
  gridArea: "editor",
  overflowY: "scroll",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    height: "60vh",
  },
}));

export const SwaggerUIWrapper = styled(Paper)(({ theme }) => ({
  display: "grid",
  backgroundColor: "#fff",
  color: "rgb(87, 90, 94)",
  gridArea: "swagger",
  marginTop: 12,
  height: "100%",
  overflowY: "scroll",
  [theme.breakpoints.down("md")]: {
    height: "60vh",
  },
  "& h3": {
    textAlign: "center",
    paddingTop: 42,
    fontSize: 14,
  },
}));

export const ViolationsWrapper = styled(Paper)(({ theme }) => ({
  display: "grid",
  backgroundColor: "#fff",
  justifyContent: "center",
  marginTop: 12,
  color: "rgb(87, 90, 94)",
  gridArea: "violations",
  height: "100%",
  overflowY: "scroll",
  [theme.breakpoints.down("md")]: {
    height: "60vh",
  },
}));

export const Button = styled(ButtonUI)(
  ({ border = "" }: { border: string }) => ({
    marginBottom: 4,
    marginRight: 4,
    color: "#DE7C02",
    border: `1px solid ${border ? "#DE7C0250" : "none"}`,
  })
);
