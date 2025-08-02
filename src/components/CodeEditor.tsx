import React from 'react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
    value, 
    onChange, 
    language, 
    placeholder = `Enter your ${language} code here...` 
}) => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none outline-none border-none placeholder-gray-500"
                    style={{
                        fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                        lineHeight: '1.5',
                        tabSize: 2,
                    }}
                    spellCheck={false}
                />
            </div>
        </div>
    );
};

export default CodeEditor;