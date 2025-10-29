export type Rule = {
  title: string;
  code: string;
  type: string;
  url: string;
  is_active: boolean;
};

export type Violation = {
  title: string;
  description: string | string[];
  violation_type: string;
  rule_link: string;
  paths: string[];
  pointer: string;
  start_line: number;
  end_line: number;
};

export type ViolationCount = {
  must: number;
  should: number;
  may: number;
  hint: number;
};

export type ViolationsResponse = {
  external_id: string;
  message: string;
  violations: Violation[];
  violations_count: ViolationCount;
  api_definition: string;
};

export type ViolationRequest = {
  api_definition: {};
  api_definition_string: string;
  api_definition_url: string;
  ignore_rules: string[];
};

export type ViolationsByUrl = Pick<ViolationRequest, 'api_definition_url'>;

export type ViolationsByString = Pick<
  ViolationRequest,
  'api_definition_string'
>;

export type ZallyApiType = {
  getRules(): Promise<Rule[]>;
  getApiViolations(
    request: ViolationsByUrl | ViolationsByString,
  ): Promise<ViolationsResponse>;
  getSchemaAndViolations(id: string): Promise<ViolationsResponse>;
};
