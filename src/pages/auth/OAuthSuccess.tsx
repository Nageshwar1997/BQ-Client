import { useEffect, useState } from "react";
import usePathParams from "../../hooks/usePathParams";
import useQueryParams from "../../hooks/useQueryParams";
import { saveLocalToken } from "../../utils";
import ShowApiStatus from "../../components/api-status/ShowApiStatus";
import { Link } from "react-router-dom";
import { useAuthCheck } from "../../hooks/useAuthCheck";

export default function OAuthSuccess() {
  const { navigate } = usePathParams();
  const { queryParams } = useQueryParams();
  const [readyToCall, setReadyToCall] = useState(false);

  const { user, isLoading, isError } = useAuthCheck(readyToCall);

  useEffect(() => {
    if (!queryParams.token) {
      navigate("/login");
      return;
    }

    saveLocalToken(queryParams.token);
    setReadyToCall(true);
  }, [queryParams.token, navigate]);

  useEffect(() => {
    if (user) {
      setTimeout(() => navigate("/account"), 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const showInitialLoading = !readyToCall || isLoading;

  return (
    <div className="h-dvh flex items-center justify-center">
      <ShowApiStatus
        headingText={
          showInitialLoading
            ? "Logging in..."
            : isError
            ? "Login failed..."
            : user
            ? "Login successful!"
            : ""
        }
        descriptionText={
          showInitialLoading ? (
            "Please wait while we complete your login process."
          ) : isError ? (
            <>
              There was a problem signing you in. Please{" "}
              <Link
                to="/login"
                className="bg-clip-text bg-accent-duo text-transparent"
              >
                Try again
              </Link>
              .
            </>
          ) : user ? (
            "Redirecting you to your dashboard…"
          ) : (
            ""
          )
        }
        type={showInitialLoading ? "empty" : isError ? "error" : "empty"}
      />
    </div>
  );
}
