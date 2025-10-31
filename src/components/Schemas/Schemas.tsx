import { useEffect } from 'react';
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
import { Box, Typography } from '@material-ui/core';
import { Violations } from '../Violations';
import { ViolationsResponse } from '../../api/types';
import LinkIcon from '@material-ui/icons/Link';
import SwaggerUI from 'swagger-ui-react';

import * as S from './styles';
import { ICommonEventInfo, IEventTracking } from '../../event-types';

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

export const Schemas: React.FC<SchemasProps> = ({
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
}) => {
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
      <Typography variant="h4" component="h2" style={{ fontSize: 18 }}>
        Schemas
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="100%"
      >
        <S.Label variant="body1">
          Paste a swagger schema here. Or
          <S.UrlLink onClick={handleOnClick}>
            <LinkIcon />
            <span>IMPORT URL</span>
          </S.UrlLink>
        </S.Label>
        <Box display="flex" justifyContent="space-between">
          <S.Button
            border=""
            variant="text"
            onClick={handleClearAll}
            data-testid="schema-clear"
          >
            clear
          </S.Button>
          <S.Button
            border="true"
            variant="outlined"
            onClick={onSubmit}
            data-testid="schema-validate"
            disabled={!schemaValue}
          >
            Validate
          </S.Button>
        </Box>
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
            theme="chrome"
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
};
