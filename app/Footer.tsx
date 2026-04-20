'use client'

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 mt-auto border-t border-neutral-200 dark:border-white/5 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-500 tracking-tight">
            © {new Date().getFullYear()} <span className="text-neutral-900 dark:text-white font-bold">Ramsurya M</span>. Crafted with precision.
          </p>
        </div>
        <div className="flex gap-8">
          {[
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ramsurya2614/' },
            { label: 'GitHub', href: 'https://github.com/Ramsurya-M' },
            { label: 'Twitter', href: 'https://x.com/M_Ramsurya' }
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              target="_blank"
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
