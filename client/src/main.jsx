// React entry point.
// - Wraps the app in Redux Provider, BrowserRouter, ScrollToTop, ToastContainer.
// - Fires the initial /auth/me probe on mount so we know if the user is logged in before routing decisions happen.

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import "./index.css";

import { store } from "./app/store.js";
import { fetchMe } from "./app/features/authSlice.js";
import ScrollToTop from "./components/common/ScrollToTop.jsx";

// Inner component so we can use hooks (useDispatch needs the Provider above)
const AppRoot = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Probe /auth/me once on app load. If the cookie is valid the user
    // gets restored to Redux state instantly; if not, authSlice.loading
    // flips false and protected routes redirect appropriately.
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        theme="dark"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRoot />
    </Provider>
  </React.StrictMode>,
);
