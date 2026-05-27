"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SUGGESTED_QUESTIONS, answerFor } from "@/lib/data";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";
interface Msg {
  id: string;
  role: Role;
  text: string;
}

const INTRO: Msg = {
  id: "intro",
  role: "assistant",
  text: "Hi — I'm the Synergy Engine assistant. Ask me anything about your fund's portfolio, or try one of the suggested questions below.",
};

export function ChatDrawer() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const endRef = useRef<HTMLDivElement>(null);

  // Allow ?chat=open in URL to auto-open the drawer (used for screenshots/demos)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("chat") === "open") setOpen(true);
    if (params.get("chat") === "answered") {
      const q = "Which portco has the highest concentration risk?";
      setOpen(true);
      setMessages([
        INTRO,
        { id: "u-demo", role: "user", text: q },
        { id: "a-demo", role: "assistant", text: answerFor(q) },
      ]);
    }
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() =>
        endRef.current?.scrollIntoView({ behavior: "smooth" })
      );
    }
  }, [open, messages.length]);

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text: q };
    const reply: Msg = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: answerFor(q),
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        aria-label="Open assistant"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-slate-800 transition",
          open && "opacity-0 pointer-events-none"
        )}
      >
        <MessageSquare className="h-4 w-4" />
        Ask Synergy
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="p-0 flex flex-col w-full sm:max-w-md"
        >
          <SheetHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <SheetTitle>Synergy Assistant</SheetTitle>
                <div className="text-[11px] text-slate-500">
                  Portfolio intelligence · Fund III
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
            {messages.map((m) => (
              <Bubble key={m.id} msg={m} />
            ))}

            {messages.length === 1 && (
              <div className="pt-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                  Suggested
                </div>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-left text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 hover:border-emerald-300 hover:bg-emerald-50 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-slate-200 bg-white p-3 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about risks, cross-sell, or vendors…"
              className="flex-1 h-10 rounded-md border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300"
            />
            <Button
              type="submit"
              variant="primary"
              size="icon"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-slate-900 text-white rounded-br-sm"
            : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
        )}
      >
        {msg.text}
      </div>
    </div>
  );
}
