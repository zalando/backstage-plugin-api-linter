import { useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-one_dark';
import 'brace';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/theme/chrome';
import 'brace/theme/dracula';
import 'brace/mode/yaml';
import 'brace/mode/json';
import 'brace/snippets/yaml';
import 'brace/snippets/json';
import 'swagger-ui-react/swagger-ui.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Violations } from '../Violations';
import type { ViolationsResponse } from '../../api/types';
import LinkIcon from '@mui/icons-material/Link';
import SwaggerUI from 'swagger-ui-react';
import Button from '@mui/material/Button';
import * as S from './styles';
import type { ICommonEventInfo, IEventTracking } from '../../event-types';
import { useTheme } from '@mui/material/styles';

type SchemasProps = {
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  schemaValue: string;
  response?: ViolationsResponse;
  loading: boolean;
  error: string;
  onExternalIdChange: (arg: string) => void;
  openUrlDialog: VoidFunction;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
  handleSchemaStorage: (value: string) => void;
  handleClearAll: VoidFunction;
};

export function Schemas({
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
  handleClearAll,
}: SchemasProps) {
  const theme = useTheme();
  const handleOnClick = () => {
    openUrlDialog();
    sendEvent?.({
      ...(event as ICommonEventInfo),
      eventLabel: 'onClick to import URL link',
      eventAction: 'Clicks on import URL link',
    });
  };

  let mode;
  try {
    JSON.parse(schemaValue as string);
    mode = 'json';
  } catch (e) {
    mode = 'yaml';
  }

  useEffect(() => {
    handleSchemaStorage(schemaValue);
  }, [schemaValue, handleSchemaStorage]);

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Typography variant="h4" component="h2" sx={{ fontSize: 18 }}>
        Schemas
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        gap={0.5}
      >
        <Typography variant="body1">Paste a swagger schema here. Or</Typography>
        <Button
          startIcon={<LinkIcon />}
          variant="text"
          disableRipple
          onClick={handleOnClick}
          data-testid="import-url-btn"
          sx={{
            fontSize: '1rem',
            '&:hover': {
              background: 'none',
              textDecoration: 'underline',
            },
          }}
        >
          IMPORT URL
        </Button>
        <Box flexGrow={1} />
        <Button
          variant="text"
          onClick={handleClearAll}
          data-testid="schema-clear"
        >
          clear
        </Button>
        <Button
          variant="outlined"
          onClick={onSubmit}
          data-testid="schema-validate"
          disabled={!schemaValue}
        >
          Validate
        </Button>
      </Box>

      <S.Box>
        <S.EditorWrapper>
          <AceEditor
            wrapEnabled
            onFocus={() =>
              sendEvent?.({
                ...(event as ICommonEventInfo),
                eventLabel: 'onFocus on Schema Editor input',
                eventAction: 'focus on Schema Editor input',
              })
            }
            enableBasicAutocompletion
            enableLiveAutocompletion
            mode={mode}
            width="100%"
            height="100%"
            theme={theme.palette.mode === 'dark' ? 'dracula' : 'chrome'}
            showPrintMargin={false}
            onChange={onInputChange}
            name="editor"
            value={schemaValue}
            editorProps={{ $blockScrolling: true, enableSnippets: true }}
          />
        </S.EditorWrapper>

        <S.SwaggerUIWrapper>
          {/* @ts-ignore */}
          <SwaggerUI spec={schemaValue} />
        </S.SwaggerUIWrapper>

        <S.ViolationsWrapper>
          <Violations
            response={response}
            loading={loading}
            error={error}
            onExternalIdChange={onExternalIdChange}
            sendEvent={sendEvent}
            event={event}
          />
        </S.ViolationsWrapper>
      </S.Box>
    </Box>
  );
}
