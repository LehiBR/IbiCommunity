import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MinistryProps {
  ministry: {
    id: string;
    name: string;
    description: string;
    leader: string;
    meetingTime: string;
    imageUrl?: string;
  };
}

const MinistryCard = ({ ministry }: MinistryProps) => {
  const { toast } = useToast();
  
  const handleContactClick = () => {
    toast({
      title: "Informações de contato",
      description: `Para participar do ministério ${ministry.name}, entre em contato com ${ministry.leader} ou através da secretaria da igreja.`,
    });
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ 
          backgroundImage: ministry.imageUrl 
            ? `url(${ministry.imageUrl})` 
            : "url('https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?auto=format&fit=crop&w=800&h=500&q=80')" 
        }}
      />
      <CardHeader>
        <CardTitle className="text-xl text-primary">{ministry.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{ministry.description}</p>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="material-icons text-primary mr-2">event</span>
            <span>{ministry.meetingTime}</span>
          </div>
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">person</span>
            <span>Coordenador(a): {ministry.leader}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleContactClick} className="w-full">
          Saiba Mais
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MinistryCard;
