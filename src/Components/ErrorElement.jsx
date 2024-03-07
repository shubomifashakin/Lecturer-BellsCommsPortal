import { useNavigate, useRouteError } from "react-router";

import { Button } from "./Button";

function ErrorElement() {
  const { code, details, message, hint } = useRouteError();

  const navigate = useNavigate();

  function tryAgain() {
    navigate("/");
  }

  return (
    <div className="absolute left-1/2 top-1/2 flex min-w-64 max-w-72  -translate-x-1/2 -translate-y-1/2 transform flex-col space-y-2.5 rounded-sm bg-white p-4">
      <h2 className="text-2xl font-bold">Error</h2>

      <p className="text-sm">
        {code && code + ":"}

        {message || details}
      </p>

      {hint ? <p className="text-xs">{hint}</p> : null}

      <Button label={"Try Again"} type="full" action={tryAgain} />
    </div>
  );
}

export default ErrorElement;
