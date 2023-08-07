import { createContext, useContext } from 'react';
import { Conversation } from './types';
import { Actions, Items, useMap } from './util';

const ConversationsContext = createContext<{ conversations: Items<string, Conversation>; actions: Actions<string, Conversation> }>({
  conversations: new Map<string, Conversation>(),
  actions: {
    remove: () => {},
    reset: () => {},
    set: () => {},
    setAll: () => {},
  },
});

export const useConversations = () => useContext(ConversationsContext);

export function ConversationsProvider({ children }: React.PropsWithChildren) {
  const [conversations, actions] = useMap<string, Conversation>();
  return <ConversationsContext.Provider value={{ conversations, actions }}>{children}</ConversationsContext.Provider>;
}
