'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Metric } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Footprints, Bed, Smile, GitCommitVertical } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  steps: z.coerce.number().min(0, "Steps can't be negative").optional(),
  sleep: z.coerce.number().min(0, "Sleep can't be negative").max(24, "Can't sleep more than 24 hours").optional(),
  mood: z.number().min(1).max(5).optional(),
});

interface MetricTrackerProps {
  addMetric: (metric: Metric) => void;
}

export default function MetricTracker({ addMetric }: MetricTrackerProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { mood: 3 },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.steps !== undefined) addMetric({ type: 'steps', value: values.steps });
    if (values.sleep !== undefined) addMetric({ type: 'sleep', value: values.sleep });
    if (values.mood !== undefined) addMetric({ type: 'mood', value: values.mood });
    toast({
        title: "Metrics Updated!",
        description: "Your daily metrics have been successfully saved.",
    })
    form.reset({ mood: 3, steps: undefined, sleep: undefined });
  }
  
  const moodLabels = ["", "Very Bad", "Bad", "Neutral", "Good", "Very Good"];

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <GitCommitVertical className="h-5 w-5" /> Track Your Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Footprints className="h-4 w-4 text-primary" /> Steps Taken</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sleep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Bed className="h-4 w-4 text-primary" /> Hours Slept</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                   <FormLabel className="flex items-center gap-2"><Smile className="h-4 w-4 text-primary" /> Mood Level: <span className="font-bold text-primary">{moodLabels[field.value || 3]}</span></FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value || 3]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Update Metrics</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
