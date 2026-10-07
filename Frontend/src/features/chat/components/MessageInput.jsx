export function MessageInput({
  content,
  error,
  socketError,
  isConnected,
  isSending,
  onContentChange,
  onSendMessage,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white p-3 sm:p-4">
      {(error || socketError) && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 text-xs font-bold text-red-600 sm:text-sm">
          {error || socketError}
        </p>
      )}

      <div className="flex items-end gap-2 sm:gap-3">
        <textarea
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          rows={1}
          maxLength={2000}
          placeholder="اكتب رسالتك هنا..."
          className="min-h-[48px] min-w-0 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-3 text-base outline-none focus:border-blue-600 disabled:bg-slate-100 sm:min-h-[52px] sm:px-4"
        />

        <button
          type="button"
          onClick={onSendMessage}
          disabled={isSending || !content.trim()}
          className="min-h-[48px] shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:px-6 sm:text-base"
        >
          {isSending ? "..." : "إرسال"}
        </button>
      </div>

      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="max-w-[80%] text-[10px] leading-4 text-slate-400 sm:text-xs">
          يتم إخفاء أرقام الهاتف تلقائيًا لحماية المستخدمين.
        </p>
        <p className="shrink-0 text-[10px] text-slate-400 sm:text-xs">{content.length}/2000</p>
      </div>
    </footer>
  );
}
