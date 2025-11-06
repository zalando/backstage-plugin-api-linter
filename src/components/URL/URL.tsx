import { type ChangeEvent, useEffect, useState } from 'react';
import type { ViolationsByUrl, ViolationsResponse } from '../../api/types';
import type { ICommonEventInfo, IEventTracking } from '../../event-types';
import { isValidHttpUrl } from '../../helpers';
import { URLValidator } from './components/URLValidator';

type URLProps = {
  open: boolean;
  onOpen: (arg: boolean) => void;
  fetchData: (url: ViolationsByUrl) => void;
  onResponse: (arg?: ViolationsResponse) => void;
  onError: (arg: string) => void;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
  handleUrlStorage: (arg: string) => void;
  urlStorage?: string;
};

export function URLComponent({
  open,
  onOpen,
  fetchData,
  onResponse,
  onError,
  sendEvent,
  event,
  handleUrlStorage,
  urlStorage,
}: URLProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    setInput(e.target.value);
    handleUrlStorage(e.target.value);
  };

  const handleSubmit = () => {
    setError('');
    onError('');
    onResponse(undefined);
    sendEvent?.({
      ...(event as ICommonEventInfo),
      eventLabel: 'onSubmit import URL',
      eventAction: `validates API by URL: ${input}`,
    });

    if (!isValidHttpUrl(input)) {
      setError('Please enter a valid url');
      return;
    }

    onOpen(false);
    fetchData({ api_definition_url: input });
  };

  const handleClose = () => {
    onOpen(false);
    sendEvent?.({
      ...(event as ICommonEventInfo),
      eventLabel: 'on Close import URL input dialog',
      eventAction: 'closes import URL input dialog',
    });
  };

  useEffect(() => {
    if (urlStorage) setInput(urlStorage);
  }, [urlStorage]);

  return (
    <URLValidator
      handleClose={handleClose}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      error={error}
      open={open}
      sendEvent={sendEvent}
      event={event}
      inputValue={input}
    />
  );
}
