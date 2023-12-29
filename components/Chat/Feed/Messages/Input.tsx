import { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageWithLoading } from 'lib/types';
import { useMutation } from '@apollo/client';
import MessageOperations from 'graphql/operations/message';
import { nanoid } from 'nanoid';
import { useConversations } from '@/lib/useConversations';
import { Input } from '@/components/ui/input';
import EmojiPicker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function MessageInput({ session, conversationId }: { session: Session; conversationId: string }) {
  const { resolvedTheme: theme } = useTheme();
  const [body, setBody] = useState('');
  const [validate, setValidate] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const {
    messagesActions: { addMessage, editMessage },
  } = useConversations();
  const [sendMessage] = useMutation<{ sendMessage: boolean }, { id: string; conversationId: string; senderId: string; body: string }>(
    MessageOperations.Mutation.sendMessage,
    {
      onError: (err) => {
        console.log(err);
        toast.error(err.message);
      },
    },
  );

  async function onSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate) return;

    try {
      const convId = conversationId;
      const messageId = nanoid();
      const message: MessageWithLoading = {
        id: messageId,
        sender: {
          id: session.user.id,
          username: session.user.username,
          image: session.user.image as string | undefined,
        },
        conversationId: convId,
        body,
        // seenByIds: [session.user.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        loading: true,
      };
      addMessage(convId, message);
      setBody('');
      sendMessage({
        variables: { id: messageId, body, conversationId: convId, senderId: session.user.id },
      }).then((r) => {
        const success = r.data?.sendMessage;
        if (!success) {
          editMessage(convId, messageId, { ...message, failed: true, loading: false });
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('onSendMessage ERROR', error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    setValidate(!!body.match(/^.*\S.*$/gm));
  }, [body]);

  return (
    <div className="w-full px-4 py-6">
      <form onSubmit={onSendMessage} className="flex flex-row items-center">
        <Popover open={emojiOpen} onOpenChange={(e) => setEmojiOpen(e)}>
          <PopoverTrigger asChild>
            <div className="z-50 -mr-9 ml-4 cursor-pointer text-xl text-primary/80 transition-colors hover:text-primary">
              <i className="fas fa-smile" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="h-[435px] w-[352px] border-0 bg-transparent p-0 shadow">
            <EmojiPicker
              data={data}
              onEmojiSelect={(e: { native: string }) => {
                setBody((prev) => prev + e.native);
                document.getElementById('chat-input')?.focus();
                setEmojiOpen(true);
              }}
              theme={theme}
            />
          </PopoverContent>
        </Popover>
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="focus:border-gray-7 py-5 pl-12 pr-4 text-lg transition focus:shadow-none md:text-base"
          placeholder="New message"
          autoComplete="off"
          id="chat-input"
        />
        <button type="submit" className="absolute right-0 mr-8 text-primary transition disabled:text-primary/70" disabled={!validate}>
          <i className="fas fa-paper-plane text-lg" />
        </button>
      </form>
    </div>
  );
}
