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
          <span className="material-icons text-4xl mb-4">format_quote</span>
          <blockquote className="text-xl md:text-2xl leading-relaxed mb-6 bible-quote">
            "{quote.text}"
          </blockquote>
          <p className="font-semibold text-lg">{quote.reference}</p>
        </div>
      </div>
    </section>
  );
};

export default BibleQuote;
