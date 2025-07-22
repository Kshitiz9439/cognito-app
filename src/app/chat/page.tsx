'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, User, Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
  prompt: z.string().min(1, 'Please enter a message.'),
});

type FormValues = z.infer<typeof FormSchema>;

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  isLoading?: boolean;
}

const suggestions = [
  "Summarize a document",
  "Tell me a joke",
  "Explain a concept",
  "Help me write a poem",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('prompt', suggestion);
    form.handleSubmit(onSubmit)();
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    const userMessage = data.prompt;
    const userMessageId = Date.now();
    const botMessageId = userMessageId + 1;
    
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: 'user', text: userMessage },
      { id: botMessageId, role: 'bot', text: '', isLoading: true },
    ]);
    form.reset();

    try {
      const res = await fetch('/api/genkit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!res.ok) throw new Error('Failed to fetch AI response');

      const result = await res.json();

      if (result.response) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: result.response, isLoading: false } : msg
          )
        );
      } else {
        throw new Error('The AI returned an empty response.');
      }
    } catch (error) {
      console.error('Failed to get response from AI:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: `Failed to get a response from the AI. Please try again.`,
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== botMessageId));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl h-full flex flex-col">
          {messages.length === 0 && !isSubmitting ? (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="mb-4 rounded-full border p-4 bg-primary/10 border-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800">Ask Cognito Anything</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Your intelligent assistant for chat, summarization, and creative writing.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    className="bg-white/50 border-gray-200 hover:bg-white"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4 animate-fade-in",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'bot' && (
                    <Avatar className="h-9 w-9 shadow-sm">
                      <AvatarFallback className="bg-primary/20"><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "rounded-2xl p-4 shadow-md max-w-lg",
                    message.role === 'user'
                      ? 'bg-slate-800 text-white rounded-br-none'
                      : 'bg-white text-slate-800 rounded-bl-none'
                  )}>
                    {message.isLoading ? (
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Cognito is thinking...</p>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce"></span>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9 shadow-sm">
                      <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>
      <footer className="p-4 bg-background/80 backdrop-blur-sm border-t border-gray-200">
        <div className="mx-auto max-w-3xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Message Cognito..."
                          className="min-h-[52px] resize-none rounded-2xl border-gray-200 bg-white p-4 pr-16 shadow-sm focus:border-primary focus:ring-primary"
                          {...field}
                          disabled={isSubmitting}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (!isSubmitting && form.getValues('prompt')) {
                                form.handleSubmit(onSubmit)();
                              }
                            }
                          }}
                        />
                        <Button 
                          type="submit" 
                          size="icon" 
                          className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-110 hover:bg-primary/90" 
                          disabled={isSubmitting || !form.getValues('prompt')}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="pl-4" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </footer>
    </div>
  );
}
