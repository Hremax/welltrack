'use client';
import { useState, useEffect } from 'react';

export default function WelcomeHeader() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground font-headline">
        Welcome to WellTrack
      </h1>
      <p className="mt-1 text-muted-foreground">{currentDate}</p>
    </div>
  );
}
