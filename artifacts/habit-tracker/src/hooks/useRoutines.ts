import { useState, useEffect, useCallback } from "react";
import { Routine } from "@/types/routine";

const STORAGE_KEY = "routines";

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: ensure existing routines with subOptions have a subOptionType
        return parsed.map((r: any) => ({
          ...r,
          subOptionType: r.subOptionType || (r.subOptions && r.subOptions.length > 0 ? "multi" : undefined)
        }));
      }
    } catch (e) {
      console.error("Failed to load routines from localStorage", e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  const addRoutine = useCallback((routine: Omit<Routine, "id" | "createdAt" | "completedDates" | "completedDetails">) => {
    setRoutines(prev => {
      const newRoutine: Routine = {
        ...routine,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        completedDates: [],
        completedDetails: {},
      };
      const updated = [...prev, newRoutine];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateRoutine = useCallback((id: string, updates: Partial<Omit<Routine, "id" | "createdAt" | "completedDates" | "completedDetails">>) => {
    setRoutines(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteRoutine = useCallback((id: string) => {
    setRoutines(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleDate = useCallback((routineId: string, dateString: string, forceState?: boolean, subOption?: string | string[]) => {
    setRoutines(prev => {
      const updated = prev.map(r => {
        if (r.id === routineId) {
          const currentlyCompleted = r.completedDates.includes(dateString);
          const willComplete = forceState !== undefined ? forceState : !currentlyCompleted;
          
          let newCompletedDates = r.completedDates;
          if (willComplete && !currentlyCompleted) {
            newCompletedDates = [...r.completedDates, dateString];
          } else if (!willComplete && currentlyCompleted) {
            newCompletedDates = r.completedDates.filter(d => d !== dateString);
          }
          
          const newCompletedDetails = { ...r.completedDetails };
          if (!willComplete) {
            delete newCompletedDetails[dateString];
          } else if (subOption) {
            newCompletedDetails[dateString] = subOption;
          }

          return {
            ...r,
            completedDates: newCompletedDates,
            completedDetails: newCompletedDetails
          };
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const reorderRoutines = useCallback((fromId: string, toId: string) => {
    setRoutines(prev => {
      const fromIndex = prev.findIndex(r => r.id === fromId);
      const toIndex = prev.findIndex(r => r.id === toId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    routines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleDate,
    reorderRoutines,
  };
}
