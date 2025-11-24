import firestore from '@react-native-firebase/firestore';

export const workoutsCollection = firestore().collection('workouts');
export const exercisesCollection = firestore().collection('exercises');
export const historyCollection = firestore().collection('history');
