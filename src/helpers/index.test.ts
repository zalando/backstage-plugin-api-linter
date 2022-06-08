import { getIDFromURL, isValidHttpUrl } from './index';

function mockURL(path: string) {
  return `https://www.example.com/api/linter/${path}/redirected`;
}

describe('api-linter: helpers', () => {
  it('getIDfromURL: should return id if valid id is given', () => {
    const id = '1490f461-ba7c-4429-98c4-032fec210b07';
    mockURL(id);

    expect(getIDFromURL(mockURL(id))).toBe(id);
  });

  it('getIDfromURL: should return null when invalid id is given', () => {
    const invalidId = '1490f461-ba7c-4429-98c4';

    expect(getIDFromURL(mockURL(invalidId))).toBe('');
  });

  it('getIDfromURL: should return null when no id is given', () => {
    const emptyid = '';

    expect(getIDFromURL(mockURL(emptyid))).toBe('');
  });

  it('isValidHttpUrl: should return false when invalid url is given', () => {
    expect(isValidHttpUrl('www.allesgut.gutgut')).toBeFalsy();
  });

  it('isValidHttpUrl: should return true when invalid url is given', () => {
    expect(isValidHttpUrl('http://www.thisisvalid.com')).toBeTruthy();
  });
});
