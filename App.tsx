import React, { useState, useCallback, useRef, useMemo } from "react";
import type { ImageFile, HistoryItem } from "./types";
import { editImage } from "./services/geminiService";

// --- LOGO ---
const Logo: React.FC = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4c4" />
        <stop offset="100%" stopColor="#00baa7" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M18 2L15.2 12.8L4 18L15.2 23.2L18 34L20.8 23.2L32 18L20.8 12.8L18 2Z"
      fill="url(#logoGradient)"
      filter="url(#glow)"
    />
    <circle cx="18" cy="18" r="3" fill="#0a0a0b" />
  </svg>
);

// --- ICONS ---
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 4L12 14M12 4L8 8M12 4L16 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L10.6 8.6L4 10L10.6 11.4L12 18L13.4 11.4L20 10L13.4 8.6L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 18L4.2 20.8L2 20L4.2 19.2L5 16L5.8 19.2L8 20L5.8 20.8L5 18Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 4L18.4 6.4L16 7L18.4 7.6L19 10L19.6 7.6L22 7L19.6 6.4L19 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19M5 12H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon: React.FC<{ className?: string; isOpen?: boolean }> = ({
  className,
  isOpen,
}) => (
  <svg
    className={`${className} transform transition-transform ${isOpen ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4V9H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 20V15H15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.49 9A9 9 0 0 0 5.64 5.64L4 9M4 15L5.64 18.36A9 9 0 0 0 20.49 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 4L12 14M12 14L8 10M12 14L16 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- LOADING SPINNER ---
const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex justify-center items-center rounded-2xl z-20">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
      <SparkleIcon className="w-6 h-6 text-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  </div>
);

// --- IMAGE UPLOAD AREA ---
const ImageUploadArea: React.FC<{ onImageUpload: (file: File) => void }> = ({
  onImageUpload,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageUpload(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
                    group w-full aspect-[16/10] rounded-2xl flex flex-col justify-center items-center cursor-pointer
                    border-2 border-dashed transition-all duration-300
                    ${
                      isDragOver
                        ? "border-teal bg-teal/5 scale-[1.02]"
                        : "border-gray-700 hover:border-gray-600 bg-gray-900/50 hover:bg-gray-900"
                    }
                `}
      >
        <div
          className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
                    ${isDragOver ? "bg-teal/20 scale-110" : "bg-gray-800 group-hover:bg-gray-700"}
                `}
        >
          <UploadIcon
            className={`w-10 h-10 transition-colors ${isDragOver ? "text-teal" : "text-gray-500 group-hover:text-gray-400"}`}
          />
        </div>
        <h2
          className={`text-xl font-semibold mb-2 transition-colors ${isDragOver ? "text-teal" : "text-gray-200"}`}
        >
          {isDragOver ? "Relâchez pour uploader" : "Déposez votre image ici"}
        </h2>
        <p className="text-gray-500 text-sm">
          ou cliquez pour sélectionner un fichier
        </p>
        <p className="text-gray-600 text-xs mt-4">PNG, JPEG, WebP</p>
      </label>
    </div>
  );
};

// --- ACCORDION ---
const Accordion: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-800/50 transition-colors"
      >
        <span className="font-medium text-gray-300">{title}</span>
        <ChevronIcon className="w-5 h-5 text-gray-500" isOpen={isOpen} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>
  );
};

// --- INSPIRATION UPLOAD ---
const InspirationUpload: React.FC<{
  inspirationImage: ImageFile | null;
  onInspirationUpload: (file: File) => void;
  onRemove: () => void;
  onDrop: (e: React.DragEvent) => void;
}> = ({ inspirationImage, onInspirationUpload, onRemove, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onInspirationUpload(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e);
  };

  if (inspirationImage) {
    return (
      <div className="relative group rounded-xl overflow-hidden">
        <img
          src={`data:${inspirationImage.mimeType};base64,${inspirationImage.base64}`}
          alt="Inspiration"
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onRemove}
            className="p-2 bg-gray-900/80 rounded-full hover:bg-red-500/80 transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        type="file"
        id="inspiration-upload"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <label
        htmlFor="inspiration-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
                    w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
                    ${
                      isDragOver
                        ? "border-teal bg-teal/5 text-teal"
                        : "border-gray-700 hover:border-gray-600 text-gray-500 hover:text-gray-400"
                    }
                `}
      >
        <PlusIcon className="w-8 h-8 mb-2" />
        <span className="text-sm">Glissez ou cliquez</span>
      </label>
    </>
  );
};

// --- IMAGE HISTORY LIST ---
const ImageHistoryList: React.FC<{
  history: HistoryItem[];
  currentIndex: number | null;
  onSelect: (index: number) => void;
  selectedIndices: Set<number>;
  onToggleSelection: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
}> = ({
  history,
  currentIndex,
  onSelect,
  selectedIndices,
  onToggleSelection,
  onDragStart,
}) => (
  <div className="space-y-2">
    {history.map((item, index) => (
      <div
        key={index}
        draggable="true"
        onDragStart={(e) => onDragStart(e, index)}
        onClick={() => onSelect(index)}
        className={`
                    group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all
                    ${
                      currentIndex === index
                        ? "bg-teal/10 ring-1 ring-teal/30"
                        : "hover:bg-gray-800/50"
                    }
                `}
      >
        <div className="relative flex-shrink-0">
          <img
            src={`data:${item.image.mimeType};base64,${item.image.base64}`}
            alt={`Version ${index + 1}`}
            className={`
                            w-14 h-14 object-cover rounded-lg transition-all
                            ${currentIndex === index ? "ring-2 ring-teal" : ""}
                        `}
          />
          <div className="absolute -top-1 -left-1">
            <input
              type="checkbox"
              checked={selectedIndices.has(index)}
              onChange={(e) => {
                e.stopPropagation();
                onToggleSelection(index);
              }}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-teal focus:ring-teal focus:ring-offset-0 cursor-pointer"
            />
          </div>
        </div>
        <div className="min-w-0 flex-grow">
          <p className="text-sm text-gray-300 font-medium truncate">
            {item.prompt || "Image originale"}
          </p>
          <p className="text-xs text-gray-600">Version {index + 1}</p>
        </div>
      </div>
    ))}
  </div>
);

// --- MAIN APP ---
const App: React.FC = () => {
  const [imageHistory, setImageHistory] = useState<HistoryItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null,
  );
  const [inspirationImage, setInspirationImage] = useState<ImageFile | null>(
    null,
  );
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const currentImage = useMemo(
    () =>
      currentImageIndex !== null ? imageHistory[currentImageIndex].image : null,
    [imageHistory, currentImageIndex],
  );

  const importFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const filesArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        const newImage: ImageFile = {
          base64: base64String,
          mimeType: file.type,
          name: file.name,
        };
        const newHistoryItem: HistoryItem = { image: newImage, prompt: null };

        setImageHistory((prev) => {
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

  const handleFilesImported = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      importFiles(event.target.files);
      if (event.target) event.target.value = "";
    },
    [importFiles],
  );

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      const newImage: ImageFile = {
        base64: base64String,
        mimeType: file.type,
        name: file.name,
      };
      setImageHistory([{ image: newImage, prompt: null }]);
      setCurrentImageIndex(0);
      setInspirationImage(null);
      setError(null);
      setPrompt("");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInspirationUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      setInspirationImage({
        base64: base64String,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleStartOver = () => {
    setImageHistory([]);
    setCurrentImageIndex(null);
    setInspirationImage(null);
    setError(null);
    setPrompt("");
    setSelectedIndices(new Set());
  };

  const handleGenerate = useCallback(async () => {
    if (!currentImage || !prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const newImageBase64 = await editImage(
        currentImage,
        prompt,
        inspirationImage,
      );
      const newImage: ImageFile = { ...currentImage, base64: newImageBase64 };
      const newHistoryItem: HistoryItem = { image: newImage, prompt };
      setImageHistory((prev) => [...prev, newHistoryItem]);
      setCurrentImageIndex(imageHistory.length);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Une erreur inconnue est survenue.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, prompt, inspirationImage, imageHistory.length, isLoading]);

  const handleSelectHistoryItem = useCallback(
    (index: number) => {
      setCurrentImageIndex(index);
      setPrompt(imageHistory[index].prompt ?? "");
    },
    [imageHistory],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleToggleSelection = (index: number) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const handleDragStartHistoryItem = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("historyIndex", String(index));
  };

  const handleDropOnInspiration = (e: React.DragEvent) => {
    e.preventDefault();
    const indexStr = e.dataTransfer.getData("historyIndex");
    if (indexStr !== "") {
      const index = parseInt(indexStr, 10);
      if (imageHistory[index]) {
        setInspirationImage(imageHistory[index].image);
        return;
      }
    }
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleInspirationUpload(file);
      }
    }
  };

  const handleDragOverApp = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeaveApp = () => setIsDraggingOver(false);

  const handleDropApp = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) {
      if (imageHistory.length === 0) {
        setInspirationImage(null);
        setError(null);
        setPrompt("");
        setSelectedIndices(new Set());
        importFiles(e.dataTransfer.files);
      } else {
        importFiles(e.dataTransfer.files);
      }
    }
  };

  const handleExportSelected = useCallback(async () => {
    if (selectedIndices.size === 0) return;
    setIsExporting(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      selectedIndices.forEach((index) => {
        const item = imageHistory[index];
        if (item) {
          const ext = item.image.mimeType.split("/")[1] || "png";
          zip.file(`image_${index + 1}.${ext}`, item.image.base64, {
            base64: true,
          });
          if (item.prompt)
            zip.file(`image_${index + 1}_prompt.txt`, item.prompt);
        }
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `ai-images-${selectedIndices.size}-selection.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError("L'exportation des images a échoué.");
    } finally {
      setIsExporting(false);
    }
  }, [imageHistory, selectedIndices]);

  return (
    <div
      onDragOver={handleDragOverApp}
      onDragLeave={handleDragLeaveApp}
      onDrop={handleDropApp}
      className="flex h-screen w-screen bg-gray-950 text-gray-300"
    >
      {/* Drag overlay */}
      {isDraggingOver && (
        <div className="fixed inset-4 bg-teal/5 border-2 border-dashed border-teal rounded-3xl z-50 pointer-events-none flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <UploadIcon className="w-16 h-16 text-teal mx-auto mb-4" />
            <p className="text-2xl font-semibold text-teal">
              Déposez votre image
            </p>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {imageHistory.length === 0 ? (
          <ImageUploadArea onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {currentImage && (
              <img
                src={`data:${currentImage.mimeType};base64,${currentImage.base64}`}
                alt="Current"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-black/50"
              />
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={`
                w-[400px] bg-gray-900/50 border-l border-gray-800/50 flex flex-col
                transition-transform duration-500 ease-out
                ${imageHistory.length > 0 ? "translate-x-0" : "translate-x-full"}
            `}
      >
        {imageHistory.length > 0 && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <Logo />
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    AI Image Editor
                  </h1>
                  <p className="text-xs text-gray-500">Powered by Gemini</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Prompt */}
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-gray-400 mb-3"
                >
                  Décrivez votre modification
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: Transforme le ciel en coucher de soleil..."
                  disabled={isLoading}
                  className="
                                        w-full h-28 p-4 bg-gray-900/70 border border-gray-800 rounded-xl
                                        text-gray-200 placeholder-gray-600 resize-none
                                        focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal/50
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    "
                />
              </div>

              {/* Inspiration */}
              <Accordion title="Image d'inspiration (optionnel)">
                <InspirationUpload
                  inspirationImage={inspirationImage}
                  onInspirationUpload={handleInspirationUpload}
                  onRemove={() => setInspirationImage(null)}
                  onDrop={handleDropOnInspiration}
                />
              </Accordion>

              {/* History */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Historique
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={importInputRef}
                      onChange={handleFilesImported}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => importInputRef.current?.click()}
                      className="
                                                flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                                                bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700
                                                transition-colors
                                            "
                    >
                      <UploadIcon className="w-3.5 h-3.5" />
                      Importer
                    </button>
                    <button
                      onClick={handleExportSelected}
                      disabled={isExporting || selectedIndices.size === 0}
                      className="
                                                flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                                                bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700
                                                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                            "
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      {isExporting
                        ? "..."
                        : `Exporter (${selectedIndices.size})`}
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto pr-1">
                  <ImageHistoryList
                    history={imageHistory}
                    currentIndex={currentImageIndex}
                    onSelect={handleSelectHistoryItem}
                    selectedIndices={selectedIndices}
                    onToggleSelection={handleToggleSelection}
                    onDragStart={handleDragStartHistoryItem}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800/50 space-y-3 bg-gray-900/30">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className="
                                    w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl
                                    bg-teal text-gray-950 font-semibold
                                    hover:bg-teal-400 active:scale-[0.98]
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                                    shadow-lg shadow-teal/20
                                "
              >
                <SparkleIcon className="w-5 h-5" />
                {isLoading ? "Génération en cours..." : "Générer"}
              </button>
              <button
                onClick={handleStartOver}
                className="
                                    w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                                    bg-gray-800/50 text-gray-400 font-medium border border-gray-700/50
                                    hover:bg-gray-800 hover:text-gray-300
                                "
              >
                <RefreshIcon className="w-4 h-4" />
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
