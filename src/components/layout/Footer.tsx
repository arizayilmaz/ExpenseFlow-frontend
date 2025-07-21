// src/components/layout/Footer.tsx

import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-white">
            <span className="sr-only">GitHub</span>
            <FaGithub className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-white">
            <span className="sr-only">LinkedIn</span>
            <FaLinkedin className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-white">
            <span className="sr-only">Twitter</span>
            <FaTwitter className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-8 text-center text-sm">
          &copy; {currentYear} ExpenseFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;