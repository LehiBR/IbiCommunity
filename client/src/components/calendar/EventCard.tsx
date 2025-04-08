import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@shared/schema';
import { Card } from '@/components/ui/card';

interface EventCardProps {
  event: Event;
}

// Category colors for events
const categoryColors: Record<string, { bg: string; text: string }> = {
  general: { bg: 'bg-primary', text: 'text-white' },
  worship: { bg: 'bg-primary', text: 'text-white' },
  women: { bg: 'bg-status-success', text: 'text-white' },
  youth: { bg: 'bg-accent', text: 'text-neutral-text' },
  children: { bg: 'bg-status-warning', text: 'text-neutral-text' },
  social: { bg: 'bg-secondary', text: 'text-white' },
  default: { bg: 'bg-primary', text: 'text-white' }
};

const EventCard = ({ event }: EventCardProps) => {
  const eventDate = parseISO(event.startDate.toString());
  const eventEndDate = parseISO(event.endDate.toString());
  
  // Format day of week, day, and month
  const dayOfWeek = format(eventDate, 'EEEE', { locale: ptBR }).toUpperCase();
  const dayOfMonth = format(eventDate, 'd');
  const month = format(eventDate, 'MMMM', { locale: ptBR });
  const year = format(eventDate, 'yyyy');
  
  // Format time
  const startTime = format(eventDate, 'HH:mm');
  const endTime = format(eventEndDate, 'HH:mm');
  
  // Get color based on category
  const colorStyle = categoryColors[event.category] || categoryColors.default;
  
  return (
    <Card className="bg-white border border-neutral-border rounded-lg overflow-hidden shadow-sm">
      <div className={`p-4 ${colorStyle.bg} ${colorStyle.text}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold">{dayOfWeek}</p>
            <p className="text-2xl font-bold">{dayOfMonth}</p>
            <p className="text-sm">{month}, {year}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">{startTime} - {endTime}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-lg font-bold mb-2 font-heading">{event.title}</h4>
        <p className="text-gray-600 mb-4">{event.description}</p>
        {event.location && (
          <div className="flex items-center text-sm text-gray-500">
            <span className="material-icons text-sm mr-1">location_on</span>
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventCard;
