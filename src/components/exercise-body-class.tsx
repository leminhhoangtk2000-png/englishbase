"use client";

import React from 'react';

// Client component to add body class for exercises
export function ExerciseBodyClass() {
  React.useEffect(() => {
    document.body.classList.add('exercise-body');
    return () => {
      document.body.classList.remove('exercise-body');
    };
  }, []);
  return null;
}
