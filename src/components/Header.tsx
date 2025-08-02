import React from 'react';
import { Code2, Github, Twitter, Share2 } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                    <Code2 size={24} className="text-blue-400" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        CodePreview
                    </h1>
                </div>
                
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                        Examples
                    </a>
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                        Docs
                    </a>
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                        About
                    </a>
                </nav>
                
                <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors duration-200">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors duration-200">
                        <Github size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors duration-200">
                        <Twitter size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;