// ChatMessage.tsx
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formatDeals = (deals: any[]) => {
    return deals.map((deal: any, index: number) => (
      <div key={index} className="mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="font-medium mb-1">📈 {deal.dealname || 'Unnamed Deal'}</div>
        <div>💰 Amount: ${parseFloat(deal.amount || '0').toLocaleString()}</div>
        <div>📊 Stage: {deal.dealstage || 'Not set'}</div>
        {deal.closedate && (
          <div>📅 Close Date: {new Date(deal.closedate).toLocaleDateString()}</div>
        )}
      </div>
    ));
  };

  const formatChannels = (channels: any[]) => {
    return channels.map((channel: any, index: number) => (
      <div key={index} className="mb-2">
        <div className="font-medium">#{channel.name}</div>
        {channel.purpose?.value && (
          <div className="text-muted-foreground ml-4">{channel.purpose.value}</div>
        )}
      </div>
    ));
  };

  const renderStructuredData = (queryResult: any) => {
    if (!queryResult?.extracted_data) return null;

    // Find the first data block that contains structured data
    const dataBlock = Object.values(queryResult.extracted_data).find((block: any) => 
      block?.data && block?.data_type
    ) as any;

    if (!dataBlock?.data) return null;

    const dataType = dataBlock.data_type?.toLowerCase() || '';
    const items = Array.isArray(dataBlock.data) ? dataBlock.data : [dataBlock.data];

    if (dataType.includes('deal')) {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-3">HubSpot Deals Found:</h3>
          {formatDeals(items)}
        </div>
      );
    }
    
    if (dataType.includes('channel')) {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-3">Slack Channels:</h3>
          {formatChannels(items)}
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (isUser) {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }

    // Try to render structured data first
    const structuredContent = message.queryResult && renderStructuredData(message.queryResult);
    if (structuredContent) {
      return structuredContent;
    }

    // Fallback to markdown rendering for other content
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert [&_pre]:bg-muted/50 [&_pre]:border [&_pre]:border-border [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-foreground [&_p]:text-card-foreground [&_h1]:text-card-foreground [&_h2]:text-card-foreground [&_h3]:text-card-foreground [&_h4]:text-card-foreground [&_ul]:text-card-foreground [&_ol]:text-card-foreground [&_blockquote]:text-card-foreground [&_blockquote]:border-l-primary [&_strong]:text-card-foreground [&_strong]:font-semibold">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={cn("flex gap-3 mb-6 animate-fade-in", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "gradient-primary" : "bg-card"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-foreground" />
        )}
      </div>
      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        <div
          className={cn(
            "px-4 py-3 rounded-lg",
            isUser
              ? "gradient-primary text-white"
              : "bg-card border border-border text-card-foreground"
          )}
        >
          {renderContent()}
        </div>
        <span className="text-xs text-muted-foreground px-2">{timestamp}</span>
      </div>
    </div>
  );
}