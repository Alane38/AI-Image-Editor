import React, { useState, useCallback, useRef, useMemo } from 'react';
import type { ImageFile, HistoryItem } from './types';
import { editImage } from './services/geminiService';

// --- NOUVEAUX COMPOSANTS UI MODERNES ---

const Logo: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7"/>
                <stop offset="1" stopColor="#d946ef"/>
            </linearGradient>
        </defs>
        <path d="M12 2L9.40002 9.40002L2 12L9.40002 14.6L12 22L14.6 14.6L22 12L14.6 9.40002L12 2Z" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-slate-900/80 flex justify-center items-center rounded-2xl z-20 backdrop-blur-sm">
        <svg className="animate-spin h-10 w-10 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ImageUploadArea: React.FC<{ onImageUpload: (file: File) => void; }> = ({ onImageUpload }) => {
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault(); event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            onImageUpload(event.dataTransfer.files[0]);
        }
    };
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.stopPropagation(); };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageUpload(event.target.files[0]);
        }
    };
    return (
        <div className="w-full max-w-2xl text-center">
            <input type="file" id="file-upload" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
            <label htmlFor="file-upload" onDrop={handleDrop} onDragOver={handleDragOver} className="w-full aspect-video bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col justify-center items-center text-slate-400 cursor-pointer hover:border-violet-500 hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <h2 className="text-2xl font-bold text-slate-200">Déposez votre image ici</h2>
                <p className="text-slate-500 mt-1">ou cliquez pour la sélectionner</p>
            </label>
        </div>
    );
};

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-700 rounded-lg overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-slate-800/60 hover:bg-slate-800 transition-colors">
                <span className="font-semibold text-slate-200">{title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && <div className="p-3 bg-slate-900/50">{children}</div>}
        </div>
    );
}

const InspirationUpload: React.FC<{ inspirationImage: ImageFile | null, onInspirationUpload: (file: File) => void, onRemove: () => void, onDrop: (e: React.DragEvent) => void }> = ({ inspirationImage, onInspirationUpload, onRemove, onDrop }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) onInspirationUpload(e.target.files[0]); };
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
    const handleDrop = (e: React.DragEvent) => { setIsDragOver(false); onDrop(e); };

    if (inspirationImage) {
        return (
            <div className="relative group">
                <img src={`data:${inspirationImage.mimeType};base64,${inspirationImage.base64}`} alt="Inspiration" className="w-full h-28 object-cover rounded-md" />
                <button onClick={onRemove} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 leading-none opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
            </div>
        )
    }
    return (
        <>
            <input type="file" id="inspiration-upload" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
            <label htmlFor="inspiration-upload" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`w-full h-28 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-slate-500 hover:border-violet-500 hover:text-white transition-colors cursor-pointer ${isDragOver ? 'border-violet-500 text-white' : 'border-slate-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                <span className="text-sm mt-1">Ajouter ou déposer</span>
            </label>
        </>
    )
}

const ImageHistoryList: React.FC<{ history: HistoryItem[], currentIndex: number | null, onSelect: (index: number) => void, selectedIndices: Set<number>, onToggleSelection: (index: number) => void, onDragStart: (e: React.DragEvent, index: number) => void }> = ({ history, currentIndex, onSelect, selectedIndices, onToggleSelection, onDragStart }) => (
    <div className="space-y-2">
        {history.map((item, index) => (
            <div key={index} draggable="true" onDragStart={(e) => onDragStart(e, index)} onClick={() => onSelect(index)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${currentIndex === index ? 'bg-violet-500/20' : 'hover:bg-slate-700/50'}`}>
                <img src={`data:${item.image.mimeType};base64,${item.image.base64}`} alt={`Version ${index + 1}`} className={`w-12 h-12 object-cover rounded-md flex-shrink-0 ${currentIndex === index ? 'ring-2 ring-violet-400' : ''}`} />
                <div className="truncate flex-grow">
                    <p className="text-sm text-slate-300 font-medium truncate">{item.prompt || 'Image Originale'}</p>
                    <p className="text-xs text-slate-500">Version {index + 1}</p>
                </div>
                <input type="checkbox" checked={selectedIndices.has(index)} onChange={(e) => { e.stopPropagation(); onToggleSelection(index); }} className="h-5 w-5 rounded text-violet-500 bg-slate-800 border-slate-600 focus:ring-violet-500 cursor-pointer flex-shrink-0" />
            </div>
        ))}
    </div>
);

// --- COMPOSANT PRINCIPAL DE L'APPLICATION ---

const App: React.FC = () => {
    const [imageHistory, setImageHistory] = useState<HistoryItem[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
    const [inspirationImage, setInspirationImage] = useState<ImageFile | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const currentImage = useMemo(() => currentImageIndex !== null ? imageHistory[currentImageIndex].image : null, [imageHistory, currentImageIndex]);

    const importFiles = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;
        const filesArray = Array.from(files).filter(file => file.type.startsWith('image/'));

        filesArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                const newImage: ImageFile = { base64: base64String, mimeType: file.type, name: file.name };
                const newHistoryItem: HistoryItem = { image: newImage, prompt: null };

                setImageHistory(prev => {
                    const wasEmpty = prev.length === 0;
                    const newState = [...prev, newHistoryItem];
                    if (wasEmpty) {
                        setCurrentImageIndex(0);
                    }
                    return newState;
                });
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const handleFilesImported = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        importFiles(event.target.files);
        if (event.target) event.target.value = '';
    }, [importFiles]);

    const handleImageUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            const newImage: ImageFile = { base64: base64String, mimeType: file.type, name: file.name };
            setImageHistory([{ image: newImage, prompt: null }]);
            setCurrentImageIndex(0);
            setInspirationImage(null); setError(null); setPrompt('');
        };
        reader.readAsDataURL(file);
    }, []);

    const handleInspirationUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setInspirationImage({ base64: base64String, mimeType: file.type, name: file.name });
        };
        reader.readAsDataURL(file);
    }, []);

    const handleStartOver = () => {
        setImageHistory([]); setCurrentImageIndex(null); setInspirationImage(null);
        setError(null); setPrompt(''); setSelectedIndices(new Set());
    };

    const handleGenerate = useCallback(async () => {
        if (!currentImage || !prompt.trim() || isLoading) return;
        setIsLoading(true); setError(null);
        try {
            const newImageBase64 = await editImage(currentImage, prompt, inspirationImage);
            const newImage: ImageFile = { ...currentImage, base64: newImageBase64 };
            const newHistoryItem: HistoryItem = { image: newImage, prompt };
            setImageHistory(prev => [...prev, newHistoryItem]);
            setCurrentImageIndex(imageHistory.length);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Une erreur inconnue est survenue.");
        } finally {
            setIsLoading(false);
        }
    }, [currentImage, prompt, inspirationImage, imageHistory.length, isLoading]);

    const handleSelectHistoryItem = useCallback((index: number) => {
        setCurrentImageIndex(index);
        setPrompt(imageHistory[index].prompt ?? '');
    }, [imageHistory]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } };
    const handleToggleSelection = (index: number) => { setSelectedIndices(prev => { const newSet = new Set(prev); if (newSet.has(index)) newSet.delete(index); else newSet.add(index); return newSet; }); };
    const handleDragStartHistoryItem = (e: React.DragEvent, index: number) => { e.dataTransfer.setData('historyIndex', String(index)); };
    
    const handleDropOnInspiration = (e: React.DragEvent) => {
        e.preventDefault();
        
        const indexStr = e.dataTransfer.getData('historyIndex');
        if (indexStr !== '') {
            const index = parseInt(indexStr, 10);
            if (imageHistory[index]) {
                setInspirationImage(imageHistory[index].image);
                return;
            }
        }

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                handleInspirationUpload(file);
            }
        }
    };
    
    const handleDragOverApp = (e: React.DragEvent) => { e.preventDefault(); setIsDraggingOver(true); };
    const handleDragLeaveApp = () => setIsDraggingOver(false);
    
    const handleDropApp = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files.length > 0) {
             if (imageHistory.length === 0) {
                // If no session is active, start a new one with all dropped files.
                setInspirationImage(null);
                setError(null);
                setPrompt('');
                setSelectedIndices(new Set());
                importFiles(e.dataTransfer.files);
            } else {
                // If a session is active, add the files to the current history.
                importFiles(e.dataTransfer.files);
            }
        }
    };

    const handleExportSelected = useCallback(async () => {
      if (selectedIndices.size === 0) return;
      setIsExporting(true);
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        selectedIndices.forEach(index => {
          const item = imageHistory[index];
          if (item) {
            const ext = item.image.mimeType.split('/')[1] || 'png';
            zip.file(`image_${index + 1}.${ext}`, item.image.base64, { base64: true });
            if(item.prompt) zip.file(`image_${index + 1}_prompt.txt`, item.prompt);
          }
        });
        const blob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ai-images-${selectedIndices.size}-selection.zip`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (err) {
        setError("L'exportation des images a échoué.");
      } finally {
        setIsExporting(false);
      }
    }, [imageHistory, selectedIndices]);

    return (
        <div onDragOver={handleDragOverApp} onDragLeave={handleDragLeaveApp} onDrop={handleDropApp} className="flex h-screen w-screen bg-slate-900 text-slate-300 font-['Inter'] antialiased">
            {isDraggingOver && <div className="absolute inset-0 bg-violet-500/10 border-4 border-dashed border-violet-400 rounded-2xl z-30 pointer-events-none flex items-center justify-center backdrop-blur-sm"><p className="text-2xl font-bold text-violet-300">Déposer une image</p></div>}
            
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative transition-all duration-300">
                {imageHistory.length === 0 ? (
                    <ImageUploadArea onImageUpload={handleImageUpload} />
                ) : (
                    <div className="w-full h-full relative flex items-center justify-center">
                        {isLoading && <LoadingSpinner />}
                        {currentImage && <img src={`data:${currentImage.mimeType};base64,${currentImage.base64}`} alt="Current" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-black/50" />}
                    </div>
                )}
            </div>

            <aside className={`w-[380px] bg-slate-800/50 border-l border-slate-700 flex flex-col transition-transform duration-500 ${imageHistory.length > 0 ? 'translate-x-0' : 'translate-x-full'}`}>
                {imageHistory.length > 0 && (
                    <>
                        <div className="p-6 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <Logo />
                                <h1 className="text-xl font-bold text-white">AI Image Studio</h1>
                            </div>
                        </div>
                        
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            <div>
                                <label htmlFor="prompt" className="block text-sm font-semibold text-slate-300 mb-2">Prompt</label>
                                <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ex: Rends le ciel étoilé..." className="w-full h-28 p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none transition resize-none disabled:opacity-50" disabled={isLoading} />
                            </div>

                            <Accordion title="Inspiration (Optionnel)">
                                <InspirationUpload inspirationImage={inspirationImage} onInspirationUpload={handleInspirationUpload} onRemove={() => setInspirationImage(null)} onDrop={handleDropOnInspiration} />
                            </Accordion>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-sm font-semibold text-slate-300">HISTORIQUE</h2>
                                    <div className="flex items-center gap-2">
                                        <input type="file" ref={importInputRef} onChange={handleFilesImported} multiple accept="image/*" className="hidden" />
                                        <button onClick={() => importInputRef.current?.click()} className="text-xs bg-slate-700 text-slate-300 font-semibold py-1 px-3 rounded-md hover:bg-slate-600 transition-colors">
                                            Importer
                                        </button>
                                        <button onClick={handleExportSelected} disabled={isExporting || selectedIndices.size === 0} className="text-xs bg-slate-700 text-slate-300 font-semibold py-1 px-3 rounded-md hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isExporting ? '...' : `Exporter (${selectedIndices.size})`}
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-96 overflow-y-auto space-y-2 p-1 -m-1">
                                    <ImageHistoryList history={imageHistory} currentIndex={currentImageIndex} onSelect={handleSelectHistoryItem} selectedIndices={selectedIndices} onToggleSelection={handleToggleSelection} onDragStart={handleDragStartHistoryItem} />
                                </div>
                            </div>
                            {error && <p className="text-sm text-red-400 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</p>}
                        </div>

                        <div className="p-6 mt-auto border-t border-slate-700 space-y-3 bg-slate-800/50">
                            <button onClick={handleGenerate} disabled={!prompt.trim() || isLoading} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20">
                                {isLoading ? 'Génération...' : 'Générer'}
                            </button>
                            <button onClick={handleStartOver} className="w-full bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                                Recommencer
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
};

export default App;
