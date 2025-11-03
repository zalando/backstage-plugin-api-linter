import BoxUI from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const Box = styled(BoxUI)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr .5fr',
  gridTemplateRows: 'auto',
  columnGap: '8px',
  gridTemplateAreas: `
    'editor swagger violations'
  `,
  height: '58vh',
  [theme.breakpoints.down('lg')]: {
    height: '54vh',
  },
  [theme.breakpoints.down('md')]: {
    height: '100vh',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr  1fr',
    rowGap: '8px',
    gridTemplateAreas: `
    'editor'
    'swagger'
    'violations'
  `,
  },
}));

export const EditorWrapper = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  marginTop: 12,
  borderRadius: 2,
  gridArea: 'editor',
  overflowY: 'scroll',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
  },
}));

export const SwaggerUIWrapper = styled(Paper)(({ theme }) => ({
  gridArea: 'swagger',
  marginTop: 12,
  height: '100%',
  overflowY: 'scroll',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
  },
  '& h3': {
    textAlign: 'center',
    paddingTop: 42,
    fontSize: 14,
  },
  /**
   * These styles are taken from @backstage/plugin-api-docs
   * @see https://github.com/backstage/backstage/blob/master/plugins/api-docs/src/components/OpenApiDefinitionWidget/OpenApiDefinition.tsx
   */
  '& .swagger-ui': {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,

    ['& .btn-clear']: {
      color: theme.palette.text.primary,
    },
    [`& .scheme-container`]: {
      backgroundColor: theme.palette.background.default,
    },
    [`& .opblock-tag,
          .opblock-tag small,
          table thead tr td,
          table thead tr th,
          table tbody tr td,
          table tbody tr th`]: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      borderColor: theme.palette.divider,
    },
    [`& section.models,
          section.models.is-open h4`]: {
      borderColor: theme.palette.divider,
    },
    [`& .model-title,
          .model .renderedMarkdown,
          .model .description`]: {
      fontFamily: theme.typography.fontFamily,
      fontWeight: theme.typography.fontWeightRegular,
    },
    [`& h1, h2, h3, h4, h5, h6,
          .errors h4, .error h4, .opblock h4, section.models h4,
          .response-control-media-type__accept-message,
          .opblock .opblock-summary-description,
          .opblock .opblock-summary-operation-id,
          .opblock .opblock-summary-path,
          .opblock .opblock-summary-path__deprecated,
          .opblock .opblock-description-wrapper,
          .opblock .opblock-external-docs-wrapper,
          .opblock .opblock-section-header .btn,
          .opblock .opblock-section-header>label,
          .scheme-container .schemes>label,a.nostyle,
          .parameter__name,
          .response-col_status,
          .response-col_links,
          .error .btn,
          .info .title,
          .info .base-url`]: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
    },
    [`& .opblock .opblock-section-header,
          .model-box,
          section.models .model-container`]: {
      background: theme.palette.background.default,
    },
    [`& .prop-format,
          .parameter__in`]: {
      color: theme.palette.text.disabled,
    },
    [`& table.model,
          .parameter__type,
          .model.model-title,
          .model-title,
          .model span,
          .model .brace-open,
          .model .brace-close,
          .model .property.primitive,
          .model .renderedMarkdown,
          .model .description,
          .errors small`]: {
      color: theme.palette.text.secondary,
    },
    [`& .parameter__name.required:after,
        .parameter__name.required span`]: {
      color: theme.palette.warning.dark,
    },
    [`& table.model,
          table.model .model,
          .opblock .opblock-external-docs-wrapper`]: {
      fontSize: theme.typography.fontSize,
    },
    [`& table.headers td`]: {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
    },
    [`& .model-hint`]: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.paper,
    },
    [`& .opblock .opblock-summary-method,
          .info a`]: {
      fontFamily: theme.typography.fontFamily,
    },
    [`& .info, .opblock, .tab`]: {
      [`& li, p`]: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
      },
    },
    [`& a`]: {
      color: theme.palette.primary.main,
    },
    [`& .renderedMarkdown code`]: {
      color: theme.palette.secondary.light,
    },
    [`& .property-row td:first-of-type`]: {
      color: theme.palette.text.primary,
    },
    [`& span.prop-type`]: {
      color: theme.palette.success.light,
    },
    [`& .opblock-control-arrow svg, .authorization__btn .unlocked`]: {
      fill: theme.palette.text.primary,
    },
    [`& .json-schema-2020-12__title,
          .json-schema-2020-12-keyword__name,
          .json-schema-2020-12-property .json-schema-2020-12__title,
          .json-schema-2020-12-keyword--description`]: {
      color: theme.palette.text.primary,
    },
    [`.json-schema-2020-12-accordion__icon svg`]: {
      fill: theme.palette.text.primary,
    },
    [`& .json-schema-2020-12-accordion,
          .json-schema-2020-12-expand-deep-button`]: {
      background: 'none',
      appearance: 'none',
    },
    [`& .json-schema-2020-12-expand-deep-button,
          .json-schema-2020-12-keyword__name--secondary,
          .json-schema-2020-12-keyword__value--secondary,
          .json-schema-2020-12__attribute--muted,
          .json-schema-2020-12-keyword__value--const,
          .json-schema-2020-12-keyword__value--warning`]: {
      color: theme.palette.text.secondary,
    },
    [`& .json-schema-2020-12-body,
          .json-schema-2020-12-keyword__value--const,
          .json-schema-2020-12-keyword__value--warning`]: {
      borderColor: theme.palette.text.secondary,
    },
    [`.json-schema-2020-12__constraint--string`]: {
      backgroundColor: theme.palette.primary.main,
    },
    [`& .json-schema-2020-12__attribute--primary`]: {
      color: theme.palette.primary.main,
    },
    [`& .json-schema-2020-12-property--required>.json-schema-2020-12:first-of-type>.json-schema-2020-12-head .json-schema-2020-12__title:after`]:
      {
        color: theme.palette.warning.dark,
      },
    svg: {
      fill: 'currentColor',
      color: 'inherit',
    },
    button: {
      colorScheme: 'dark light',
    },
    '.model-toggle::after': {
      filter: `invert(${+(theme.palette.mode === 'dark')})`,
    },
  },
}));

export const ViolationsWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey.A200
      : theme.palette.background.default,
  justifyContent: 'center',
  marginTop: 12,
  gridArea: 'violations',
  height: '100%',
  overflowY: 'scroll',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
  },
}));
