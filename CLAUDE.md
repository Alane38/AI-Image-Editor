# AI Image Editor

## Project Overview

AI-powered image editing application using Google Gemini's image generation capabilities. Users can upload images and transform them using natural language prompts.

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **AI**: Google Gemini API (`@google/genai`) - Model: `gemini-2.5-flash-image`
- **Styling**: Tailwind CSS (inline classes) with Geist font
- **Export**: JSZip for batch image downloads

## Design System

- **Colors**: Teal (#00baa7) accent on dark gray (#0a0a0b) background
- **Font**: Geist (Google Fonts)
- **Style**: Inspired by c15t.com - modern, clean, minimal

## Project Structure

```
ai-image-editor/
├── App.tsx              # Main React component with all UI logic
├── index.tsx            # React entry point
├── index.html           # HTML template with Tailwind config
├── logo.svg             # Application logo (teal sparkle)
├── types.ts             # TypeScript interfaces (ImageFile, HistoryItem)
├── services/
│   └── geminiService.ts # Gemini API integration
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── .env.local           # Environment variables (API_KEY)
```

## Key Components (App.tsx)

- `Logo` - SVG sparkle logo with teal gradient and glow effect
- `ImageUploadArea` - Drag & drop / click to upload initial image
- `InspirationUpload` - Optional reference image for style transfer
- `ImageHistoryList` - Version history with selection checkboxes
- `Accordion` - Collapsible UI sections
- `LoadingSpinner` - Generation progress indicator with sparkle icon
- Icon components: `UploadIcon`, `SparkleIcon`, `PlusIcon`, `ChevronIcon`, `RefreshIcon`, `DownloadIcon`, `CloseIcon`

## Core Features

1. **Image Upload**: Drag & drop or file picker (PNG, JPEG, WebP)
2. **AI Editing**: Text prompts sent to Gemini with source image
3. **Style Transfer**: Optional inspiration image for guided edits
4. **Version History**: All generated versions stored in session
5. **Batch Export**: ZIP download of selected images with prompts

## Environment Variables

```bash
API_KEY=your_gemini_api_key  # Required - Google AI Studio API key
```

## Commands

```bash
npm install   # Install dependencies
npm run dev   # Start dev server (default: http://localhost:5173)
npm run build # Production build
npm run preview # Preview production build
```

## API Integration

The `editImage` function in `services/geminiService.ts`:
- Accepts source image, prompt, and optional inspiration image
- Returns base64-encoded generated image
- Handles safety filtering and error cases

## UI Language

Interface is in French (prompts, labels, error messages).

## Development Notes

- Single-file component architecture (App.tsx contains all UI)
- State managed with React hooks (useState, useCallback, useMemo)
- No external state management library
- Images stored as base64 in memory (no persistence)
- Custom SVG icons inline in components
- Tailwind config defined in index.html script tag
