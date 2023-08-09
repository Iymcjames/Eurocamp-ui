import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/error-page";
import Bookings from "./pages/bookings";
import Users from "./pages/users";
import Parcs from "./pages/parcs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Users />,
    errorElement: <ErrorPage />,
  },
  {
    path: "users/",
    element: <Users />,
  },
  {
    path: "bookings/",
    element: <Bookings />,
    errorElement: <ErrorPage />,
  },
  {
    path: "parcs/",
    element: <Parcs />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
