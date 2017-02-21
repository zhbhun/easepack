import { BASE_URL } from '../config';

export function addReply(accessToken, topic, content, reply = '') {
  const url  = `${BASE_URL}/topic/${topic}/replies`;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accesstoken: accessToken,
      content,
      reply_id: reply,
    }),
  }).then((response) => response.json());
}

export function favoriteReply(accessToken, id) {
  const url  = `${BASE_URL}/reply/${id}/ups`;
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
