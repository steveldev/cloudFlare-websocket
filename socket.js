addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const upgradeHeader = request.headers.get('Upgrade')
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 })
  }

  const webSocketPair = new WebSocketPair()
  const [client, server] = Object.values(webSocketPair)

  server.accept()

  server.addEventListener('message', event => {
    console.log('Message reçu du client:', event.data)
    server.send('Le serveur a reçu votre message : ' + event.data)
  })

  server.addEventListener('close', event => {
    console.log('WebSocket fermé')
  })

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
}
