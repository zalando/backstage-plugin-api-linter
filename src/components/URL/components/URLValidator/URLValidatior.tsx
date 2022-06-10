import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import React from "react";

type URLValidatorProps = {
  onSubmit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  open: boolean;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
  inputValue: string;
  handleClose: () => void;
};

export const URLValidator: React.VFC<URLValidatorProps> = ({
  onSubmit,
  onInputChange,
  inputValue,
  error,
  open,
  sendEvent,
  event,
  handleClose,
}) => (
  <Dialog
    maxWidth="xl"
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        <TextField
          onFocus={() =>
            sendEvent?.({
              ...(event as ICommonEventInfo),
              eventLabel: "onFocus import URL input",
              eventAction: "focus on import URL input",
            })
          }
          error={!!error}
          id="outlined-error-helper-text"
          label="Enter the URL to import from"
          placeholder="https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/petstore.json"
          helperText={error}
          fullWidth
          onChange={onInputChange}
          value={inputValue}
          style={{
            width: 650,
            height: 50,
          }}
        />
      </DialogContentText>
    </DialogContent>

    <DialogActions style={{ padding: "0 24px 50px 24px" }}>
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
