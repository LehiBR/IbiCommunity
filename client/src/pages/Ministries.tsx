import { useQuery } from "@tanstack/react-query";
import MinistryCard from "@/components/ministries/MinistryCard";

interface MinistryData {
  id: string;
  name: string;
  description: string;
  leader: string;
  meetingTime: string;
  imageUrl?: string;
}

const Ministries = () => {
  // Query for ministries data
  const { data: ministries, isLoading } = useQuery<MinistryData[]>({
    queryKey: ["/api/ministries"],
    queryFn: async () => {
      // This would be an API call in a real implementation
      // Providing structured ministry data for now
      return [
        {
          id: "women",
          name: "União Feminina",
          description: "Grupo dedicado ao crescimento espiritual das mulheres através de estudos bíblicos, oração e ações sociais.",
          leader: "Irmã Marta",
          meetingTime: "Reuniões aos sábados, 15h",
          imageUrl: undefined
        },
        {
          id: "youth",
          name: "Jovens",
          description: "Atividades voltadas para adolescentes e jovens, incluindo louvor, estudos bíblicos e retiros espirituais.",
          leader: "Irmão Lucas",
          meetingTime: "Encontros aos sábados, 19h",
          imageUrl: undefined
        },
        {
          id: "children",
          name: "Crianças",
          description: "Ministério voltado para o ensino bíblico de crianças através de aulas dominicais, atividades lúdicas e eventos especiais.",
          leader: "Irmã Ana",
          meetingTime: "Domingos, 9h e 18h",
          imageUrl: undefined
        },
        {
          id: "worship",
          name: "Louvor",
          description: "Equipe responsável pela música e adoração nos cultos, composta por cantores e instrumentistas.",
          leader: "Irmão Paulo",
          meetingTime: "Ensaios às sextas, 19h30",
          imageUrl: undefined
        },
        {
          id: "social",
          name: "Ação Social",
          description: "Ministério dedicado a ajudar pessoas em necessidade através de doações, visitas e projetos comunitários.",
          leader: "Irmão José",
          meetingTime: "Atividades mensais",
          imageUrl: undefined
        },
        {
          id: "bible",
          name: "Estudos Bíblicos",
          description: "Grupo focado no aprofundamento do conhecimento das escrituras através de estudos sistemáticos.",
          leader: "Pastor João",
          meetingTime: "Quartas-feiras, 19h",
          imageUrl: undefined
        }
      ];
    }
  });

  return (
    <div>
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">
            Nossos Ministérios
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Conheça os diferentes ministérios da nossa igreja e como você pode participar
              e contribuir para o crescimento do Reino de Deus.
            </p>
          </div>
        </div>
      </section>

      <section id="ministries" className="py-12 px-4 bg-neutral-light">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-2/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ministries && ministries.map((ministry) => (
                <MinistryCard key={ministry.id} ministry={ministry} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
            Participe de um Ministério
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Cada membro tem dons e talentos únicos que podem abençoar a igreja e a comunidade.
            Venha fazer parte de um de nossos ministérios!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn-accent btn-lg">
              Entre em Contato
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;
