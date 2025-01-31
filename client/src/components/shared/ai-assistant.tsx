import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { Bot, X, Minimize2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from 'wouter';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [location] = useLocation();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: location, // Send current page context
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed left-6 bottom-6 z-50"
      >
        <Button
          size="icon"
          className="w-12 h-12 rounded-full bg-primary shadow-lg hover:shadow-xl"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed z-50"
            style={{ 
              left: '24px',
              bottom: '80px',
              display: isMinimized ? 'none' : 'block'
            }}
          >
            <Draggable handle=".drag-handle">
              <Card className="w-[400px] shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between drag-handle cursor-move">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">AI Assistant</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsMinimized(true)}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </form>
              </Card>
            </Draggable>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Chat Button */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-24 bottom-6 z-50"
          >
            <Button
              className="shadow-lg hover:shadow-xl"
              onClick={() => setIsMinimized(false)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Continue Chat
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
