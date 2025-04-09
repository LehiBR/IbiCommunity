import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FiCalendar, FiInfo } from "react-icons/fi";
import pombaImage from '@/assets/church/pomba.jpg';

const Hero = () => {
  return (
    <section className="relative bg-primary text-white overflow-hidden">
      <div className="absolute inset-0 bg-darkblue opacity-30"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 opacity-20">
        <motion.div 
          className="w-64 h-64 rounded-full bg-white"
          initial={{ x: 100, y: -100, opacity: 0.1 }}
          animate={{ 
            x: 50, 
            y: -50,
            opacity: 0.2,
            scale: [1, 1.1, 1.05, 1.1, 1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 opacity-20">
        <motion.div 
          className="w-56 h-56 rounded-full bg-white"
          initial={{ x: -100, y: 100, opacity: 0.1 }}
          animate={{ 
            x: -50, 
            y: 50,
            opacity: 0.2,
            scale: [1, 1.15, 1, 1.05, 1],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <motion.div 
          className="max-w-3xl md:flex-1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-3xl md:text-5xl font-bold font-heading mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Bem-vindo à Igreja Batista Independente
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Comunidade de fé e amor em Parnaíba, compartilhando a palavra 
            de Deus e fortalecendo vidas.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link href="/about">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-primary hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition shadow-lg">
                  <FiInfo className="mr-2" />
                  Conheça Nossa Igreja
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/calendar">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-accent text-neutral-text hover:bg-yellow-500 font-semibold px-6 py-3 rounded-md transition shadow-lg">
                  <FiCalendar className="mr-2" />
                  Próximos Eventos
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden md:block md:flex-1 mt-8 md:mt-0 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative h-56 w-56 xl:h-72 xl:w-72 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full bg-white/10"
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            ></motion.div>
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img 
                src={pombaImage}
                alt="Espírito Santo" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
