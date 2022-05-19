import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import React from 'react';

declare const APILinterPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;

declare type APILinterProps = {
    sendEvent?: (args: IEventTracking) => void;
    sendPageView?: VoidFunction;
    eventInfo?: ICommonEventInfo;
};
declare const APILinterPage: React.VFC<APILinterProps>;

export { APILinterPage, APILinterPlugin };
