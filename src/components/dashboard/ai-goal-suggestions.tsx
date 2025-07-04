'use client';
import { useState } from 'react';
import type { Activity, Metric, Goal } from '@/lib/types';
import { suggestDailyGoals } from '@/ai/flows/suggest-daily-goals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, Check, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

interface AiGoalSuggestionsProps {
  activities: Activity[];
  metrics: Metric[];
}

export default function AiGoalSuggestions({ activities, metrics }: AiGoalSuggestionsProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedGoals, setCompletedGoals] = useState<number[]>([]);
  const { toast } = useToast();

  const handleSuggestGoals = async () => {
    setLoading(true);
    setGoals([]);
    try {
      const input = {
        pastActivityData: JSON.stringify(activities),
        pastMetricData: JSON.stringify(metrics),
        userPreferences: JSON.stringify({ "preferredActivityTypes": ["running", "yoga"], "desiredIntensity": "moderate" }),
      };
      const result = await suggestDailyGoals(input);
      const parsedGoals = JSON.parse(result.suggestedGoals);
      setGoals(parsedGoals);
      setCompletedGoals([]);
    } catch (error) {
      console.error('Error fetching goal suggestions:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with suggesting goals.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleGoalCompletion = (index: number) => {
    setCompletedGoals(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    AI-Powered Goal Suggestions
                </CardTitle>
                <CardDescription className="mt-1">
                    Let our AI suggest achievable daily goals for you.
                </CardDescription>
            </div>
          <Button onClick={handleSuggestGoals} disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </span>
            ) : goals.length > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Regenerate Goals</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Suggest Goals</span>
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && goals.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Click the button to get your personalized daily goals!</p>
          </div>
        )}
        {!loading && goals.length > 0 && (
          <ul className="space-y-4">
            {goals.map((goal, index) => (
              <li
                key={index}
                onClick={() => toggleGoalCompletion(index)}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                  completedGoals.includes(index) ? 'bg-primary/10 text-muted-foreground' : 'bg-background/50 hover:bg-primary/5'
                }`}
              >
                <div className={`flex-shrink-0 mt-1 h-6 w-6 rounded-full flex items-center justify-center ${
                    completedGoals.includes(index) ? 'bg-primary' : 'bg-primary/20'
                }`}>
                  {completedGoals.includes(index) ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Target className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className={`font-semibold ${completedGoals.includes(index) ? 'line-through' : ''}`}>
                    {goal.activityType}: {goal.targetQuantity}
                  </p>
                  <p className="text-sm text-muted-foreground">{goal.explanation}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
