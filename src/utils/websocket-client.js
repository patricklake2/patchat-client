export function createClient(siteId) {
  const url = `wss://nugm59x1e1.execute-api.eu-west-2.amazonaws.com/dev?siteId=${siteId}`;
  return new Promise((resolve, reject) => {
    const client = new WebSocket(url);
    client.onopen = () => resolve(client);
    client.onerror = () => reject('Could not connect');
  })
}