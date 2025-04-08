import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const Contact = () => {
  return (
    <div>
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">
            Entre em Contato
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Estamos à disposição para atender suas dúvidas, receber sugestões
              ou ajudá-lo a fazer parte da nossa comunidade.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-light rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6 font-heading text-primary">
                  Envie-nos uma Mensagem
                </h3>
                <ContactForm />
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold mb-4 font-heading text-primary">
              Localização
            </h3>
            <div className="h-80 bg-gray-100 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63794.69865235302!2d-41.813945!3d-2.9055708999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ec2fea3ea52e9d%3A0x1067fa898276c794!2sParna%C3%ADba%2C%20PI!5e0!3m2!1spt-BR!2sbr!4v1626364420596!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                title="Mapa da localização da igreja"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section className="py-12 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 font-heading">
            Horários dos Nossos Cultos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="material-icons text-white text-2xl">
                  calendar_today
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Culto de Domingo</h3>
              <p className="text-white/80">
                <span className="block font-semibold">Manhã: 9h</span>
                <span className="block font-semibold">Noite: 18h</span>
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="material-icons text-white text-2xl">
                  menu_book
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Estudo Bíblico</h3>
              <p className="text-white/80">
                <span className="block font-semibold">Quarta-feira: 19h</span>
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="material-icons text-white text-2xl">
                  people
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Reunião de Jovens</h3>
              <p className="text-white/80">
                <span className="block font-semibold">Sábado: 19h</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
