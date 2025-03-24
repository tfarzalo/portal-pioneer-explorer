
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);
    
    const elementsToAnimate = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elementsToAnimate?.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(el);
    });
    
    return () => {
      elementsToAnimate?.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="animate-on-scroll">
            <span className="inline-block py-1 px-3 mb-6 text-xs font-medium bg-accent text-primary rounded-full">
              Introducing Portal
            </span>
          </div>
          
          <h1 className="animate-on-scroll text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-6">
            Experience the web's most <span className="text-gradient">elegant</span> interface
          </h1>
          
          <p className="animate-on-scroll text-muted-foreground text-lg md:text-xl max-w-2xl mb-10">
            A minimalist, intuitive design inspired by the principles of beauty through simplicity.
            Elevated with subtle animations and thoughtful interactions.
          </p>
          
          <div className="animate-on-scroll flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link
              to="/demo"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary text-white font-medium transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Try Demo
            </Link>
            <Link
              to="/learn-more"
              className="w-full sm:w-auto px-8 py-3 rounded-full border border-border bg-transparent font-medium transition-all hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="animate-on-scroll relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
            <div className="aspect-video bg-card p-4 border">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-accent to-secondary/50 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Interface Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
