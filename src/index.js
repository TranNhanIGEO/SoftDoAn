import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configStore, persistor } from './redux/configStore';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={configStore}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
