# AI Image Editor

A modern web application for AI-powered image editing using Google Gemini. Transform your images with natural language prompts.

## Features

- **AI Image Editing** - Describe changes in plain text and let Gemini transform your images
- **Style Transfer** - Use an inspiration image to guide the AI's edits
- **Version History** - Track all your edits with full history navigation
- **Batch Export** - Select and download multiple images as a ZIP archive
- **Drag & Drop** - Intuitive file upload with drag and drop support
- **Modern UI** - Clean, responsive interface with dark theme

## Demo

Upload an image and try prompts like:
- "Make the sky a beautiful sunset"
- "Remove the background"
- "Add a vintage film effect"
- "Transform into a watercolor painting"

## Getting Started

### Prerequisites

- Node.js 18+
- A Google AI Studio API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-image-editor.git
cd ai-image-editor
```

2. Install dependencies:
```bash
npm install
```

3. Configure your API key in `.env.local`:
```bash
API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Upload an image** - Drag and drop or click to select a PNG, JPEG, or WebP file
2. **Enter a prompt** - Describe what changes you want to make
3. **Add inspiration (optional)** - Upload a reference image for style guidance
4. **Generate** - Click the button or press Enter to create your edit
5. **Export** - Select versions from history and export as ZIP

## Tech Stack

- [React 19](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Google Gemini](https://ai.google.dev/) - AI image generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [JSZip](https://stuk.github.io/jszip/) - ZIP file generation

## Project Structure

```
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── types.ts             # TypeScript type definitions
├── services/
│   └── geminiService.ts # Gemini API integration
├── vite.config.ts       # Vite configuration
└── .env.local           # Environment variables
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## API Reference

The app uses Google's Gemini 2.5 Flash model for image generation. The API accepts:
- Source image (required)
- Text prompt (required)
- Inspiration image (optional)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Google AI Studio](https://aistudio.google.com/)
- UI inspired by modern design systems
