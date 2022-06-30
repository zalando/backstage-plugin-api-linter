import { Violation } from "../api/types";


export const getIDFromURL = (baseUrl: string) => {
  const tokenPattern = /[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}/g;
  const urlToken = baseUrl.split('/').filter(item => item.match(tokenPattern));

  if (urlToken.length) return urlToken.join('');

  return '';
};

export const isValidHttpUrl = (input: string) => {
  let url;

  try {
    url = new URL(input);
  } catch (_) {
    return false;
  }

  return url;
};

export const aggregateByViolation = (list: Violation[]) => {
  const isRepeated = (item: string, array: string[]) => array.includes(item);
  const generateDescription = (previous: string | string[], current: string) =>
    Array.isArray(previous) ? [...previous, current] : [previous, current];

  const aggregated: Violation[] = [];

  list.forEach((item: Violation) => {
    const alreadySeen = aggregated.find(i => i.title === item.title);

    if (!alreadySeen) {
      aggregated.push(item);
    } else {
      if (
        !isRepeated(
          item.description as string,
          alreadySeen.description as string[],
        )
      ) {
        alreadySeen.description = generateDescription(
          alreadySeen.description,
          item.description as string,
        );
      }
      if (!isRepeated(item.pointer, alreadySeen.paths)) {
        alreadySeen.paths.push(item.pointer);
      }
    }
  });
  return aggregated;
};

export const forceChangeAndClear = (
  func: (arg: string) => void,
  time: number,
) => {
  func('swagger: "2.0"');
  setTimeout(() => {
    func('');
  }, time);
};
