'use client';

import type { Activity, Metric } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Footprints, Bed, Smile, GlassWater, Dumbbell, Utensils } from 'lucide-react';

interface DailySummaryProps {
  activities: Activity[];
  metrics: Metric[];
}

const goals = {
  steps: 10000,
  sleep: 8,
  water: 8,
  exercise: 30,
  calories: 2000,
};

export default function DailySummary({ activities, metrics }: DailySummaryProps) {
  const steps = metrics.find(m => m.type === 'steps')?.value || 0;
  const sleep = metrics.find(m => m.type === 'sleep')?.value || 0;
  const mood = metrics.find(m => m.type === 'mood')?.value || 0;
  const water = activities.filter(a => a.type === 'water').reduce((sum, a) => sum + (a.quantity || 0), 0);
  const exercise = activities.filter(a => a.type === 'exercise').reduce((sum, a) => sum + (a.duration || 0), 0);
  const calories = activities.filter(a => a.type === 'meal').reduce((sum, a) => sum + (a.calories || 0), 0);
  
  const chartData = [
    { name: 'Steps', value: steps, goal: goals.steps },
    { name: 'Sleep', value: sleep, goal: goals.sleep },
    { name: 'Water', value: water, goal: goals.water },
    { name: 'Exercise', value: exercise, goal: goals.exercise },
    { name: 'Calories', value: calories, goal: goals.calories },
  ];

  const progressData = [
    { icon: Footprints, label: 'Steps', value: steps, goal: goals.steps, unit: '' },
    { icon: Bed, label: 'Sleep', value: sleep, goal: goals.sleep, unit: 'hrs' },
    { icon: GlassWater, label: 'Water', value: water, goal: goals.water, unit: 'glasses' },
    { icon: Dumbbell, label: 'Exercise', value: exercise, goal: goals.exercise, unit: 'min' },
    { icon: Utensils, label: 'Calories', value: calories, goal: goals.calories, unit: 'kcal' },
    { icon: Smile, label: 'Mood', value: mood, goal: 5, unit: '/ 5' },
  ]

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {progressData.map(item => (
            <div key={item.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="h-5 w-5 text-primary" strokeWidth={2}/>
                  <span>{item.label}</span>
                </div>
                <span>{item.value}{item.unit} / {item.goal}{item.unit}</span>
              </div>
              <Progress value={(item.value / item.goal) * 100} className="h-2" />
            </div>
          ))}
        </div>
        <div className="mt-8 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background) / 0.8)",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Your Progress" radius={[4, 4, 0, 0]}/>
                    <Bar dataKey="goal" fill="hsl(var(--secondary))" name="Goal" radius={[4, 4, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
