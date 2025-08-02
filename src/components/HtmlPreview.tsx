import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

interface Snippet {
    _id?: string | undefined;
    language: string;
    code: string;
    version?: string;
    id?: string;
    name?: string;
}

interface HtmlPreviewProps {
    snippets?: Snippet[];
    codeContent?: Record<string, string>;
    refreshKey?: number;
    enableTailwind?: boolean;
    tailwindVersion?: string;
    htmlString?: string | undefined;
    cssString?: string;
    jsString?: string;
    previewScope?: string;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <div className="text-gray-400 text-sm">Loading preview...</div>
        </div>
    </div>
);

const HtmlPreview: React.FC<HtmlPreviewProps> = ({
    snippets = [],
    codeContent = {},
    refreshKey = 0,
    enableTailwind = true,
    tailwindVersion = '3.4.1',
    htmlString,
    cssString,
    jsString,
    previewScope,
}) => {
    const [isCompiling, setIsCompiling] = useState(false);
    const [htmlPreviewKey, setHtmlPreviewKey] = useState(0);
    const [compiledCss, setCompiledCss] = useState<string>('');
    const [cssCompileError, setCssCompileError] = useState<string | null>(null);
    const [jsError, setJsError] = useState<string | null>(null);
    const [tailwindLoaded, setTailwindLoaded] = useState(false);
    const prevCodeContent = useRef<Record<string, string>>({});
    const prevCompiledCss = useRef<string>('');
    const prevStringContent = useRef<{ html?: string; css?: string; js?: string }>({});

    const getSnippetCode = useCallback(
        (snippet: Snippet): string => {
            const snippetId = snippet?.id;
            if (snippetId && codeContent[snippetId] !== undefined) {
                return codeContent[snippetId];
            }
            return snippet.code;
        },
        [codeContent]
    );

    const previewScopeClass = useMemo(() => {
        if (previewScope) return previewScope;
        if (htmlString || cssString || jsString) return `editor-preview-content`;
        return `editor-preview-snippets`;
    }, [previewScope, cssString, htmlString, jsString]);

    useEffect(() => {
        setJsError(null);
        setCssCompileError(null);
        setIsCompiling(true);
        setHtmlPreviewKey((prev) => prev + 1);
        const timer = setTimeout(() => setIsCompiling(false), 500);
        return () => clearTimeout(timer);
    }, [refreshKey]);

    // Load Tailwind CSS via CDN with proper link tag
    useEffect(() => {
        if (!enableTailwind) {
            setTailwindLoaded(true);
            return;
        }

        const linkId = `tailwind-css-${previewScopeClass}`;
        const existingLink = document.getElementById(linkId);
        
        if (existingLink) {
            setTailwindLoaded(true);
            return;
        }

        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://cdn.tailwindcss.com`;
        
        link.onload = () => {
            console.log('Tailwind CSS loaded successfully');
            setTailwindLoaded(true);
        };
        
        link.onerror = () => {
            console.warn('Failed to load Tailwind CSS, continuing without it');
            setTailwindLoaded(true);
        };
        
        document.head.appendChild(link);

        // Cleanup function
        return () => {
            const linkToRemove = document.getElementById(linkId);
            if (linkToRemove && linkToRemove.parentNode) {
                linkToRemove.parentNode.removeChild(linkToRemove);
            }
        };
    }, [previewScopeClass, enableTailwind]);

    useEffect(() => {
        const stringContentChanged =
            prevStringContent.current.html !== htmlString || 
            prevStringContent.current.css !== cssString || 
            prevStringContent.current.js !== jsString;
        
        const hasContentChanged = snippets.some((snippet) => {
            const snippetId = snippet.id || snippet.language;
            const prevContent = prevCodeContent.current[snippetId] || '';
            const currentContent = getSnippetCode(snippet);
            return prevContent !== currentContent;
        });

        if (hasContentChanged || stringContentChanged) {
            setHtmlPreviewKey((prev) => prev + 1);
            snippets.forEach((snippet) => {
                const snippetId = snippet.id || snippet.language;
                prevCodeContent.current[snippetId] = getSnippetCode(snippet);
            });
            prevStringContent.current = {
                html: htmlString,
                css: cssString,
                js: jsString,
            };
        }
    }, [snippets, codeContent, getSnippetCode, htmlString, cssString, jsString]);

    const fixMalformedCSS = (cssCode: string): string => {
        let fixedCss = cssCode;
        let openBraces = 0;
        let closeBraces = 0;
        for (const char of cssCode) {
            if (char === '{') openBraces++;
            if (char === '}') closeBraces++;
        }
        if (openBraces > closeBraces) {
            fixedCss += '}'.repeat(openBraces - closeBraces);
        }
        return fixedCss;
    };

    useEffect(() => {
        const cssSnippet = snippets.find((s) => s.language === 'css');
        const cssSource = cssString || (cssSnippet ? getSnippetCode(cssSnippet) : '');

        if (!cssSource.trim()) {
            if (prevCompiledCss.current) {
                setCompiledCss(prevCompiledCss.current);
            }
            return;
        }
        
        setIsCompiling(true);
        setCssCompileError(null);

        const processStyles = async () => {
            try {
                const fixedCss = fixMalformedCSS(cssSource);
                setCompiledCss(fixedCss);
                prevCompiledCss.current = fixedCss;
            } catch (error) {
                setCssCompileError(error instanceof Error ? error.message : 'CSS compilation error');
            } finally {
                setIsCompiling(false);
            }
        };

        processStyles();
    }, [snippets, codeContent, getSnippetCode, cssString]);

    const htmlPreviewData = useMemo(() => {
        const htmlSnippet = snippets.find((s) => s.language === 'html');
        const jsSnippet = snippets.find((s) => s.language === 'javascript');
        let html = htmlString || (htmlSnippet ? getSnippetCode(htmlSnippet) : '');
        const js = jsString || (jsSnippet ? getSnippetCode(jsSnippet) : '');
        
        // Convert className to class for HTML rendering
        html = html.replace(/className=/g, 'class=');
        
        return {
            html,
            js,
            hasJs: !!js,
        };
    }, [snippets, getSnippetCode, htmlString, jsString]);

    useEffect(() => {
        if (htmlPreviewData.hasJs && !isCompiling && tailwindLoaded) {
            setJsError(null);
            const executeJsTimer = setTimeout(() => {
                try {
                    const htmlContainer = document.getElementById('html-preview-container');
                    if (!htmlContainer) return;
                    
                    const executeScript = new Function(
                        'container',
                        `try {
                            ${htmlPreviewData.js}
                            return null;
                        } catch(e) {
                            return e.message;
                        }`
                    );
                    const errorResult = executeScript(htmlContainer);
                    if (errorResult) {
                        setJsError(errorResult);
                    }
                } catch (error) {
                    setJsError(error instanceof Error ? error.message : 'Unknown JavaScript error');
                }
            }, 100);
            return () => clearTimeout(executeJsTimer);
        }
    }, [htmlPreviewData, isCompiling, tailwindLoaded]);

    if (isCompiling || (enableTailwind && !tailwindLoaded)) {
        return <LoadingIndicator />;
    }

    return (
        <div className={`html-preview ${previewScopeClass} h-full w-full`} key={htmlPreviewKey}>
            {/* Inject custom CSS */}
            {compiledCss && (
                <style dangerouslySetInnerHTML={{ __html: compiledCss }} />
            )}
            
            {/* CSS Error Display */}
            {cssCompileError && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 m-2 rounded text-sm">
                    <strong>CSS Error:</strong>
                    <pre className="mt-1 text-xs overflow-auto">{cssCompileError}</pre>
                </div>
            )}
            
            {/* HTML Content Container */}
            <div
                id="html-preview-container"
                dangerouslySetInnerHTML={{ __html: htmlPreviewData.html }}
                className={`html-content ${previewScopeClass}-content h-full w-full overflow-auto bg-gray-900 text-white relative`}
                style={{ 
                    minHeight: '100%',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    position: 'relative'
                }}
            />
            
            {/* JavaScript Error Display */}
            {jsError && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-900/20 border border-red-500 text-red-400 p-3 rounded text-sm">
                    <strong>JavaScript Error:</strong>
                    <div className="mt-1 text-xs">{jsError}</div>
                </div>
            )}
        </div>
    );
};

export default React.memo(HtmlPreview);