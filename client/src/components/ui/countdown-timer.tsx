"use client";

import { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endDate: string; // ISO 8601 date string
  onExpire?: () => void;
  variant?: "badge" | "inline" | "compact";
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const difference = new Date(endDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  };
}

export function CountdownTimer({
  endDate,
  onExpire,
  variant = "badge",
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft.expired) {
    return null;
  }

  // Compact variant - just shows "2d 5h" or "5h 30m"
  if (variant === "compact") {
    const parts: string[] = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`);
    if (timeLeft.days === 0 && timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`);

    return (
      <span className={cn("text-xs font-medium", className)}>
        {parts.join(" ")}
      </span>
    );
  }

  // Inline variant - "Termina em 2 dias e 5 horas"
  if (variant === "inline") {
    let text = "Termina em ";
    if (timeLeft.days > 0) {
      text += `${timeLeft.days} dia${timeLeft.days > 1 ? "s" : ""}`;
      if (timeLeft.hours > 0) {
        text += ` e ${timeLeft.hours}h`;
      }
    } else if (timeLeft.hours > 0) {
      text += `${timeLeft.hours}h ${timeLeft.minutes}min`;
    } else {
      text += `${timeLeft.minutes}min ${timeLeft.seconds}s`;
    }

    return (
      <span className={cn("text-xs text-orange-600 font-medium", className)}>
        <Clock className="inline-block w-3 h-3 mr-1" />
        {text}
      </span>
    );
  }

  // Badge variant (default) - animated badge with countdown
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 6;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold",
        isUrgent
          ? "bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse"
          : "bg-orange-100 text-orange-700",
        className
      )}
    >
      {isUrgent ? (
        <Flame className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      )}
      {timeLeft.days > 0 ? (
        <span>
          {timeLeft.days}d {timeLeft.hours}h
        </span>
      ) : timeLeft.hours > 0 ? (
        <span>
          {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      ) : (
        <span>
          {timeLeft.minutes}:{timeLeft.seconds.toString().padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

// Hook to check if discount is still valid
export function useDiscountValid(endDate?: string): boolean {
  const [isValid, setIsValid] = useState(() => {
    if (!endDate) return true;
    return new Date(endDate).getTime() > new Date().getTime();
  });

  useEffect(() => {
    if (!endDate) {
      setIsValid(true);
      return;
    }

    const checkValidity = () => {
      setIsValid(new Date(endDate).getTime() > new Date().getTime());
    };

    checkValidity();
    const timer = setInterval(checkValidity, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return isValid;
}
