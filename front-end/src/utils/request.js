const API_BE = `http://localhost:8080/api/v2`;

const tryParseJSON = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {}; 
};

export const get = async (path) => {
  const response = await fetch(`${API_BE}/${path}`);
  return await tryParseJSON(response);
};

export const post = async (options, path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  return await tryParseJSON(response);
};

export const put = async (options, path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  return await tryParseJSON(response);
};

export const patch = async (options, path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  return await tryParseJSON(response);
};

export const del = async (path) => {
  const response = await fetch(`${API_BE}/${path}`, {
    method: "DELETE",
  });
  return await tryParseJSON(response);
};