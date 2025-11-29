# VaultHeir Desktop Application

Standalone desktop application for VaultHeir using Electron.

## Prerequisites

- Node.js 18+ installed
- npm or yarn

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode (connects to dev server)
npm run dev

# Or just start Electron (assumes server is running)
npm start
```

## Building Distributable

### Build for Current Platform

```bash
npm run build
```

### Build for Specific Platform

```bash
# Windows (.exe installer + portable)
npm run build:win

# macOS (.dmg)
npm run build:mac

# Linux (.AppImage + .deb)
npm run build:linux

# All platforms
npm run build:all
```

## Output Files

Built applications are saved to `dist/`:

| Platform | File | Type |
|----------|------|------|
| Windows | `VaultHeir-1.0.0-Windows.exe` | NSIS Installer |
| Windows | `VaultHeir-1.0.0-Windows.exe` | Portable |
| macOS | `VaultHeir-1.0.0-Mac.dmg` | Disk Image |
| Linux | `VaultHeir-1.0.0-Linux.AppImage` | AppImage |
| Linux | `VaultHeir-1.0.0-Linux.deb` | Debian Package |

## Adding App Icons

Place your icons in the `assets/` folder:

```
assets/
├── icon.ico          # Windows (256x256)
├── icon.icns         # macOS
├── icon.png          # General (512x512)
└── icons/            # Linux (multiple sizes)
    ├── 16x16.png
    ├── 32x32.png
    ├── 48x48.png
    ├── 64x64.png
    ├── 128x128.png
    ├── 256x256.png
    └── 512x512.png
```

### Generate Icons

You can use tools like:
- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
- [png2icons](https://www.npmjs.com/package/png2icons)

```bash
# Example with electron-icon-builder
npx electron-icon-builder --input=./assets/icon.png --output=./assets
```

## Development

### Project Structure

```
electron-desktop/
├── main.js           # Main process
├── preload.js        # Preload script (secure bridge)
├── splash.html       # Loading screen
├── offline.html      # Offline fallback
├── package.json      # Electron config & build settings
├── assets/           # App icons
└── dist/             # Built applications
```

### How It Works

1. **Splash Screen**: Shows while Next.js server starts
2. **Server Start**: Bundled Next.js server runs on port 3000
3. **Main Window**: Loads the web app from localhost
4. **Menu**: Custom menu with navigation and help

## Customization

### Change App Name/ID

Edit `package.json`:

```json
{
  "name": "your-app-name",
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name"
  }
}
```

### Window Settings

Edit `main.js` `createMainWindow()`:

```javascript
mainWindow = new BrowserWindow({
  width: 1400,      // Default width
  height: 900,      // Default height
  minWidth: 1024,   // Minimum width
  minHeight: 768    // Minimum height
});
```

## Troubleshooting

### Build Fails on Windows

Install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

### Server Won't Start

Ensure the Next.js app builds with standalone output:

```javascript
// next.config.js
module.exports = {
  output: 'standalone'
}
```

### App Shows White Screen

1. Check if server is running on port 3000
2. Look at DevTools console (View > Toggle Developer Tools)
3. Check main process logs in terminal
