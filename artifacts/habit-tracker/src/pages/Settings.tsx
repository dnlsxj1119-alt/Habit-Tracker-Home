import { useSettings, ThemeColor } from "@/hooks/useSettings";

const THEME_OPTIONS: { id: ThemeColor; label: string; colorClass: string }[] = [
  { id: "blue", label: "파랑", colorClass: "bg-blue-500" },
  { id: "green", label: "초록", colorClass: "bg-green-500" },
  { id: "purple", label: "보라", colorClass: "bg-purple-500" },
  { id: "pink", label: "핑크", colorClass: "bg-pink-500" },
  { id: "orange", label: "주황", colorClass: "bg-orange-500" },
];

export default function Settings() {
  const { settings, updateTheme } = useSettings();

  return (
    <div className="min-h-[100dvh] bg-background w-full max-w-[430px] mx-auto shadow-2xl relative pb-20 font-sans">
      <header className="px-6 pt-12 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-10 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">설정</h1>
      </header>

      <main className="px-6 py-6 space-y-8">
        <section>
          <h2 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">캘린더 테마 색상</h2>
          <div className="bg-card rounded-2xl border border-border p-2">
            {THEME_OPTIONS.map(theme => (
              <button
                key={theme.id}
                onClick={() => updateTheme(theme.id)}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${theme.colorClass} shadow-sm`} />
                  <span className="font-semibold text-[15px]">{theme.label}</span>
                </div>
                {settings.themeColor === theme.id && (
                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
