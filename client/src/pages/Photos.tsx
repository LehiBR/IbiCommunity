import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PhotoAlbum } from "@shared/schema";

const Photos = () => {
  // Fetch photo albums
  const { data: albums, isLoading } = useQuery<PhotoAlbum[]>({
    queryKey: ["/api/albums"],
    queryFn: async () => {
      const res = await fetch("/api/albums");
      if (!res.ok) throw new Error("Failed to fetch photo albums");
      return await res.json();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Galeria de Fotos</h1>
          <p className="text-gray-600">
            Momentos especiais da nossa igreja e comunidade capturados em imagens.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : albums && albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <Card key={album.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="material-icons text-5xl text-gray-400">photo_library</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{album.title}</CardTitle>
                  <CardDescription>
                    {new Date(album.createdAt).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {album.description || "Álbum de fotos da nossa igreja."}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if (album.googleAlbumUrl) {
                        window.open(album.googleAlbumUrl, "_blank");
                      }
                    }}
                  >
                    <span className="material-icons mr-2">photo_library</span>
                    Ver Álbum
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <span className="material-icons text-gray-400 text-6xl mb-4">photo_library</span>
            <h3 className="text-xl font-semibold mb-2">Nenhum álbum disponível</h3>
            <p className="text-gray-500 mb-6">
              Não há álbuns de fotos cadastrados no momento.
            </p>
          </div>
        )}
        
        {/* Integration info */}
        <div className="mt-12 bg-primary/5 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-primary mb-4">
            <span className="material-icons align-middle mr-2">info</span>
            Integração com Google Fotos
          </h2>
          <p className="text-gray-600 mb-4">
            Nossa galeria de fotos é integrada com o Google Fotos para oferecer a melhor 
            experiência de visualização. Ao clicar em um álbum, você será redirecionado 
            para o Google Fotos, onde poderá ver todas as imagens em alta resolução.
          </p>
          <p className="text-gray-600">
            Caso deseje contribuir com fotos de eventos da igreja, entre em contato com 
            a equipe de comunicação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Photos;
