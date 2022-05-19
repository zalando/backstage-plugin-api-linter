interface IEventTracking {
  /**
   * Plugin name
   * @example `"create-repository"`
   */
  plugin: string;
  /**
   * A label to give the event some context
   * @example `"Template: mkdocs"`
   */
  eventLabel: string;
  /**
   * The action triggering this event
   * @example `"Template 'mkdocs' is selected"`
   */
  eventAction: string;
  /**
   * A category that can be filtered to give a top view of a certain feature
   * @example `"Repository Creator"`
   */
  eventCategory: string;
}

interface ICommonEventInfo {
  plugin: string;
  eventCategory: string;
}

