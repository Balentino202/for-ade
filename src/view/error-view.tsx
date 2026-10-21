import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/route-constant";
import { Link, useRouteError } from "react-router";

// App-wide error boundary via the root route's `errorElement`.
const ErrorView = () => {
  const error = useRouteError();
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Something went wrong.";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-semibold">
          Oops, a little hiccup
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {message}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="glass" onClick={() => window.location.reload()}>
          Reload
        </Button>
        <Button asChild>
          <Link to={RouteConstant.app.home}>Back to the start</Link>
        </Button>
      </div>
    </main>
  );
};

export default ErrorView;
