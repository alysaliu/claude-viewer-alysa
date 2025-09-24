# Claude Prototype Viewer

A lightweight tool for running and previewing Claude-generated React prototypes instantly.

*Based on the original [claude-artifact-runner](https://github.com/claudio-silva/claude-artifact-runner) by claudio-silva.*

## Quick Start

1. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

2. **Open:** `http://localhost:5173`

3. **Use the tool:**
   - **Browse artifacts** → View components in `src/artifacts/`

## How to Use

1. Save `.tsx` files to `src/artifacts/`
2. Refresh the page
3. Click "Launch" to view any component

> 📁 See [src/artifacts/README.md](src/artifacts/README.md) for documentation of available artifacts

## File Requirements

Your `.tsx` files should:
- Export a default React component: `export default MyComponent;`
- Be valid React functional components
- Use standard hooks (useState, useEffect, etc.)

## Example Workflow

1. Ask Claude to create a React component
2. Save the generated `.tsx` code to `src/artifacts/`
3. Refresh the page and preview your component

## Features

- ✅ Artifact browsing and preview
- ✅ Full-screen component rendering  
- ✅ Hot reload during development
- ✅ No complex setup required

Perfect for quickly testing and demoing Claude-generated React prototypes!

## Configuration

### Changing the Port

**Method 1: Command line (temporary)**
```bash
npm run dev:port 3000
```

**Method 2: Edit vite.config.ts (permanent)**
```typescript
server: {
  port: 3000,  // Change this number
  host: true,
}
```

## Requirements

- Node.js 16+
- npm

## License

MIT License
