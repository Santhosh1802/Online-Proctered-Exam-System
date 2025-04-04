import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
