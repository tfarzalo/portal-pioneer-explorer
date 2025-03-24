
import { useEffect, useRef } from 'react';
import { Maximize2, Zap, Shield, RefreshCw } from 'lucide-react';

const featureData = [
  {
    icon: <Maximize2 className="h-10 w-10 mb-6" />,
    title: "Minimalist Design",
    description: "Clean, uncluttered interface that keeps the focus on what matters most.",
  },
  {
    icon: <Zap className="h-10 w-10 mb-6" />,
    title: "Lightning Fast",
    description: "Optimized performance ensures a smooth experience on any device.",
  },
  {
    icon: <Shield className="h-10 w-10 mb-6" />,
    title: "Secure & Private",
    description: "Advanced security measures keep your data protected at all times.",
  },
  {
    icon: <RefreshCw className="h-10 w-10 mb-6" />,
    title: "Seamless Updates",
    description: "Continuous improvements delivered automatically without disruption.",
  },
];

const Features = () => {
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
    elementsToAnimate?.forEach((el, index) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      // Add staggered delay to each element
      (el as HTMLElement).style.transitionDelay = `${index * 100}ms`;
      observer.observe(el);
    });
    
    return () => {
      elementsToAnimate?.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section 
      id="features"
      ref={sectionRef}
      className="py-24 bg-accent/20"
    >
      <div className="container mx-auto px-6">
        <div className="animate-on-scroll text-center mb-16">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Designed with precision
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every aspect of Portal has been crafted with attention to detail, creating an experience that's both beautiful and functional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureData.map((feature, index) => (
            <div 
              key={index}
              className="animate-on-scroll bg-card border p-8 rounded-xl flex flex-col items-center text-center transition-all hover:shadow-md"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
