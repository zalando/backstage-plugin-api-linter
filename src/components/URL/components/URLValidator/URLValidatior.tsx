import type { ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import type { ICommonEventInfo, IEventTracking } from '../../../../event-types';

type URLValidatorProps = {
  onSubmit: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
  open: boolean;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
  inputValue: string;
  handleClose: () => void;
};

export const URLValidator = ({
  onSubmit,
  onInputChange,
  inputValue,
  error,
  open,
  sendEvent,
  event,
  handleClose,
}: URLValidatorProps) => (
  <Dialog
    maxWidth="xl"
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
  >
    <DialogContent>
      <TextField
        onFocus={() =>
          sendEvent?.({
            ...(event as ICommonEventInfo),
            eventLabel: 'onFocus import URL input',
            eventAction: 'focus on import URL input',
          })
        }
        error={!!error}
        id="outlined-error-helper-text"
        data-testid="import-url-wrapper"
        label="Enter the URL to import from"
        placeholder="https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/petstore.json"
        helperText={error}
        fullWidth
        onChange={onInputChange}
        value={inputValue}
        sx={{ width: 650, height: 50 }}
      />
    </DialogContent>

    <DialogActions sx={{ padding: '0 24px 50px 24px' }}>
      <Button variant="outlined" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        variant="outlined"
        onClick={onSubmit}
        color="primary"
        data-testid="url-validate"
        disabled={!inputValue}
      >
        Validate
      </Button>
    </DialogActions>
  </Dialog>
);
