{
  var WS = window.WebSocket;
  function DevWebSocket(s) {
    if (s.match(/ws:\/\/.*?\/sockjs-node/i)) {
      console.info("[DEV NOTICE] Live Reload Has Been Disabled");
      return {};
    } else {
      // Pass through other usage of sockets
      return new WS(s);
    }
  }
  window.WebSocket = DevWebSocket;
}
