import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

function BackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ChatWindow({
  selectedConversation,
  messages,
  isLoadingMessages,
  currentUserId,
  isConnected,
  content,
  error,
  socketError,
  isSending,
  onContentChange,
  onSendMessage,
  onBack,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, selectedConversation?.id]);

  if (!selectedConversation) {
    return (
      <main dir="rtl" className="hidden min-h-0 flex-col lg:flex">
        <div className="flex h-full items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-xl font-black text-slate-800">اختر محادثة</h2>
            <p className="mt-2 text-slate-500">اختر محادثة من القائمة لعرض الرسائل.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
              aria-label="العودة إلى المحادثات"
            >
              <BackIcon />
            </button>
          ) : null}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-black text-slate-900 sm:text-base">
              {selectedConversation.otherUser?.firstName} {selectedConversation.otherUser?.lastName}
            </h2>
            <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
              {selectedConversation.listing?.title}
            </p>
          </div>
        </div>

        <span className={`shrink-0 text-[11px] font-bold sm:text-xs ${isConnected ? "text-green-600" : "text-red-600"}`}>
          {isConnected ? "متصل" : "غير متصل"}
        </span>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-5">
        {isLoadingMessages ? (
          <p className="text-center text-slate-500">جاري تحميل الرسائل...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-500">لا توجد رسائل في هذه المحادثة.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </section>

      <MessageInput
        content={content}
        error={error}
        socketError={socketError}
        isConnected={isConnected}
        isSending={isSending}
        onContentChange={onContentChange}
        onSendMessage={onSendMessage}
      />
    </main>
  );
}
