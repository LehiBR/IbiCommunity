import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-primary text-white">
          <CardTitle className="text-2xl font-bold flex items-center">
            <span className="material-icons mr-2">error_outline</span>
            Página não encontrada
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-gray-300 mb-4">404</p>
            <p className="text-gray-600 mb-4">
              Parece que você se perdeu no caminho. A página que você está procurando não existe ou foi movida.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button asChild className="btn-primary">
            <Link href="/">
              <span className="material-icons mr-2">home</span>
              Voltar para a página inicial
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
