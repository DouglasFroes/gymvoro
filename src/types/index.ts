export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  instructions?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  startTime: number;
  endTime?: number;
  exercises: WorkoutExercise[];
  userId: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}
