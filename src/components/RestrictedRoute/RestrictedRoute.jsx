import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsSignedIn } from "../../redux/auth/selectors.js";

export default function RestrictedRoute({ component, redirectTo }) {
  const IsSignedIn = useSelector(selectIsSignedIn);

  return IsSignedIn ? <Navigate to={redirectTo} /> : component;
}
