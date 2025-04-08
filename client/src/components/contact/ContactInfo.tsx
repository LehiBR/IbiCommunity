import { Card, CardContent } from '@/components/ui/card';

const ContactInfo = () => {
  // Church contact information
  const contactInfo = {
    address: 'Rua das Palmeiras, 123\nCentro, Parnaíba - PI\nCEP: 64200-000',
    worship: 'Domingos: 9h e 18h\nQuartas-feiras: 19h',
    phone: '(86) 3322-1234',
    email: 'contato@ibiparnaiba.org',
    socialMedia: [
      { icon: 'facebook', url: 'https://facebook.com/' },
      { icon: 'music_note', url: 'https://spotify.com/' },
      { icon: 'video_library', url: 'https://youtube.com/' },
      { icon: 'photo_camera', url: 'https://instagram.com/' },
    ],
  };

  return (
    <Card className="bg-neutral-light rounded-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6 font-heading text-primary">Informações de Contato</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="material-icons text-primary mr-3 mt-1">location_on</span>
            <div>
              <h4 className="font-semibold">Endereço</h4>
              <p className="text-gray-600 whitespace-pre-line">{contactInfo.address}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="material-icons text-primary mr-3 mt-1">schedule</span>
            <div>
              <h4 className="font-semibold">Horários dos Cultos</h4>
              <p className="text-gray-600 whitespace-pre-line">{contactInfo.worship}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="material-icons text-primary mr-3 mt-1">phone</span>
            <div>
              <h4 className="font-semibold">Telefone</h4>
              <p className="text-gray-600">{contactInfo.phone}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="material-icons text-primary mr-3 mt-1">email</span>
            <div>
              <h4 className="font-semibold">E-mail</h4>
              <p className="text-gray-600">{contactInfo.email}</p>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mt-8 mb-4 font-heading text-primary">Redes Sociais</h3>
        <div className="flex space-x-4">
          {contactInfo.socialMedia.map((social, index) => (
            <a 
              key={index} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-darkblue transition"
              aria-label={social.icon}
            >
              <span className="material-icons">{social.icon}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
