import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImage from '@/assets/logo.jpg';

interface BibleQuoteProps {
  quote: {
    text: string;
    reference: string;
  };
}

const BibleQuote = ({ quote }: BibleQuoteProps) => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <motion.div 
              className="h-16 w-16 rounded-full overflow-hidden mb-4 mx-auto bg-white p-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={logoImage} 
                alt="IBI Parnaíba Logo" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          <Quote className="mx-auto text-4xl mb-4" />
          <motion.blockquote 
            className="text-xl md:text-2xl leading-relaxed mb-6 bible-quote"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            "{quote.text}"
          </motion.blockquote>
          <motion.p 
            className="font-semibold text-lg text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {quote.reference}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default BibleQuote;
