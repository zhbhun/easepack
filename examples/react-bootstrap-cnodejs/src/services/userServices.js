import { BASE_URL } from '../config';

export function login(accessToken) {
  const url = `${BASE_URL}/accesstoken`;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accesstoken: accessToken,
    }),
  }).then((response) => response.json());
}

export function getUserInfo(loginname) {
  const url = `${BASE_URL}/user/${loginname}`;
  return fetch(url).then((response) => response.json());
}
