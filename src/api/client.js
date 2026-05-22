const BASE_URL = 'https://forum-api.dicoding.dev/v1';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await response.json();

  if (json.status !== 'success') {
    throw new Error(json.message || 'Terjadi kesalahan');
  }

  return json.data;
}

export const api = {
  register: (payload) => request('/register', { method: 'POST', body: payload }),
  login: (payload) => request('/login', { method: 'POST', body: payload }),
  getOwnProfile: (token) => request('/users/me', { token }),
  getUsers: () => request('/users'),
  getThreads: () => request('/threads'),
  getThreadDetail: (threadId) => request(`/threads/${threadId}`),
  createThread: (payload, token) => request('/threads', { method: 'POST', body: payload, token }),
  createComment: (threadId, payload, token) => request(`/threads/${threadId}/comments`, { method: 'POST', body: payload, token }),
  getLeaderboards: () => request('/leaderboards'),
  upVoteThread: (threadId, token) => request(`/threads/${threadId}/up-vote`, { method: 'POST', token }),
  downVoteThread: (threadId, token) => request(`/threads/${threadId}/down-vote`, { method: 'POST', token }),
  neutralVoteThread: (threadId, token) => request(`/threads/${threadId}/neutral-vote`, { method: 'POST', token }),
  upVoteComment: (threadId, commentId, token) => request(`/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST', token }),
  downVoteComment: (threadId, commentId, token) => request(`/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST', token }),
  neutralVoteComment: (threadId, commentId, token) => request(`/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST', token }),
};
