import { Params } from "@angular/router";

export const parseQueryParams = (query: string): Params =>
  query
    .split('&')
    .map(pair => pair.split('='))
    .reduce((params, [key, value]) => ({ ...params, [key]: value }), {});
