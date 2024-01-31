import { API_URL } from '@env';
export async function postData(url = '', data = {}) {
  try {
    console.log(url, API_URL);
    const response = await fetch(`${API_URL}` + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (err) {
    return err;
  }
}

export async function getData(url = '') {
  const response = await fetch(`${API_URL}` + url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}
