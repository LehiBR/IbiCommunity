import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@shared/schema';

interface MonthlyCalendarProps {
  currentMonth: Date;
  events: Event[];
  isLoading: boolean;
}

// Category colors for events
const categoryColors: Record<string, string> = {
  general: 'bg-secondary bg-opacity-20 text-primary',
  worship: 'bg-primary bg-opacity-20 text-primary',
  women: 'bg-status-success bg-opacity-20 text-status-success',
  youth: 'bg-accent bg-opacity-20 text-neutral-text',
  children: 'bg-status-warning bg-opacity-20 text-status-warning',
  social: 'bg-status-error bg-opacity-20 text-status-error',
  default: 'bg-secondary bg-opacity-20 text-primary'
};

const MonthlyCalendar = ({ currentMonth, events, isLoading }: MonthlyCalendarProps) => {
  // Generate calendar days for the current month view
  const calendarDays = useMemo(() => {
    // Get the month bounds
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    
    // Get the calendar view bounds (starting from Sunday, ending on Saturday)
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    // Generate all days in the calendar view
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Get weekday names
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return format(day, 'EEE', { locale: ptBR });
    });
  }, []);

  // Group days into weeks for rendering
  const calendarWeeks = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    return weeks;
  }, [calendarDays]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    if (!events) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  // Get appropriate color class for an event category
  const getEventColorClass = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-center">
              {weekDays.map((day, index) => (
                <th key={index} className="calendar-day-head font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, weekIndex) => (
              <tr key={weekIndex} className="text-center h-24">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <td key={dayIndex} className="border p-1 align-top">
                    <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded mt-1"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-center">
            {weekDays.map((day, index) => (
              <th key={index} className="calendar-day-head font-medium">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="text-center h-24">
              {week.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isCurrentDay = isToday(day);
                
                return (
                  <td 
                    key={dayIndex} 
                    className={`calendar-day ${isCurrentDay ? 'bg-primary bg-opacity-10' : ''}`}
                  >
                    <div className={`text-sm ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => (
                        <div 
                          key={eventIndex} 
                          className={`calendar-event ${getEventColorClass(event.category)}`}
                          title={event.title}
                        >
                          {format(new Date(event.startDate), 'HH:mm')} {event.title}
                        </div>
                      ))}
                      
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-primary font-semibold">
                          +{dayEvents.length - 3} mais
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyCalendar;
