import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/route-constant";
import { HeartIcon } from "lucide-react";
import { Link } from "react-router";

const NotFoundView = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <HeartIcon className="size-8 text-lilac" aria-hidden />
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-semibold">
          This page wandered off
        </h1>
        <p className="text-muted-foreground">
          The surprise lives on the main page.
        </p>
      </div>
      <Button asChild size="lg">
        <Link to={RouteConstant.app.home}>Take me there</Link>
      </Button>
    </main>
  );
};

export default NotFoundView;
