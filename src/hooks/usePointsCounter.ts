import { useState, useCallback, useEffect, useRef } from 'react';
import { useProgress } from 'react-native-track-player';
import { PointsCounterConfig } from '../types';

interface UsePointsCounterReturn {
  currentPoints: number;
  pointsEarned: number;
  progress: number; // 0-100
  isActive: boolean;
  startCounting: (config: PointsCounterConfig) => void;
  stopCounting: () => void;
  resetProgress: () => void;
}

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);
  const progress = useProgress();
  const lastProgressRef = useRef(0);

  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
    lastProgressRef.current = 0;
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
    lastProgressRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isActive || !config || progress.duration === 0) return;

    const progressPercentage = Math.min(
      100,
      (progress.position / progress.duration) * 100
    );
    const earnedPoints = Math.floor(
      (progressPercentage / 100) * config.totalPoints
    );

    if (earnedPoints > pointsEarned && progress.position > lastProgressRef.current) {
      setPointsEarned(earnedPoints);
      setCurrentPoints(earnedPoints);
      lastProgressRef.current = progress.position;
    }
  }, [progress.position, progress.duration, isActive, config, pointsEarned]);

  return {
    currentPoints,
    pointsEarned,
    progress: config && progress.duration > 0
      ? Math.min(100, (progress.position / progress.duration) * 100)
      : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};

