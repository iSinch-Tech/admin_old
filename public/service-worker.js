let token = null;

self.addEventListener(
  'message', 
  (event) => {
    if (event.data && event.data.type === 'UPDATE_TOKEN') {
      token = event.data.payload;
    }
  }
);

self.addEventListener(
  'fetch',
  (event) => {
    if (
      event.request.url.includes('files') &&
      event.request.url.includes('download') &&
      event.request.method === 'GET'
    ) {
      event.respondWith(customHeaderRequestFetch(event))
    }
  }
);

function customHeaderRequestFetch(event) {
  const headers = new Headers(event.request.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }  

  const newRequest = new Request(event.request, {
    mode: 'cors',
    credentials: 'omit',
    headers: headers
  })
  return fetch(newRequest)
}