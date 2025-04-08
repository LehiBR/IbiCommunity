import { Card } from "@/components/ui/card";

interface Leader {
  id: number;
  name: string;
  role: string;
  image?: string;
}

interface LeadershipProps {
  leaders: Leader[];
  isLoading: boolean;
}

const Leadership = ({ leaders, isLoading }: LeadershipProps) => {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Nossa Liderança</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : leaders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map(leader => (
              <div key={leader.id} className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                  {leader.image ? (
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <span className="material-icons text-primary text-3xl">person</span>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-bold font-heading text-gray-800">
                  {leader.name}
                </h4>
                <p className="text-gray-600">{leader.role}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Informações da liderança não disponíveis.</p>
          </div>
        )}
        
        {/* Values statement */}
        <Card className="mt-12 p-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="material-icons text-primary text-3xl mb-4">star</span>
            <h3 className="text-xl font-bold mb-3 text-primary">Nossos Princípios de Liderança</h3>
            <p className="text-gray-600 mb-4">
              Nossa liderança é fundamentada nos princípios bíblicos de serviço, integridade e humildade, 
              seguindo o exemplo de Cristo como servo-líder.
            </p>
            <p className="text-gray-600 italic">
              "Quem quiser tornar-se importante entre vocês deverá ser servo, e quem quiser ser o primeiro deverá ser escravo." - Mateus 20:26-27
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Leadership;
