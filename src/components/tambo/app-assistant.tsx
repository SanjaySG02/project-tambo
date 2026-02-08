"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { useTamboClient, useTamboThread, useTamboThreadList } from "@tambo-ai/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  MessageInput,
  MessageInputTextarea,
  MessageInputToolbar,
  MessageInputSubmitButton,
  MessageInputError,
  MessageInputFileButton,
  MessageInputMcpPromptButton,
  MessageInputMcpResourceButton,
} from "@/components/tambo/message-input";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { MessageGenerationStage } from "@/components/tambo/message-generation-stage";

export const AppAssistant = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const isMac =
      typeof navigator !== "undefined" && navigator.platform.startsWith("Mac");
    const { thread, startNewThread } = useTamboThread();
    const { data: threads } = useTamboThreadList();
    const client = useTamboClient();
    const { user } = useAuth();
    const clearedRef = React.useRef(false);

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        const isModifierPressed = e.metaKey || e.ctrlKey;
        if (e.key.toLowerCase() === "k" && isModifierPressed) {
          e.preventDefault();
          setOpen((current) => !current);
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);

    React.useEffect(() => {
      const handleOpen = () => setOpen(true);
      window.addEventListener("tambo:open-assistant", handleOpen);
      return () => window.removeEventListener("tambo:open-assistant", handleOpen);
    }, []);

    const clearAllChats = React.useCallback(async () => {
      const items = threads?.items ?? [];
      if (items.length === 0) return;
      await Promise.allSettled(
        items.map((item) => client.beta.threads.delete(item.id)),
      );
    }, [threads, client]);

    const handleNewChat = React.useCallback(async () => {
      await clearAllChats();
      await startNewThread();
    }, [clearAllChats, startNewThread]);

    React.useEffect(() => {
      if (!open) return;
      if (clearedRef.current) return;
      const scopeKey = `${user?.role ?? "guest"}:${user?.unit ?? "none"}`;
      const storageKey = `tambo.chats.cleared.${scopeKey}`;
      if (typeof window !== "undefined" && window.sessionStorage.getItem(storageKey)) {
        clearedRef.current = true;
        return;
      }
      clearedRef.current = true;
      void (async () => {
        await clearAllChats();
        await startNewThread();
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(storageKey, "true");
        }
      })();
    }, [open, user, clearAllChats, startNewThread]);

    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="fixed bottom-6 right-6 z-40 bg-cyan-400 text-black border border-cyan-200 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_0_18px_rgba(34,211,238,0.6)] hover:bg-cyan-300 transition-colors">
            AI Assistant (
            <span suppressHydrationWarning>
              {isMac ? "⌘" : "Ctrl"}+K
            </span>
            )
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 z-40" />
          <Dialog.Content
            ref={ref}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 dark -translate-x-1/2 -translate-y-1/2",
              "w-[min(1400px,96vw)] h-[min(92vh,920px)] rounded-2xl",
              "bg-gradient-to-br from-slate-950 via-slate-900 to-black border-0 shadow-none outline-none text-foreground",
              className,
            )}
            {...props}
          >
            <Dialog.Title className="sr-only">AI Assistant</Dialog.Title>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <div className="text-sm font-semibold text-white">AI Assistant</div>
                  <div className="text-xs text-cyan-200/80">
                    Ask in plain English. Responses use only on-site snapshot data.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageGenerationStage className="text-white/70" showLabel />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-5 py-4">
                  {thread?.messages?.length > 0 ? (
                    <ScrollableMessageContainer className="flex-1 bg-transparent p-2 pb-10">
                      <ThreadContent className="space-y-4">
                        <ThreadContentMessages />
                      </ThreadContent>
                    </ScrollableMessageContainer>
                  ) : (
                    <div className="flex h-full items-center">
                      <div className="w-full rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-cyan-100/80">
                        Start with a question. I will respond with a concise analysis report using on-site data only.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur px-5 py-2">
                <div className="mx-auto w-full max-w-6xl">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-1">
                    <MessageInput>
                      <MessageInputTextarea
                        placeholder="Type any request (e.g. 'Give me an analysis report for my unit')"
                        className="min-h-[22px]"
                      />
                      <MessageInputToolbar>
                        <MessageInputFileButton />
                        <MessageInputMcpPromptButton />
                        <MessageInputMcpResourceButton />
                        <MessageInputSubmitButton />
                      </MessageInputToolbar>
                      <MessageInputError />
                    </MessageInput>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);
AppAssistant.displayName = "AppAssistant";
