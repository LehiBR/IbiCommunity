import { Card, CardContent } from "@/components/ui/card";

interface HistoryProps {
  history: {
    title: string;
    foundingYear: number;
    description: string[];
    imageUrl?: string;
  };
}

const History = ({ history }: HistoryProps) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="rounded-lg shadow-md overflow-hidden h-full">
              {history.imageUrl ? (
                <img 
                  src={history.imageUrl} 
                  alt={history.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gray-200 flex items-center justify-center">
                  <span className="material-icons text-gray-400 text-6xl">church</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading text-primary">
              {history.title}
            </h3>
            <div className="space-y-4">
              {history.description.map((paragraph, index) => (
                <p key={index} className="text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="mt-8 flex items-center p-4 bg-primary/5 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
                <span className="material-icons">history</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Fundada em {history.foundingYear}</p>
                <p className="text-sm text-gray-600">
                  {new Date().getFullYear() - history.foundingYear} anos de história e serviço a Deus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;
