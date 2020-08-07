// ==UserScript==
// @name         Opening book
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Instantly plays openings of your choice on chess.com.
// @author       Robbie Moore
// @match        https://www.chess.com/live
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  console.log("Opening book is running");
  let clientId = "";
  window.OriginalWebSocket = window.WebSocket;
  window.websockets = [];
  const userId = +JSON.parse(
    atob(document.cookie.slice(document.cookie.indexOf("=") + 1))
  ).userId;
  /**
   * @param websocket{WebSocket}
   */
  window.WebSocket = new Proxy(WebSocket, {
    construct(target, args) {
      const wsObject = new target(...args);
      window.websockets.push(wsObject);
      if (window.websockets.length === 2) {
        setTimeout(onWebsocketInitialization, 50); // wait for onmessage to be set
      }
      return wsObject;
    },
  });
  function onWebsocketInitialization() {
    const cometSocket = window.websockets.find((ws) =>
      ws.url.includes("cometd")
    );
    if (cometSocket != null) {
      listenToMainWebSocket(cometSocket);
    }
  }
  /**
   * @param{WebSocket} socket
   */
  function listenToMainWebSocket(socket) {
    const originalMessageHandler = socket.onmessage;
    socket.onmessage = (event) => {
      const messages = JSON.parse(event.data);
      const returnValue = originalMessageHandler.call(socket, event);
      messages.forEach(onMessage);
      return returnValue;
    };
  }
  function onMessage(data) {
    if ("clientId" in data) {
      clientId = data.clientId;
    }
    if (data?.data?.game?.players) {
      const players = data.data.game.players;
      const indexOfUser = players.findIndex((player) => player.id === userId);
      if (indexOfUser !== -1) {
        const userSide = indexOfUser === 0 ? "white" : "black";
        const sideToMove = data.data.game.seq % 2 === 0 ? "white" : "black";
        if (userSide === sideToMove) {
          onOpponentMove(data.data.game.seq);
        }
      }
    }
  }
  function onOpponentMove(ply) {}
})();
