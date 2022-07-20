import React, { useEffect, useState } from "react";
import { Schemas } from "../Schemas";
import { useApi } from "@backstage/core-plugin-api";
import { zallyApiRef } from "../../api";
import { URLComponent } from "../URL";
import { Rules } from "../Rules";
import { forceChangeAndClear, getIDFromURL } from "../../helpers";
import { SCHEMA_STORAGE_KEY, URL_STORAGE_KEY } from "../../constants";
import { useLocalStorage } from "react-use";
import { Header } from "../Header";
import {
  ViolationsByString,
  ViolationsByUrl,
  ViolationsResponse,
} from "../../api/types";
import { ICommonEventInfo, IEventTracking } from "../../event-types";

type APILinterProps = {
  sendEvent?: (args: IEventTracking) => void;
  sendPageView?: VoidFunction;
  eventInfo?: ICommonEventInfo;
};

export const APILinter: React.FC<APILinterProps> = ({
  sendEvent = undefined,
  sendPageView = undefined,
  eventInfo = undefined,
}) => {
  const [externalId, setExternalId] = useState(getIDFromURL(location.pathname));
  const [schemaInput, setSchemaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<ViolationsResponse>();
  const [openURL, setOpenURL] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const zally = useApi(zallyApiRef);
  const [schemaStorage, setSchemaStorage] = useLocalStorage(
    SCHEMA_STORAGE_KEY,
    ""
  );
  const [urlStorage, setUrlStorage] = useLocalStorage(URL_STORAGE_KEY, "");

  const event: ICommonEventInfo = {
    plugin: eventInfo?.plugin || "api-linter",
    eventCategory: eventInfo?.eventCategory || "API Linter plugin",
  };

  const openUrlDialog = () => {
    setOpenURL(true);
  };

  const handleInputChange = (value: string): void => {
    setError("");
    setSchemaInput(value);
    setSchemaStorage(value);
  };

  const handleJsonParsing = (rawValue: string) => {
    let schema = rawValue;
    try {
      schema = JSON.parse(rawValue);
    } catch {
      return schema;
    }
    const stringified = JSON.stringify(schema, null, 4);
    return stringified;
  };

  const fetchData = (url: ViolationsByUrl | ViolationsByString) => {
    setLoading(true);

    zally
      .getApiViolations(url)
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      })
      .then((res) => {
        setResponse(res as ViolationsResponse);
      })
      .finally(() => setLoading(false));
  };

  const toggleDrawer = () => {
    setOpenRules((prev) => !prev);
  };

  const handleSubmitSchema = () => {
    setError("");
    setResponse(undefined);
    if (!schemaInput) return;

    sendEvent?.({
      ...event,
      eventLabel: "submit schema",
      eventAction: "validates API by schema",
    });

    fetchData({
      api_definition_string: schemaInput,
    });
  };

  useEffect(() => {
    if (externalId) {
      zally
        .getSchemaAndViolations(externalId)
        .then((data) => {
          setResponse(data);
          setSchemaInput(handleJsonParsing(data.api_definition));
          setSchemaStorage(data.api_definition);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [zally, externalId, setSchemaStorage]);

  useEffect(() => {
    if (response?.api_definition) {
      setSchemaInput(handleJsonParsing(response.api_definition));
    }
  }, [response?.api_definition]);

  useEffect(() => {
    sendPageView?.();
  }, [sendPageView]);

  useEffect(() => {
    if (schemaStorage) {
      setSchemaInput(handleJsonParsing(schemaStorage));
    }
  }, [schemaStorage]);

  const clearAll = () => {
    setResponse(undefined);
    setSchemaStorage("");
    forceChangeAndClear(setSchemaInput, 0);
    setUrlStorage("");
  };

  return (
    <>
      <Header
        eventInfo={event}
        sendEvent={sendEvent}
        toggleDrawer={toggleDrawer}
      />

      <URLComponent
        fetchData={fetchData}
        open={openURL}
        onOpen={setOpenURL}
        onResponse={setResponse}
        onError={setError}
        sendEvent={sendEvent}
        event={event}
        handleUrlStorage={setUrlStorage}
        urlStorage={urlStorage}
      />

      <Schemas
        handleClearAll={clearAll}
        openUrlDialog={openUrlDialog}
        onSubmit={handleSubmitSchema}
        onInputChange={handleInputChange}
        schemaValue={schemaInput}
        response={response}
        loading={loading}
        error={error}
        onExternalIdChange={setExternalId}
        sendEvent={sendEvent}
        event={event}
        handleSchemaStorage={setSchemaStorage}
      />

      <Rules
        openRules={openRules}
        toggleDrawer={toggleDrawer}
        sendEvent={sendEvent}
        event={event}
      />
    </>
  );
};
