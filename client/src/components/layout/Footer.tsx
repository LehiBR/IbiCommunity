import { Link } from 'wouter';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube, 
  Headphones,
  Church
} from 'lucide-react';
import logoImage from '@/assets/logo.jpg';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-darkblue text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <motion.div 
                className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-white p-1"
                whileHover={{ rotate: 10, scale: 1.05 }}
              >
                <img 
                  src={logoImage} 
                  alt="IBI Parnaíba Logo" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h2 className="text-xl font-bold">IBI Parnaíba</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Igreja Batista Independente de Parnaíba, compartilhando o amor de Cristo desde 1985.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-white transition" 
                aria-label="Facebook"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-white transition" 
                aria-label="Instagram"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-white transition" 
                aria-label="Youtube"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Youtube size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-white transition" 
                aria-label="Podcast"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Headphones size={20} />
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/ministries" className="text-gray-300 hover:text-white transition">
                  Ministérios
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-gray-300 hover:text-white transition">
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-gray-300 hover:text-white transition">
                  Downloads
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-300 hover:text-white transition">
                  Área do Membro
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Ministérios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ministries#women" className="text-gray-300 hover:text-white transition">
                  União Feminina
                </Link>
              </li>
              <li>
                <Link href="/ministries#youth" className="text-gray-300 hover:text-white transition">
                  Jovens
                </Link>
              </li>
              <li>
                <Link href="/ministries#children" className="text-gray-300 hover:text-white transition">
                  Crianças
                </Link>
              </li>
              <li>
                <Link href="/ministries#worship" className="text-gray-300 hover:text-white transition">
                  Louvor
                </Link>
              </li>
              <li>
                <Link href="/ministries#social" className="text-gray-300 hover:text-white transition">
                  Ação Social
                </Link>
              </li>
              <li>
                <Link href="/ministries#bible" className="text-gray-300 hover:text-white transition">
                  Estudos Bíblicos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="mr-2 text-gray-300" size={18} />
                <span className="text-gray-300">Rua das Palmeiras, 123, Centro, Parnaíba - PI</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 text-gray-300" size={18} />
                <span className="text-gray-300">(86) 3322-1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 text-gray-300" size={18} />
                <span className="text-gray-300">contato@ibiparnaiba.org</span>
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 text-gray-300" size={18} />
                <span className="text-gray-300">Cultos: Dom 9h e 18h | Qua 19h</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">&copy; {new Date().getFullYear()} Igreja Batista Independente de Parnaíba. Todos os direitos reservados.</p>
          <div className="mt-4 space-x-4">
            <Link href="/about" className="text-gray-300 hover:text-white transition text-sm">
              Política de Privacidade
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition text-sm">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
