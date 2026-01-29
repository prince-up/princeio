import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import { io, Socket } from 'socket.io-client';
import robot from 'robotjs';
import * as path from 'path';

// Hardcoded URLs for Production
const API_URL = 'https://princeio-api.onrender.com';
const SIGNALING_URL = 'https://princeio.onrender.com';

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

    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
        cleanup();
    });
}

// Create session via API
async function createSession(permission: 'view' | 'control') {
    try {
        console.log(`Creating session at: ${API_URL}/sessions`);
        const response = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ permission }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed: ${response.status} ${text}`);
        }

        const data = await response.json() as any;
        sessionCode = data.sessionCode;
        isControlEnabled = permission === 'control';

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

    socket.on('webrtc:answer', ({ sdp }) => {
        mainWindow?.webContents.send('webrtc:answer', { sdp });
    });

    socket.on('webrtc:ice', ({ candidate }) => {
        mainWindow?.webContents.send('webrtc:ice', candidate);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from signaling server');
    });
}

// Handle control events (mouse, keyboard)
function handleControlEvent(event: any) {
    try {
        // console.log('Control Event:', event.type); // Uncomment for verbose logging
        const { type, x, y, button, key, keyCode, modifiers } = event;
        const screenSize = robot.getScreenSize();
        const width = screenSize.width;
        const height = screenSize.height;

        // Convert normalized coordinates (0-1) to screen pixels
        const targetX = (x <= 1 ? x * width : x);
        const targetY = (y <= 1 ? y * height : y);

        switch (type) {
            case 'mousemove':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(targetX, targetY);
                }
                break;

            case 'mousedown':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(targetX, targetY);
                    robot.mouseToggle('down', button || 'left');
                }
                break;

            case 'mouseup':
                robot.mouseToggle('up', button || 'left');
                break;

            case 'click':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(targetX, targetY);
                    robot.mouseClick(button || 'left');
                }
                break;

            case 'dblclick':
                if (typeof x === 'number' && typeof y === 'number') {
                    robot.moveMouse(targetX, targetY);
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

// WebRTC Signaling Relay
ipcMain.on('webrtc:offer', (event, { sdp }) => {
    socket?.emit('webrtc:offer', { sessionCode, sdp });
});

ipcMain.on('webrtc:ice', (event, candidate) => {
    socket?.emit('webrtc:ice', { sessionCode, candidate });
});

// IPC handlers
ipcMain.handle('get-sources', async () => {
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    return sources;
});

// IPC handlers
ipcMain.handle('create-session', async (event, data: { permission: 'view' | 'control' }) => {
    const permission = typeof data === 'string' ? data : data.permission;
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
