'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { creativeWriter } from '@/ai/flows/writer-flow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FormSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
  genre: z.enum(['fantasy', 'sci-fi', 'mystery', 'comedy', 'drama']),
});

type FormValues = z.infer<typeof FormSchema>;

export default function CreativeWriterPage() {
  const [story, setStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      genre: 'fantasy',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    setStory('');

    try {
      const result = await creativeWriter({ topic: data.topic, genre: data.genre });
      if (result.story) {
        setStory(result.story);
      } else {
        throw new Error('The AI returned an empty story.');
      }
    } catch (error) {
      console.error('Failed to get story from AI:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate a story. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-lg border bg-card">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Creative Writer</h1>
              <p className="text-muted-foreground">
                Let's write something creative together.
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Story Topic</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., A lost dragon in a modern city"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Genre</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fantasy">Fantasy</SelectItem>
                            <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                            <SelectItem value="mystery">Mystery</SelectItem>
                            <SelectItem value="comedy">Comedy</SelectItem>
                            <SelectItem value="drama">Drama</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Story...
                    </>
                  ) : (
                    'Generate Story'
                  )}
                </Button>
              </form>
            </Form>

            {(isSubmitting || story) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Generated Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitting ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{story}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
