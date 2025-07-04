'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Activity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Utensils, GlassWater, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  type: z.enum(['exercise', 'meal', 'water']),
  name: z.string().optional(),
  duration: z.coerce.number().positive().optional(),
  calories: z.coerce.number().positive().optional(),
  quantity: z.coerce.number().positive().optional(),
});

interface ActivityLoggerProps {
  addActivity: (activity: Activity) => void;
}

export default function ActivityLogger({ addActivity }: ActivityLoggerProps) {
  const { toast } = useToast()
  const [activityType, setActivityType] = useState<'exercise' | 'meal' | 'water'>('exercise');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: 'exercise' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addActivity(values);
    toast({
        title: "Activity Logged!",
        description: `Your ${values.type} has been successfully added.`,
    })
    form.reset({ type: values.type });
  }

  const icons = {
    exercise: <Dumbbell className="h-5 w-5" />,
    meal: <Utensils className="h-5 w-5" />,
    water: <GlassWater className="h-5 w-5" />,
  }

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            {icons[activityType]} Log Your Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => {
                // `useFormField` hook needs to be called inside a component that is a child of FormItem.
                // To achieve this, we can define a small helper component or use the props directly if accessible.
                // For this specific case, we will call useFormField inside the render prop,
                // as FormItem establishes the necessary context.
                const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

                return (
                  <FormItem>
                    <FormLabel>Activity Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value); // RHF's onChange
                        setActivityType(value as 'exercise' | 'meal' | 'water');
                      }}
                      defaultValue={field.value} // RHF's value
                    >
                      <SelectTrigger
                        ref={field.ref} // RHF's ref
                        id={formItemId} // from useFormField
                        aria-describedby={
                          !error
                            ? formDescriptionId
                            : `${formDescriptionId} ${formMessageId}`
                        } // from useFormField
                        aria-invalid={!!error} // from useFormField
                      >
                        <SelectValue placeholder="Select an activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="meal">Meal</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage /> {/* FormMessage also uses useFormField internally */}
                  </FormItem>
                );
              }}
            />

            {activityType === 'exercise' && (
              <>
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Exercise Name</Label> <FormControl> <Input placeholder="e.g., Running" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="duration" render={({ field }) => ( <FormItem> <FormLabel>Duration (minutes)</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 30" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              </>
            )}

            {activityType === 'meal' && (
              <>
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Meal Name</FormLabel> <FormControl> <Input placeholder="e.g., Salad" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="calories" render={({ field }) => ( <FormItem> <FormLabel>Calories</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 450" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              </>
            )}

            {activityType === 'water' && (
                <FormField control={form.control} name="quantity" render={({ field }) => ( <FormItem> <FormLabel>Quantity (glasses)</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 8" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            )}

            <Button type="submit" className="w-full">
              <span className="flex items-center justify-center gap-2">
                <Plus />
                Add Activity
              </span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
