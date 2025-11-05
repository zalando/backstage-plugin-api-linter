import { ViolationsResponse } from '../../api/types';
import { ICommonEventInfo, IEventTracking } from '../../event-types';
import { Loading } from '../Loading';
import { ViolationsCard } from './components';
import * as S from './styles';

type ViolationsProps = {
  response?: ViolationsResponse;
  loading: boolean;
  error: string;
  onExternalIdChange: (arg: string) => void;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
};

export const Violations: React.VFC<ViolationsProps> = ({
  response,
  loading,
  error,
  onExternalIdChange,
  sendEvent,
  event,
}) => {
  const hasResponse =
    !loading && response && response.violations_count && !error;
  const hasError = !loading && !response && !!error;
  const shouldDisplayPlaceholder = !hasResponse && !hasError && !loading;

  return (
    <>
      {hasResponse && (
        <S.ViolationsWrapper>
          <ViolationsCard
            {...(response as ViolationsResponse)}
            onExternalIdChange={onExternalIdChange}
            sendEvent={sendEvent}
            event={event}
          />
        </S.ViolationsWrapper>
      )}

      {loading && <Loading />}

      {hasError && <S.ViolationsEmpty>Error: {error}</S.ViolationsEmpty>}

      {shouldDisplayPlaceholder && (
        <S.ViolationsPlaceholder>
          Validation result will
          <br /> be presented here
        </S.ViolationsPlaceholder>
      )}
    </>
  );
};
