import React from 'react';
import { RefreshCw, Monitor, AlertCircle } from 'lucide-react';
import HtmlPreview from './HtmlPreview';

interface PreviewPanelProps {
    htmlCode: string;
    cssCode: string;
    jsCode: string;
    onRefresh: () => void;
    refreshKey: number;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
    htmlCode, 
    cssCode, 
    jsCode, 
    onRefresh, 
    refreshKey 
}) => {
    return (
        <div className="h-full flex flex-col bg-gray-800">
            <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                    <Monitor size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">Preview</span>
                </div>
                <button
                    onClick={onRefresh}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors duration-200"
                >
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                </button>
            </div>
            
            <div className="flex-1 bg-white relative">
                {!htmlCode.trim() && !cssCode.trim() && !jsCode.trim() ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Start coding to see preview</p>
                            <p className="text-sm mt-2">Write HTML, CSS, or JavaScript to see live results</p>
                        </div>
                    </div>
                ) : (
                    <HtmlPreview
                        htmlString={htmlCode}
                        cssString={cssCode}
                        jsString={jsCode}
                        refreshKey={refreshKey}
                        enableTailwind={true}
                        previewScope="code-preview"
                    />
                )}
            </div>
        </div>
    );
};

export default PreviewPanel;