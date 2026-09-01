import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Handshake,
  LoaderCircle,
  RefreshCw,
  Rocket,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

const MAX_MESSAGE_LENGTH = 600;
const REQUEST_TIMEOUT_MS = 15_000;
const CV_PATH = "/assets/CV%20Rafie%20Rojagat%20Bachri.pdf";

const createMessageId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createWelcomeMessage = () => ({
  id: "welcome",
  role: "model",
  translationKey: "chatbot.welcome",
  localOnly: true,
});

const actionCatalog = {
  projects: { to: "/projects" },
  about: { to: "/about" },
  workspace: { to: "/workspace" },
  contact: { to: "/contact" },
  cv: { href: CV_PATH, download: true },
};

const getErrorTranslationKey = (code) => {
  if (code === "timeout") return "chatbot.errors.timeout";
  if (code === "rate_limit") return "chatbot.errors.rate_limit";
  if (["invalid_input", "payload_too_large"].includes(code)) return "chatbot.errors.invalid";
  if (code === "service_unavailable") return "chatbot.errors.unavailable";
  return "chatbot.errors.generic";
};

const ChatAction = ({ actionId, onNavigate, t }) => {
  const action = actionCatalog[actionId];
  if (!action) return null;

  const content = (
    <>
      <span>{t(`chatbot.actions.${actionId}`)}</span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </>
  );
  const className = "inline-flex min-h-9 items-center gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:border-primary/45 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:text-blue-300 dark:focus-visible:ring-offset-slate-900";

  if (action.href) {
    return (
      <a href={action.href} download={action.download} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={action.to} onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
};

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const requestRef = useRef(null);
  const mountedRef = useRef(true);

  const suggestions = [
    {
      id: "experience",
      icon: BriefcaseBusiness,
      label: t("chatbot.suggestions.experience.label"),
      prompt: t("chatbot.suggestions.experience.prompt"),
    },
    {
      id: "impact",
      icon: Rocket,
      label: t("chatbot.suggestions.impact.label"),
      prompt: t("chatbot.suggestions.impact.prompt"),
    },
    {
      id: "stack",
      icon: Wrench,
      label: t("chatbot.suggestions.stack.label"),
      prompt: t("chatbot.suggestions.stack.prompt"),
    },
    {
      id: "availability",
      icon: Handshake,
      label: t("chatbot.suggestions.availability.label"),
      prompt: t("chatbot.suggestions.availability.prompt"),
    },
  ];

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [isLoading, isOpen, messages, shouldReduceMotion]);

  const closePanel = () => {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const resetConversation = () => {
    requestRef.current?.abort();
    requestRef.current = null;
    setMessages([createWelcomeMessage()]);
    setInput("");
    setIsLoading(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const processMessage = async (messageText, { appendUser = true } = {}) => {
    const cleanMessage = messageText.trim();
    if (!cleanMessage || isLoading || requestRef.current) return;

    const userMessage = {
      id: createMessageId(),
      role: "user",
      text: cleanMessage,
    };
    const historyForApi = messages
      .filter((message) => !message.localOnly && message.type !== "error" && message.text)
      .slice(-8)
      .map((message) => ({ role: message.role, text: message.text }));

    if (appendUser) setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    requestRef.current = controller;
    let didTimeout = false;
    const timeoutId = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanMessage,
          history: historyForApi,
          locale: i18n.resolvedLanguage?.startsWith("id") ? "id" : "en",
        }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const requestError = new Error("Chat request failed");
        requestError.code = response.status === 429
          ? "rate_limit"
          : data.error?.code || "provider_error";
        throw requestError;
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        const emptyResponseError = new Error("Empty chat response");
        emptyResponseError.code = "provider_error";
        throw emptyResponseError;
      }

      if (!mountedRef.current) return;
      setMessages((current) => [...current, {
        id: createMessageId(),
        role: "model",
        text: data.reply.trim(),
        actions: Array.isArray(data.actions)
          ? data.actions.filter((actionId) => actionCatalog[actionId]).slice(0, 2)
          : [],
      }]);
    } catch (error) {
      if (!mountedRef.current || (error.name === "AbortError" && !didTimeout)) return;

      setMessages((current) => [...current, {
        id: createMessageId(),
        role: "model",
        type: "error",
        translationKey: getErrorTranslationKey(didTimeout ? "timeout" : error.code),
        retryText: cleanMessage,
      }]);
    } finally {
      window.clearTimeout(timeoutId);
      if (mountedRef.current) setIsLoading(false);
      if (requestRef.current === controller) requestRef.current = null;
    }
  };

  const retryMessage = (messageId, messageText) => {
    setMessages((current) => current.filter((message) => message.id !== messageId));
    processMessage(messageText, { appendUser: false });
  };

  const handleSend = (event) => {
    event.preventDefault();
    processMessage(input);
  };

  const panelMotion = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 18, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 14, scale: 0.98 },
      };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={triggerRef}
            type="button"
            aria-label={t("chatbot.open")}
            title={t("chatbot.open")}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:bottom-6 sm:right-6"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          >
            <Bot className="h-6 w-6" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            {...panelMotion}
            role="dialog"
            aria-labelledby="rafie-assistant-title"
            className="fixed inset-x-3 bottom-3 z-[70] flex h-[min(640px,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-darkLight sm:left-auto sm:right-5 sm:w-[390px]"
          >
            <header className="flex shrink-0 items-center gap-3 bg-slate-950 px-4 py-3 text-white dark:bg-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="rafie-assistant-title" className="truncate text-sm font-bold">
                  {t("chatbot.title")}
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                  {t("chatbot.status")}
                </p>
              </div>
              <button
                type="button"
                onClick={resetConversation}
                aria-label={t("chatbot.reset")}
                title={t("chatbot.reset")}
                disabled={messages.length === 1 && !isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={closePanel}
                aria-label={t("chatbot.close")}
                title={t("chatbot.close")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div
              className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950/55"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-busy={isLoading}
            >
              {messages.map((message) => {
                const isUser = message.role === "user";
                const isError = message.type === "error";

                return (
                  <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[88%]">
                      <div
                        className={`whitespace-pre-wrap rounded-lg px-3 py-2.5 text-sm leading-relaxed shadow-sm [overflow-wrap:anywhere] ${
                          isUser
                            ? "bg-primary text-white"
                            : isError
                              ? "border border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/35 dark:text-amber-100"
                              : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {message.translationKey ? t(message.translationKey) : message.text}
                      </div>

                      {isError && (
                        <button
                          type="button"
                          onClick={() => retryMessage(message.id, message.retryText)}
                          disabled={isLoading}
                          className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-100 dark:hover:bg-amber-950/40"
                        >
                          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                          {t("chatbot.retry")}
                        </button>
                      )}

                      {!isError && message.actions?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.actions.map((actionId) => (
                            <ChatAction
                              key={actionId}
                              actionId={actionId}
                              onNavigate={closePanel}
                              t={t}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start" role="status">
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    <span>{t("chatbot.loading")}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-darkLight">
              <p className="mb-2 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                {t("chatbot.quick_ask")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion) => {
                  const SuggestionIcon = suggestion.icon;
                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => processMessage(suggestion.prompt)}
                      disabled={isLoading}
                      className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                    >
                      <SuggestionIcon className="h-3.5 w-3.5 shrink-0 text-primary dark:text-blue-300" aria-hidden="true" />
                      <span className="leading-tight">{suggestion.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSend} className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-darkLight">
              <label htmlFor="rafie-assistant-input" className="sr-only">
                {t("chatbot.input_label")}
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="rafie-assistant-input"
                  type="text"
                  value={input}
                  maxLength={MAX_MESSAGE_LENGTH}
                  autoComplete="off"
                  placeholder={t("chatbot.placeholder")}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label={t("chatbot.send")}
                  title={t("chatbot.send")}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 dark:focus-visible:ring-offset-slate-900"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{t("chatbot.privacy")}</span>
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
