"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetApartmentMessagesQuery } from "@/lib/redux/features/chat/chatApiSlice";
import { useGetUserQuery } from "@/lib/redux/features/auth/authApiSlice";
import { ApartmentMessage } from "@/types";
import { useTheme } from "next-themes";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Spinner from "@/components/shared/Spinner";
import { Button } from "../ui/button";

import { MessageCircleMore, X } from "lucide-react";

interface ChatWindowProps {
  apartmentId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ apartmentId }) => {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetApartmentMessagesQuery({
    apartment_uuid: apartmentId,
    page,
  });

  const { data: userData } = useGetUserQuery();
  const userId = userData?.id;

  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ApartmentMessage[]>([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (data) {
      setMessages((prevMessages) => {
        const newMessages = [...data.results].slice().reverse();
        const allMessages = [...newMessages, ...prevMessages];
        return allMessages;
      });
    }
  }, [data]);

  useEffect(() => {
    if (!userId) return;

    // if (socket && socket.readyState === WebSocket.OPEN) {
    //   socket.close();
    // }

    const ws = new WebSocket(
      `ws://localhost:8080/ws/chat/apartment/${apartmentId}/`,
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const newMessage: ApartmentMessage = {
        uuid: data.uuid,
        sender: {
          uuid: data.sender.uuid,
          username: data.sender.username,
          avatar: data.sender.avatar,
        },
        content: data.content,
        created_at: data.created_at,
        read: data.read,
      };

      setMessages((prevMessages) => {
        const allMessages = [...prevMessages, newMessage];
        return allMessages;
      });
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log("WebSocket closed");
      }
    };
  }, [apartmentId, userId]);

  useEffect(() => {
    if ((isAtBottom && isChatVisible) || messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isAtBottom, isChatVisible]);

  const handleSendMessage = () => {
    if (message && socket) {
      socket.send(JSON.stringify({ message }));
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadMoreMessages = (callback?: () => void) => {
    if (data?.next && !isLoading) {
      setPage((prevPage) => prevPage + 1);
      setTimeout(() => {
        if (callback) callback();
      }, 150);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isAtTop = target.scrollTop === 0;
    setIsAtBottom(
      target.scrollHeight === target.scrollTop + target.clientHeight,
    );

    if (isAtTop) {
      const previousScrollHeight = target.scrollHeight;
      loadMoreMessages(() => {
        requestAnimationFrame(() => {
          target.scrollTop = target.scrollHeight - previousScrollHeight;
        });
      });
    }
  };

  const toggleChatVisibility = () => {
    setIsAtBottom(true);
    setIsChatVisible(!isChatVisible);
  };

  if (isLoading && page === 1) return <Spinner size="xl" />;
  if (isError) return <p>Error loading messages.</p>;

  return (
    <>
      {isChatVisible ? (
        <div className="fixed bottom-4 right-4 w-80 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900">
          <div className="flex justify-between bg-blue-500 p-3 font-semibold text-white">
            <span>Apartment Chat</span>
            <button onClick={toggleChatVisibility}>
              <X className="text-white" />
            </button>
          </div>
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="h-64 overflow-y-auto p-3 dark:bg-slate-800"
          >
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex items-start gap-2 ${
                    msg.sender.uuid === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender.uuid !== userId && (
                    <Avatar>
                      <AvatarImage
                        src={
                          msg.sender.avatar ||
                          (theme === "dark"
                            ? "/assets/icons/user-profile-circle.svg"
                            : "/assets/icons/user-profile-light-circle.svg")
                        }
                        alt="User avatar"
                        width={20}
                        height={20}
                      />
                    </Avatar>
                  )}
                  <div
                    className={`p-2 text-sm ${
                      msg.sender.uuid === userId
                        ? "rounded-lg bg-blue-500 text-white"
                        : "rounded-lg bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    {msg.sender.uuid !== userId ? (
                      <p>@{msg.sender.username}</p>
                    ) : null}
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages yet.</p>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-slate-500 p-3 dark:bg-slate-800">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="w-full rounded-md border p-2 dark:bg-gray-800 dark:text-white"
            />
            <Button className="mt-2 w-full" onClick={handleSendMessage}>
              Send Message
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChatVisibility}
          className="fixed bottom-4 right-4 rounded-full bg-blue-500 p-3 text-white shadow-lg dark:bg-gray-800"
        >
          <MessageCircleMore />
        </button>
      )}
    </>
  );
};

export default ChatWindow;
