const { app, BrowserWindow, Menu, shell, dialog, protocol } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

// Check if running in development
const isDev = !app.isPackaged;

let mainWindow;
let splashWindow;
let serverProcess;

// Server port
const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  splashWindow.center();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    backgroundColor: '#0a0a0a'
  });

  // Create application menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { role: 'quit', label: 'Exit VaultHeir' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About VaultHeir',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About VaultHeir',
              message: 'VaultHeir Desktop',
              detail: 'Version 1.0.0\n\nDigital Legacy & IP Asset Management\n\n© 2024 BidayaX LLC'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Visit Website',
          click: () => shell.openExternal('https://vaultheir.com')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    stopServer();
  });

  return mainWindow;
}

function stopServer() {
  if (serverProcess) {
    try {
      serverProcess.kill();
    } catch (e) {
      console.error('Error stopping server:', e);
    }
    serverProcess = null;
  }
}

async function startServer() {
  if (isDev) {
    console.log('Development mode - connect to existing server');
    return true;
  }

  const serverPath = path.join(process.resourcesPath, 'app', 'server.js');
  const serverCwd = path.join(process.resourcesPath, 'app');

  // Check if server.js exists
  if (!fs.existsSync(serverPath)) {
    console.error('Server file not found:', serverPath);
    return false;
  }

  console.log('Starting server from:', serverPath);
  console.log('Working directory:', serverCwd);

  return new Promise((resolve) => {
    // Use Electron's Node.js with ELECTRON_RUN_AS_NODE flag
    serverProcess = spawn(process.execPath, [serverPath], {
      env: {
        ...process.env,
        PORT: PORT.toString(),
        HOSTNAME: 'localhost',
        NODE_ENV: 'production',
        ELECTRON_RUN_AS_NODE: '1'
      },
      cwd: serverCwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true
    });

    let resolved = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Server stdout:', output);
      if (!resolved && (output.includes('Ready') || output.includes('started') || output.includes('Listening') || output.includes('on 0.0.0.0'))) {
        resolved = true;
        resolve(true);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('Server stderr:', data.toString());
    });

    serverProcess.on('error', (error) => {
      console.error('Server process error:', error);
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    });

    serverProcess.on('exit', (code) => {
      console.log('Server exited with code:', code);
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    });

    // Timeout - give server 10 seconds to start
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(true); // Assume it might be ready
      }
    }, 10000);
  });
}

async function waitForServer(maxAttempts = 50) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(SERVER_URL, (res) => {
          resolve(true);
        });
        req.on('error', () => reject());
        req.setTimeout(500, () => {
          req.destroy();
          reject();
        });
      });
      console.log('Server is ready!');
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  console.log('Server check timed out');
  return false;
}

app.whenReady().then(async () => {
  createSplashWindow();
  createMainWindow();

  let serverReady = false;

  try {
    // Start server
    const serverStarted = await startServer();
    console.log('Server start result:', serverStarted);

    if (serverStarted) {
      // Wait for server to be responsive
      serverReady = await waitForServer();
      console.log('Server ready check:', serverReady);
    }
  } catch (error) {
    console.error('Server startup error:', error);
  }

  // Load the appropriate page
  if (serverReady) {
    console.log('Loading from server:', SERVER_URL);
    mainWindow.loadURL(SERVER_URL);
  } else {
    console.log('Loading offline page');
    mainWindow.loadFile(path.join(__dirname, 'offline.html'));
  }

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
    mainWindow.focus();
  });
});

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on('before-quit', () => {
  stopServer();
});
