import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-primary text-white">
      <div className="absolute inset-0 bg-darkblue opacity-30"></div>
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Bem-vindo à Igreja Batista Independente
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Comunidade de fé e amor em Parnaíba, compartilhando a palavra 
            de Deus e fortalecendo vidas.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about">
              <Button className="bg-white text-primary hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition">
                Conheça Nossa Igreja
              </Button>
            </Link>
            <Link href="/calendar">
              <Button className="bg-accent text-neutral-text hover:bg-yellow-500 font-semibold px-6 py-3 rounded-md transition">
                Próximos Eventos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
