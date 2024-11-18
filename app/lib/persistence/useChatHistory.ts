import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { atom } from 'nanostores';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import { workbenchStore } from '~/lib/stores/workbench';
import { getNextId, getUrlId, openDatabase, setMessages } from './db';
import { API_BASE_URL } from '~/config';
import useUser from '~/types/user';

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

const persistenceEnabled = !import.meta.env.VITE_DISABLE_PERSISTENCE;

export const db = persistenceEnabled ? await openDatabase() : undefined;

export const chatId = atom<string | undefined>(undefined);
export const description = atom<string | undefined>(undefined);

export function useChatHistory() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { id: mixedId } = useLoaderData<{ id?: string }>();
  const { getStoredToken } = useUser();
  const token = getStoredToken()
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [urlId, setUrlId] = useState<string | undefined>();

  const getMessages = async(token:string, urlId: string): Promise<ChatHistoryItem | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/content-by-urlid?urlId=${urlId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
  
      const data: ChatHistoryItem[] = await response.json();
      console.log('Result Data:', data);
      
      // Return null if the array is empty
      if (!data || data.length === 0) {
        return null;
      }
      
      // Return the first item
      return data[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch messages: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching messages');
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      // if (!db) {
      //   setReady(true);
      //   if (persistenceEnabled) {
      //     toast.error(`Chat persistence is unavailable`);
      //   }
      //   return;
      // }

      if (mixedId && token) {
        try {
          const storedMessages = await getMessages(token, mixedId);
          if (storedMessages && storedMessages.messages.length > 0) {
            setInitialMessages(storedMessages.messages);
            setUrlId(storedMessages.urlId);
            description.set(storedMessages.description);
            chatId.set(storedMessages.id);
          } else {
            navigate(`/`, { replace: true });
          }
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('Failed to fetch messages');
          }
        } finally {
          setReady(true);
        }
      }
    };

    fetchMessages();
  }, [mixedId, navigate, token]);

  return {
    ready: !mixedId || ready,
    initialMessages,
    storeMessageHistory: async (messages: Message[]) => {
      if (!db || messages.length === 0) {
        return;
      }

      const { firstArtifact } = workbenchStore;

      if (!urlId && firstArtifact?.id) {
        console.log("firstArtifact:", firstArtifact)
        const urlId = firstArtifact.id+user?.id+firstArtifact.time

        navigateChat(urlId);
        setUrlId(urlId);
      }

      if (!description.get() && firstArtifact?.title) {
        description.set(firstArtifact?.title);
      }

      // if (initialMessages.length === 0 && !chatId.get()) {
      //   const nextId = await getNextId(db);

      //   chatId.set(nextId);

      //   if (!urlId) {
      //     navigateChat(nextId);
      //   }
      // }

      // await setMessages(db, chatId.get() as string, messages, urlId, description.get());
    },
  };
}

function navigateChat(nextId: string) {
  const url = new URL(window.location.href);
  url.pathname = `/chat/${nextId}`;
  window.history.replaceState({}, '', url);
}