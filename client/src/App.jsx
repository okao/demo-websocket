import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import useWebSocket, { ReadyState } from "react-use-websocket";
import WebSocket from "ws";
import viteLogo from "/vite.svg";
import "./App.css";

const user = {
  username: "testUser",
  name: "Test User",
  id: 1,
  password: "test",
};

const secret = "secret";

function App() {
  const [count, setCount] = useState(0);
  const WS_URL = "ws://localhost:3132/ws";
  //using secret generate token
  const token =
    "Bearer " +
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwibmFtZSI6IlRlc3QgVXNlciIsImlkIjoxLCJpYXQiOjE3MDA3Mzg3NDIsImV4cCI6MTcwMDc0MjM0Mn0.8mWS9WxBZ4SISy0WO4ElqhgFjuglZhXrkTuuuEAKQ_8";

  const headers = {
    Authorization: token,
  };

  //after connection is established send auth message

  // const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
  //   share: true,
  //   shouldReconnect: (closeEvent) => {
  //     console.log("shouldReconnect", closeEvent);
  //     return true;
  //   },
  //   reconnectAttempts: 2,
  //   reconnectInterval: 3000,
  //   onOpen: (event) => {
  //     console.log("onOpen", event);
  //     sendMessage(
  //       JSON.stringify({
  //         type: "auth",
  //         payload: {
  //           token: token,
  //         },
  //       })
  //     );
  //   },
  // });

  function connect() {
    const { readyState, sendMessage, lastMessage } = useWebSocket(WS_URL, {
      share: true,
      shouldReconnect: (closeEvent) => {
        console.log("shouldReconnect", closeEvent);
        return true;
      },
      reconnectAttempts: 2,
      reconnectInterval: 3000,
      onOpen: (event) => {
        console.log("onOpen", event);
        sendMessage(
          JSON.stringify({
            type: "auth",
            payload: {
              token: token,
            },
          })
        );
      },
    });
    console.log("readyState", readyState);
    console.log("lastMessage", lastMessage);
  }

  connect();

  useEffect(() => {
    // document.title = `You clicked ${count} times`;
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
