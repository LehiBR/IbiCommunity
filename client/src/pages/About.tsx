import { useQuery } from "@tanstack/react-query";
import History from "@/components/about/History";
import Leadership from "@/components/about/Leadership";
import { Lightbulb, Eye, Heart } from "lucide-react";

interface LeaderData {
  id: number;
  name: string;
  role: string;
  image?: string;
}

const About = () => {
  // Query for leadership team data
  const { data: leadershipTeam, isLoading: loadingLeadership } = useQuery<LeaderData[]>({
    queryKey: ["/api/leadership"],
    queryFn: async () => {
      // This is where we would fetch leadership data from API
      // For now, providing structured leadership data
      return [
        {
          id: 1,
          name: "Pastor João Silva",
          role: "Pastor Titular",
          image: undefined
        },
        {
          id: 2,
          name: "Pastora Maria Souza",
          role: "Pastora de Educação",
          image: undefined
        },
        {
          id: 3,
          name: "Diácono Pedro Santos",
          role: "Tesoureiro",
          image: undefined
        },
        {
          id: 4,
          name: "Diaconisa Ana Oliveira",
          role: "Secretária",
          image: undefined
        }
      ];
    },
  });

  // Church history data
  const churchHistory = {
    title: "Igreja Batista Independente de Parnaíba",
    foundingYear: 1985,
    description: [
      "Fundada em 1985, a Igreja Batista Independente de Parnaíba nasceu do desejo de um pequeno grupo de fiéis que se reuniam em casas para estudar a Bíblia e compartilhar a fé.",
      "Com o crescimento da congregação, em 1990 foi adquirido o terreno onde hoje se encontra nosso templo principal, inaugurado em 1995 após anos de dedicação e trabalho da comunidade.",
      "Ao longo desses anos, nossa igreja tem sido um farol na cidade de Parnaíba, compartilhando o evangelho, realizando ações sociais e formando discípulos comprometidos com a Palavra de Deus.",
      "Hoje, contamos com mais de 300 membros ativos e diversos ministérios que atendem todas as faixas etárias, sempre com o propósito de glorificar a Deus e servir ao próximo."
    ],
    imageUrl: undefined
  };

  return (
    <div>
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">
            Nossa História
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Conheça mais sobre a trajetória da Igreja Batista Independente de Parnaíba, 
              seus valores e sua liderança.
            </p>
          </div>
        </div>
      </section>
      
      {/* Church History Section */}
      <History history={churchHistory} />
      
      {/* Church Leadership Section */}
      <Leadership 
        leaders={leadershipTeam || []} 
        isLoading={loadingLeadership} 
      />
      
      {/* Church Mission & Values */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="section-title">Nossa Missão e Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full mb-4">
                <Lightbulb className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Missão</h3>
              <p className="text-gray-700">
                Glorificar a Deus através do genuíno culto, do discipulado bíblico, 
                da comunhão fraternal e do evangelismo local e mundial.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full mb-4">
                <Eye className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Visão</h3>
              <p className="text-gray-700">
                Ser uma igreja relevante na cidade de Parnaíba, formando discípulos 
                de Cristo comprometidos com a Palavra e transformadores da sociedade.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full mb-4">
                <Heart className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Valores</h3>
              <p className="text-gray-700">
                Compromisso com a verdade bíblica, amor ao próximo, 
                excelência na adoração, família como base da sociedade e serviço comunitário.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
