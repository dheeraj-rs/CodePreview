import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import EditorTabs from './components/EditorTabs';
import CodeEditor from './components/CodeEditor';
import PreviewPanel from './components/PreviewPanel';
import ResizablePanel from './components/ResizablePanel';

export const INITIAL_HTML = `<div class="min-h-screen bg-gray-900 text-white">
<nav class="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
    <div class="flex justify-between items-center">
      <div class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        InnovateTech
      </div>
      <div class="hidden md:flex space-x-6 lg:space-x-8">
        <a href="#home" class="hover:text-blue-400 transition-colors duration-300 text-sm lg:text-base">Home</a>
        <a href="#about" class="hover:text-blue-400 transition-colors duration-300 text-sm lg:text-base">About</a>
        <a href="#services" class="hover:text-blue-400 transition-colors duration-300 text-sm lg:text-base">Services</a>
        <a href="#contact" class="hover:text-blue-400 transition-colors duration-300 text-sm lg:text-base">Contact</a>
      </div>
      <div class="md:hidden">
        <input type="checkbox" id="mobile-menu-toggle" class="absolute opacity-0 peer">
        <label for="mobile-menu-toggle" class="p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer block relative z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
        <div class="absolute top-full left-0 right-0 mt-4 mx-4 bg-gray-900/95 backdrop-blur-lg rounded-lg border border-gray-700 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300 transform translate-y-2 peer-checked:translate-y-0">
          <div class="px-4 py-6 space-y-4">
            <a href="#home" class="block py-2 hover:text-blue-400 transition-colors duration-300 border-b border-gray-700">Home</a>
            <a href="#about" class="block py-2 hover:text-blue-400 transition-colors duration-300 border-b border-gray-700">About</a>
            <a href="#services" class="block py-2 hover:text-blue-400 transition-colors duration-300 border-b border-gray-700">Services</a>
            <a href="#contact" class="block py-2 hover:text-blue-400 transition-colors duration-300">Contact</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
<main class="pt-20 min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center">
      <h1 class="text-4xl sm:text-6xl font-bold mb-6">
        <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Innovation
        </span>
        <br>
        Meets Technology
      </h1>
      <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Building the future with cutting-edge solutions and creative excellence
      </p>
      <button class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
        Get Started
      </button>
    </div>
  </div>

const INITIAL_CSS = \`body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Additional custom styles */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Smooth animations */
* {
  scroll-behavior: smooth;
}

/* Custom hover effects */
button:hover {
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}`;

export const INITIAL_JS = `// Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add click effect to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  console.log('🚀 InnovateTech website loaded successfully!');
});`;

function App() {
    const [activeTab, setActiveTab] = useState('html');
    const [htmlCode, setHtmlCode] = useState(INITIAL_HTML);
    const [cssCode, setCssCode] = useState('');
    const [jsCode, setJsCode] = useState(INITIAL_JS);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    const getCurrentCode = () => {
        switch (activeTab) {
            case 'html': return htmlCode;
            case 'css': return cssCode;
            case 'js': return jsCode;
            default: return '';
        }
    };

    const setCurrentCode = (value: string) => {
        switch (activeTab) {
            case 'html': setHtmlCode(value); break;
            case 'css': setCssCode(value); break;
            case 'js': setJsCode(value); break;
        }
    };

    const editorPanel = (
        <div className="h-full flex flex-col bg-gray-800">
            <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1">
                <CodeEditor
                    value={getCurrentCode()}
                    onChange={setCurrentCode}
                    language={activeTab}
                />
            </div>
        </div>
    );

    const previewPanel = (
        <PreviewPanel
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            onRefresh={handleRefresh}
            refreshKey={refreshKey}
        />
    );

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            <Header />
            <div className="flex-1 overflow-hidden">
                <ResizablePanel
                    leftPanel={editorPanel}
                    rightPanel={previewPanel}
                    initialLeftWidth={50}
                    minLeftWidth={30}
                    maxLeftWidth={70}
                />
            </div>
        </div>
    );
}

export default App;