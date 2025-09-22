const API_BE = `http://localhost:8080/api/v2`;

export const get = async (path) => {
    const response = await fetch(`${API_BE}/${path}`);
    const result = await response.json();
    return result;
}

export const post = async (options, path) => {
    const response = await fetch(`${API_BE}/${path}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    });
    const result = await response.json();
    return result;
}

export const put = async (options, path) => {
    const response = await fetch(`${API_BE}/${path}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    });
    const result = await response.json();
    return result;
}

export const patch = async (options, path) => {
    const response = await fetch(`${API_BE}/${path}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    });
    const result = await response.json();
    return result;
}

export const del = async (path) => {
    await fetch(`${API_BE}/${path}`, {
        method: "DELETE"
    });
    // const result = await response.json();
    // return result;
}