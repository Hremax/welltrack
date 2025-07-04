'use client';

import React, { useState } from 'react';
import type { Activity, Metric, Goal } from '@/lib/types';
import WelcomeHeader from '@/components/dashboard/welcome-header';
import DailySummary from '@/components/dashboard/daily-summary';
import ActivityLogger from '@/components/dashboard/activity-logger';
import MetricTracker from '@/components/dashboard/metric-tracker';
import AiGoalSuggestions from '@/components/dashboard/ai-goal-suggestions';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([
    { type: 'water', quantity: 8, unit: 'glasses' },
    { type: 'exercise', name: 'Running', duration: 30 },
    { type: 'meal', name: 'Salad', calories: 450 },
  ]);
  const [metrics, setMetrics] = useState<Metric[]>([
    { type: 'steps', value: 10000 },
    { type: 'sleep', value: 8 },
    { type: 'mood', value: 4 },
  ]);

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [...prev, activity]);
  };

  const addMetric = (metric: Metric) => {
    const existingMetricIndex = metrics.findIndex(m => m.type === metric.type);
    if (existingMetricIndex > -1) {
      setMetrics(prev => prev.map((m, i) => i === existingMetricIndex ? metric : m));
    } else {
      setMetrics(prev => [...prev, metric]);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <WelcomeHeader />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DailySummary activities={activities} metrics={metrics} />
          </div>
          <div className="space-y-8">
            <ActivityLogger addActivity={addActivity} />
            <MetricTracker addMetric={addMetric} />
          </div>
        </div>
        <div className="mt-8">
          <AiGoalSuggestions activities={activities} metrics={metrics} />
        </div>
      </div>
    </main>
  );
}
