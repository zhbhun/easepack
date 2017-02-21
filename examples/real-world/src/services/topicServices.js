import { BASE_URL } from '../config';

export function getTopics(tab, page, limit) {
  const url  = `${BASE_URL}/topics?tab=${tab}&page=${page}&limit=${limit}`;
  return fetch(url).then((response) => response.json());
}

export function getTopicById(accessToken, id) {
  const url  = `${BASE_URL}/topic/${id}?accesstoken=${accessToken || ''}`;
  return fetch(url).then((response) => response.json());
}

export function addTopic(accessToken, tab, title, content) {
  const url = `${BASE_URL}/topics`;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accesstoken: accessToken,
      tab,
      title,
      content,
    }),
  }).then((response) => response.json());
}

export function collectTopic(accessToken, id) {
  const url = `${BASE_URL}/topic_collect/collect`;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accesstoken: accessToken,
      topic_id: id,
    }),
  }).then((response) => response.json());
}

export function deCollectTopic(accessToken, id) {
  const url = `${BASE_URL}/topic_collect/de_collect`;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accesstoken: accessToken,
      topic_id: id,
    }),
  }).then((response) => response.json());
}
