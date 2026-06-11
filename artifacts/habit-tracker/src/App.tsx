import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import RoutineDetail from "@/pages/RoutineDetail";
import Achievement from "@/pages/Achievement";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { BottomNav } from "@/components/BottomNav";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/achievement" component={Achievement} />
        <Route path="/settings" component={Settings} />
        <Route path="/routine/:id" component={RoutineDetail} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
