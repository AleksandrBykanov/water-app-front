import { lazy, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import RestrictedRoute from "./components/RestrictedRoute/RestrictedRoute";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRefreshing } from "./redux/auth/selectors.js";
import SharedLayout from "./components/SharedLayout/SharedLayout.jsx";
import { refreshUser } from "./redux/auth/operations.js";
import { getWaterDaily } from "./redux/waters/operations.js";
import { selectActiveDay } from "./redux/waters/selectors.js";

const HomePage = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const TrackerPage = lazy(() => import("./pages/TrackerPage/TrackerPage.jsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage/SignUpPage.jsx"));
const SignInPage = lazy(() => import("./pages/SignInPage/SignInPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);
  const activeDay = useSelector(selectActiveDay);

  useEffect(() => {
    dispatch(refreshUser())
      .unwrap()
      .then(() => {
        dispatch(
          getWaterDaily({
            day: activeDay.day,
            month: activeDay.month,
            year: activeDay.year,
          })
        );
      });
  }, [dispatch, activeDay]);

  return isRefreshing ? (
    <b>Refreshing user...</b>
  ) : (
    <SharedLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <RestrictedRoute component={<SignUpPage />} redirectTo="/tracker" />
          }
        />
        <Route
          path="/signin"
          element={
            <RestrictedRoute component={<SignInPage />} redirectTo="/tracker" />
          }
        />
        <Route
          path="/tracker"
          element={
            <PrivateRoute component={<TrackerPage />} redirectTo="/signin" />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SharedLayout>
  );
}

export default App;
