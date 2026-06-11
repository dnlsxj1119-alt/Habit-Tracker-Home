import { Link, useRoute } from "wouter";
import { Home, CalendarDays, Settings } from "lucide-react";

export function BottomNav() {
  const [isHome] = useRoute("/");
  const [isAchievement] = useRoute("/achievement");
  const [isSettings] = useRoute("/settings");

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/90 backdrop-blur-xl border-t border-border/40 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-4">
        <Link href="/">
          <div className={`cursor-pointer flex flex-col items-center justify-center w-16 h-full transition-colors ${isHome ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">홈</span>
          </div>
        </Link>
        <Link href="/achievement">
          <div className={`cursor-pointer flex flex-col items-center justify-center w-16 h-full transition-colors ${isAchievement ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <CalendarDays className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">달성률</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className={`cursor-pointer flex flex-col items-center justify-center w-16 h-full transition-colors ${isSettings ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">설정</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
