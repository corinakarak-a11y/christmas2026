import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Snowfall } from "@/components/advent/Snowfall";
import { Lock } from "@/components/advent/Lock";
import { GATE_KEY, PASSWORD } from "@/lib/advent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Day Closer to Christmas" },
      { name: "description", content: "A little locked advent calendar, just for you." },
      { property: "og:title", content: "A Day Closer to Christmas" },
      { property: "og:description", content: "A little locked advent calendar, just for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gate,
});

function Gate() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "open">("idle");
  const [leaving, setLeaving] = useState(false);
  const [hint, setHint] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "open") return;

    const guess = pw.trim().toLowerCase().replace(/\s+/g, " ");
    const compact = guess.replace(/\s+/g, "");

    if (compact === "ilovemylittlenerd") {
      setState("open");
      setHint("There you are. ♥");
      sessionStorage.setItem(GATE_KEY, "1");
      setTimeout(() => setLeaving(true), 1000);
      setTimeout(() => navigate({ to: "/calendar" }), 1800);
      return;
    }

    let nextHint = "Not quite. But every little word matters.";
    if (guess === "nerd" || (guess.includes("nerd") && !guess.includes("little") && !guess.includes("my"))) {
      nextHint = "You got the word! Now, what else does she call you with it?";
    } else if (guess.includes("my") && guess.includes("nerd") && !guess.includes("little")) {
      nextHint = "Ah, the possessive part! There's another little word tucked in there, too.";
    } else if (guess.includes("little") && guess.includes("nerd") && !guess.includes("my")) {
      nextHint = "You've got the little part! Now make it a little more possessive.";
    } else if (guess.includes("my") && guess.includes("little") && guess.includes("nerd") && !guess.includes("love")) {
      nextHint = "Almost! What does she feel for you? That feeling belongs at the very beginning.";
    } else if (guess.includes("love") && guess.includes("nerd") && !guess.includes("little")) {
      nextHint = "You're getting there! The nickname needs to be a little smaller, and a little more possessive.";
    } else if (guess.includes("love") && guess.includes("my") && guess.includes("little") && guess.includes("nerd")) {
      nextHint = "All the words are there. Join them together, without spaces.";
    }

    setHint(nextHint);
    setState("wrong");
    setTimeout(() => setState("idle"), 450);
  };
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-midnight">
      <div className="grain" />
      <Snowfall />
      <div className="vignette" />
      <div className={`relative z-10 flex w-full max-w-md flex-col items-center gap-10 px-6 transition-all duration-700 ${leaving ? "scale-110 opacity-0 blur-sm" : ""}`}>
        <div className="animate-rise-in flex flex-col items-center gap-10 w-full" style={{ animationDelay: "2.3s" }}>
          <Lock state={state} />
          <p className="font-ui text-sm italic text-snow/75 text-center -mt-6 min-h-10" aria-live="polite">{hint}</p>
          <form onSubmit={submit} className={`flex w-full items-center rounded-full bg-parchment p-1.5 pl-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ${state === "wrong" ? "animate-shake" : ""}`}>
            <div className="relative min-w-0 flex-1">
              <input
                type="text" autoComplete="off" autoCapitalize="none" spellCheck={false} aria-label="Password"
                value={pw} onChange={(e) => setPw(e.target.value)}
                className="w-full bg-transparent font-ui text-lg tracking-[0.3em] text-transparent caret-midnight outline-hidden"
              />
              <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-nowrap font-ui text-lg tracking-[0.3em] text-midnight">
                {"★".repeat(pw.length)}
              </span>
            </div>
            <button type="submit" className="shrink-0 rounded-full bg-midnight px-5 py-2.5 font-display text-lg font-semibold uppercase tracking-widest text-snow transition hover:brightness-125 active:scale-95">
              Unlock
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
