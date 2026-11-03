async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getStoredAdminToken() || adminStore.token;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    adminStore.token = token;
  }

  const response = await fetch(`${API_BASE_URL}/${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch (error) {
    payload = { message: text };
  }

  if (!response.ok) {
    throw new Error((payload && payload.message) || `Yêu cầu thất bại (${response.status})`);
  }

  return payload;
}
