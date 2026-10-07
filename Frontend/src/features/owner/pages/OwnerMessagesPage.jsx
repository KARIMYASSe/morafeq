import { ConversationList } from "../../chat/components/ConversationList";
import { ChatWindow } from "../../chat/components/ChatWindow";
import { useChatPage } from "../../chat/hooks/useChatPage";

export function OwnerMessagesPage() {
  const {
    user,
    conversations,
    selectedConversation,
    selectedConversationId,
    messages,
    content,
    isConnected,
    socketError,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    error,
    setContent,
    selectConversation,
    submitMessage,
  } = useChatPage();

  return (
    <div className="h-[calc(100dvh-152px)] min-h-[520px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl lg:h-[calc(100vh-116px)]">
      <div className="grid h-full w-full min-w-0 grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className={selectedConversationId ? "hidden h-full lg:block" : "h-full min-h-0"}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            isLoading={isLoadingConversations}
            onSelectConversation={selectConversation}
          />
        </div>

        <div className={!selectedConversationId ? "hidden h-full lg:block" : "h-full min-h-0"}>
          <ChatWindow
            selectedConversation={selectedConversation}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            currentUserId={user?.id}
            isConnected={isConnected}
            content={content}
            error={error}
            socketError={socketError}
            isSending={isSending}
            onContentChange={setContent}
            onSendMessage={submitMessage}
            onBack={() => selectConversation(null)}
          />
        </div>
      </div>
    </div>
  );
}
