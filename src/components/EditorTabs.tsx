import React from 'react';
import { Code, Palette, Zap } from 'lucide-react';

interface EditorTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'html', label: 'HTML', icon: Code },
    { id: 'css', label: 'CSS', icon: Palette },
    { id: 'js', label: 'JS', icon: Zap },
];

const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex bg-gray-800 border-b border-gray-700">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                            activeTab === tab.id
                                ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                        }`}
                    >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default EditorTabs;