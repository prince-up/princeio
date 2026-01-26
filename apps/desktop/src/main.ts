import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import { io, Socket } from 'socket.io-client';
import robot from 'robotjs';
import * as path from 'path';
import 'dotenv/config';

const API_URL = process.env.API_URL || 'http://localhost:4000';
const SIGNALING_URL = process.env.SIGNALING_URL || 'http://localhost:4100';

let mainWindow: BrowserWindow | null = null;
let socket: Socket | null = null;
let sessionCode: string = '';
let isControlEnabled = false;

// Create the main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Load a simple HTML interface
    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
        cleanup();
    });
}

// Create session via API
async function createSession(permission: 'view' | 'control') {
    try {
        const response = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permission }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create session: ${response.status}`);
        }

        const data = await response.json();
        sessionCode = data.sessionCode;
        isControlEnabled = permission === 'control';

        // Connect to signaling server
        connectSignaling();

        return data;
    } catch (error) {
        console.error('Create session error:', error);
        throw error;
    }
}

// Connect to signaling server
function connectSignaling() {
    if (socket) return;

    socket = io(SIGNALING_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
        console.log('Connected to signaling server');
        socket?.emit('host:register', { sessionCode });
    });

    socket.on('viewer:joined', () => {
        console.log('Viewer joined the session');
        mainWindow?.webContents.send('viewer-joined');
    });

    // Listen for control events from viewer
    socket.on('control:event', (event: any) => {
        if (!isControlEnabled) return;
        handleControlEvent(event);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from signaling server');
    });
}

// Handle control events (mouse, keyboard)
function handleControlEvent(event: any) {
    try {
        const { type, x, y, button, key, keyCode, modifiers } = event;

        switch (type) {
            case 'mousemove':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(x, y);
                }
                break;

            case 'mousedown':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(x, y);
                    robot.mouseToggle('down', button || 'left');
                }
                break;

            case 'mouseup':
                robot.mouseToggle('up', button || 'left');
                break;

            case 'click':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(x, y);
                    robot.mouseClick(button || 'left');
                }
                break;

            case 'dblclick':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(x, y);
                    robot.mouseClick(button || 'left', true);
                }
                break;

            case 'scroll':
                const { deltaY } = event;
                if (typeof deltaY === 'number') {
                    robot.scrollMouse(0, deltaY > 0 ? -3 : 3);
                }
                break;

            case 'keydown':
                if (key) {
                    // Handle modifier keys
                    const mods = modifiers || [];
                    if (mods.length > 0) {
                        robot.keyToggle(key, 'down', mods);
                    } else {
                        robot.keyToggle(key, 'down');
                    }
                }
                break;

            case 'keyup':
                if (key) {
                    robot.keyToggle(key, 'up');
                }
                break;

            case 'keypress':
                if (key) {
                    robot.keyTap(key, modifiers || []);
                }
                break;

            case 'type':
                const { text } = event;
                if (text) {
                    robot.typeString(text);
                }
                break;

            default:
                console.log('Unknown control event type:', type);
        }
    } catch (error) {
        console.error('Error handling control event:', error);
    }
}

// Cleanup
function cleanup() {
    if (socket) {
        socket.emit('session:terminate', { sessionCode });
        socket.disconnect();
        socket = null;
    }
}

// IPC handlers
ipcMain.handle('create-session', async (event, permission: 'view' | 'control') => {
    return await createSession(permission);
});

ipcMain.handle('get-session-code', () => {
    return sessionCode;
});

ipcMain.handle('terminate-session', () => {
    cleanup();
    return { success: true };
});

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', () => {
    cleanup();
});
