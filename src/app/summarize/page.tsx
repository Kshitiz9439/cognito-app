'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { summarizeText } from '@/ai/flows/summarize-flow';

const FormSchema = z.object({
  document: z.string().min(10, 'Please enter a document with at least 10 characters.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function SummarizePage() {
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      document: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    setSummary('');

    try {
      const result = await summarizeText({ document: data.document });
      if (result.summary) {
        setSummary(result.summary);
      } else {
        throw new Error('The AI returned an empty summary.');
      }
    } catch (error) {
      console.error('Failed to get summary from AI:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to get a summary. Please try again.',
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
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Summarize Documents</h1>
              <p className="text-muted-foreground">
                Paste your document text to get a concise summary.
              </p>
            </div>
          </div>

          <div className="grid gap-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Document to Summarize</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your document here..."
                          className="min-h-[200px] resize-y"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    'Summarize Text'
                  )}
                </Button>
              </form>
            </Form>

            {(isSubmitting || summary) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Generated Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitting ? (
                     <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                     </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{summary}</p>
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
