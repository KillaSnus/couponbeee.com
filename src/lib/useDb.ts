import { useState, useEffect } from 'react';
import { db } from './store';

export function useDb() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setTick(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  return db;
}
