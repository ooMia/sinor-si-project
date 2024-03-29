import { Client } from "@stomp/stompjs";

import { WebSocket } from "ws";
Object.assign(global, { WebSocket });

// const serverHost = ""; // Personal EC2
// const serverHost = ""; // Sinor EC2
const serverHost = "localhost";

const connectionHeaders = {
  login: "server",
  passcode: "verysecret",
};

let status = 0;
const client = new Client({
  brokerURL: `ws://${serverHost}:15674/ws`,
  connectHeaders: connectionHeaders,
  onConnect: () => {
    client.subscribe(`/exchange/vote.client/1.#`, (message) => {
      console.log(`header: ${message.headers["method"]}`);
      console.log(`body: ${message.body}`);
    });
  },
});
client.activate();

// /exchange, /topic, /queue, /amq/queue, /reply-queue/, /temp-queue
