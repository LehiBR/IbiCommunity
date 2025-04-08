import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import MonthlyCalendar from "@/components/calendar/MonthlyCalendar";
import EventCard from "@/components/calendar/EventCard";
import type { Event } from "@shared/schema";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Format the current month for display
  const formattedMonth = format(currentMonth, "MMMM yyyy", { locale: ptBR });
  
  // Calculate the start and end date of the current month for API query
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  
  // Fetch events for the current month
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: [
      "/api/events", 
      startDate.toISOString(), 
      endDate.toISOString()
    ],
    queryFn: async () => {
      const res = await fetch(
        `/api/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch events");
      return await res.json();
    }
  });
  
  // Get featured events (upcoming events in the next 7 days)
  const featuredEvents = events?.filter(event => {
    const eventDate = parseISO(event.startDate.toString());
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return eventDate >= today && eventDate <= nextWeek;
  }).slice(0, 3);
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div>
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">
            Agenda de Eventos
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Acompanhe todas as atividades e eventos da nossa igreja. 
              Participe e fique por dentro do que está acontecendo.
            </p>
          </div>
        </div>
      </section>

      <section id="calendar" className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          {/* Calendar Navigation */}
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={prevMonth}
              className="text-primary hover:text-darkblue"
            >
              <span className="material-icons">arrow_back</span>
            </Button>
            <h3 className="text-xl font-bold font-heading capitalize">
              {formattedMonth}
            </h3>
            <Button 
              variant="ghost" 
              onClick={nextMonth}
              className="text-primary hover:text-darkblue"
            >
              <span className="material-icons">arrow_forward</span>
            </Button>
          </div>
          
          {/* Calendar Grid */}
          <div className="overflow-x-auto mb-8">
            <MonthlyCalendar 
              currentMonth={currentMonth} 
              events={events || []} 
              isLoading={isLoading}
            />
          </div>
          
          {/* Featured Events */}
          <h3 className="text-xl font-bold mb-6 font-heading text-primary">
            Eventos em Destaque
          </h3>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-neutral-border rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="bg-gray-200 p-4 h-24"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredEvents && featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Não há eventos em destaque para este período.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Confira o calendário para ver todos os eventos do mês.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Calendar;
