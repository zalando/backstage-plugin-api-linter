import type {
  ViolationsByString,
  ViolationsByUrl,
  ViolationsResponse,
  ZallyApiType,
} from '../../../api/types';

export const mockZallyApi: ZallyApiType = {
  async getRules() {
    return [
      {
        title: 'Who Am I',
        url: 'https://imarule.com',
        type: 'MUST',
        code: '109',
        is_active: true,
      },
    ];
  },

  async getApiViolations(
    _request: ViolationsByUrl | ViolationsByString,
  ): Promise<ViolationsResponse> {
    return {
      external_id: 'id',
      message: 'string',
      violations: [
        {
          title: 'This is a violation',
          description: 'you have violated',
          violation_type: 'must',
          rule_link: 'www.thisisalink',
          paths: ['/abc/def'],
          pointer: 'pei',
          start_line: 0,
          end_line: 10,
        },
      ],
      violations_count: { must: 1, should: 0, may: 1, hint: 0 },
      api_definition: 'string',
    };
  },

  async getSchemaAndViolations(_id: string): Promise<ViolationsResponse> {
    return {
      external_id: 'id',
      message: 'string',
      violations: [
        {
          title: 'This is a violation in a permalink',
          description: 'a link that is permanently here',
          violation_type: 'should',
          rule_link: 'www.thisisalink',
          paths: ['/abc/def'],
          pointer: 'pei',
          start_line: 0,
          end_line: 10,
        },
      ],
      violations_count: { must: 0, should: 1, may: 0, hint: 0 },
      api_definition: 'string',
    };
  },
};

export const mockZallyApiEmpty: ZallyApiType = {
  async getRules() {
    return [];
  },

  async getApiViolations(
    _request: ViolationsByUrl | ViolationsByString,
  ): Promise<ViolationsResponse> {
    return {
      external_id: 'id',
      message: 'string',
      violations: [],
      violations_count: { must: 0, should: 0, may: 0, hint: 0 },
      api_definition: 'string',
    };
  },

  async getSchemaAndViolations(id: string): Promise<ViolationsResponse> {
    return {
      external_id: id,
      message: 'string',
      violations: [],
      violations_count: { must: 0, should: 0, may: 0, hint: 0 },
      api_definition: 'string',
    };
  },
};
