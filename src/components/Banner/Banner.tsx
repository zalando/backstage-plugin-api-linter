import React, { ReactNode } from "react";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { useLocalStorage } from "react-use";
import * as S from "./styles";
import { IEventTracking } from "../../event-types";

type BannerProps = {
  sendEvent: ((args: IEventTracking) => void) | undefined;
  variant: "standard" | "filled" | "outlined";
  severity: "success" | "info" | "warning" | "error";
  id: string;
  children: ReactNode;
};

export const Banner: React.FC<BannerProps> = ({
  variant,
  severity,
  id,
  children,
}) => {
  const [open, setOpen] = useLocalStorage<boolean>(`${id}Dismissible`, true);

  return (
    <S.BannerWrapper>
      <Collapse in={open}>
        <Alert
          action={
            <CloseIcon
              onClick={() => {
                setOpen(false);
              }}
              fontSize="inherit"
            />
          }
          variant={variant}
          severity={severity}
        >
          {children}
        </Alert>
      </Collapse>
    </S.BannerWrapper>
  );
};
