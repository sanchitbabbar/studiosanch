import { motion } from 'framer-motion';
import Link from 'next/link';

interface ElegantLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const ElegantLink = ({ href, children, className = '', target, rel }: ElegantLinkProps) => {
  const isExternal = href.startsWith('http');
  
  // For external links, use a standard anchor tag
  if (isExternal) {
    return (
      <a href={href} className={`inline-block ${className}`} target={target} rel={rel}>
        <motion.span
          className="relative inline-block group cursor-pointer"
          whileHover={{ 
            letterSpacing: '0.2em',
          }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className="relative z-10 transition-all duration-700 group-hover:text-white">
            {children}
          </span>
          <motion.span
            className="absolute bottom-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-all duration-700"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)'
            }}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
          />
          <motion.span
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[12px] tracking-wider text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-500"
            initial={{ y: -5 }}
            whileHover={{ y: 0 }}
          >
            ⟶
          </motion.span>
        </motion.span>
      </a>
    );
  }
  
  // For internal links, use Next.js Link component
  return (
    <Link href={href} className={`inline-block ${className}`}>
      <motion.span
        className="relative inline-block group cursor-pointer"
        whileHover={{ 
          letterSpacing: '0.2em',
        }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <span className="relative z-10 transition-all duration-700 group-hover:text-white">
          {children}
        </span>
        <motion.span
          className="absolute bottom-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-all duration-700"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)'
          }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
        />
        <motion.span
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[12px] tracking-wider text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-500"
          initial={{ y: -5 }}
          whileHover={{ y: 0 }}
        >
          ⟶
        </motion.span>
      </motion.span>
    </Link>
  );
};
