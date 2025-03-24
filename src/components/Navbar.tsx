
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tighter transition-opacity hover:opacity-80"
          >
            <span className="text-gradient">Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {['Features', 'About', 'Pricing', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`#${item.toLowerCase()}`}
                className="text-sm font-medium hover:text-primary transition-all"
              >
                {item}
              </Link>
            ))}
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-primary text-white text-sm font-medium transition-all hover:bg-primary/90"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Navigation Trigger */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 transition-transform" />
            ) : (
              <Menu className="h-6 w-6 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex flex-col space-y-4">
              {['Features', 'About', 'Pricing', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`#${item.toLowerCase()}`}
                  className="text-sm font-medium py-2 hover:text-primary transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link
                to="/login"
                className="px-5 py-2 rounded-full bg-primary text-white text-sm font-medium transition-all hover:bg-primary/90"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
