# 🚀 Complete Setup & Usage Guide

## 📋 What You Have Now

Your PrinceIO remote control system has **2 modes**:

### Mode 1: **Web-Only** (Current - Limited Control)
- ✅ Viewer can see the host's screen
- ✅ Viewer can move cursor
- ❌ Clicks/typing don't actually control the host's device
- 💡 Works in browser only

### Mode 2: **Desktop App** (Full Control) ⭐ **RECOMMENDED**
- ✅ Viewer can see the host's screen
- ✅ **Real mouse clicks** on host's device
- ✅ **Real keyboard typing** on host's device
- ✅ **Open files, control everything**
- 💡 Requires desktop app on host's device

---

## 🎯 Quick Start (Web-Only Mode)

This is what you have running now:

### 1. Host Side (Browser)
1. Open `http://localhost:3000`
2. Select "Full control"
3. Click "Create Session"
4. Click "Start Share" (share your screen)
5. Share the session code

### 2. Viewer Side (Another Browser/Tab)
1. Open `http://localhost:3000` in another tab/browser
2. Enter the session code
3. Click "Join"
4. You can see the screen and move cursor, but clicks won't actually control

---

## 🔥 Full Control Setup (Desktop App Mode)

For **REAL** control where clicks and typing actually work:

### Step 1: Install Desktop App Dependencies

```bash
cd apps/desktop
pnpm install
```

**Note**: RobotJS (for OS control) may require:
- **Windows**: Visual Studio Build Tools
- **Mac**: Xcode Command Line Tools
- **Linux**: libxtst-dev, libpng++-dev

If installation fails on Windows:
```bash
npm install --global windows-build-tools
```

### Step 2: Start the Desktop App

```bash
# In apps/desktop directory
pnpm dev
```

This opens a desktop application window.

### Step 3: Create Session in Desktop App

1. In the desktop app window:
   - Select "Full Control"
   - Click "Create Session"
2. Copy the session code shown

### Step 4: Viewer Joins via Web

1. Open `http://localhost:3000` in a browser
2. Enter the session code
3. Click "Join"
4. **Now you have REAL control!** 🎉
   - Clicks actually click on the host's screen
   - Typing actually types
   - Everything works!

---

## 🌐 Deploying to Production

### Option A: Deploy Everything

1. **Deploy Web App** (Vercel/Netlify)
   ```bash
   cd apps/web
   vercel deploy
   ```

2. **Deploy API** (Render/Railway)
   ```bash
   cd apps/api
   # Deploy to Render or Railway
   ```

3. **Deploy Signaling** (Render/Railway)
   ```bash
   cd apps/signaling
   # Deploy to Render or Railway
   ```

4. **Package Desktop App** (For users to download)
   ```bash
   cd apps/desktop
   pnpm add -D electron-builder
   pnpm build
   electron-builder --win --mac --linux
   ```

### Option B: Simple Cloud Deployment

1. Deploy to a cloud VM (AWS, DigitalOcean, etc.)
2. Install Node.js
3. Clone your repo
4. Run `pnpm install && pnpm dev`
5. Use a domain name (e.g., `control.yoursite.com`)

---

## 📱 How Users Will Use Your Site

### Scenario: Remote Tech Support

**Person A (Needs Help)**:
1. Downloads your desktop app from your website
2. Runs the app
3. Clicks "Create Session" with "Full Control"
4. Shares the session code with Person B

**Person B (Tech Support)**:
1. Goes to your website (e.g., `yoursite.com`)
2. Enters the session code
3. Clicks "Join"
4. Can now fully control Person A's computer!

---

## 🔧 Current Status

Right now you have:
- ✅ Web app running on `http://localhost:3000`
- ✅ API server running on `http://localhost:4000`
- ✅ Signaling server running on `http://localhost:4100`
- ⏳ Desktop app created (needs dependencies installed)

---

## 🎮 Testing Full Control

### Test Locally:

1. **Terminal 1**: Keep `pnpm dev` running (web/API/signaling)

2. **Terminal 2**: Start desktop app
   ```bash
   cd apps/desktop
   pnpm install  # First time only
   pnpm dev
   ```

3. **Desktop App**: Create session, get code

4. **Browser**: Go to `localhost:3000`, join with code

5. **Try it**: Click on the video - it should actually click on your desktop!

---

## 🚨 Troubleshooting

### Desktop App Won't Install
```bash
# Windows
npm install --global windows-build-tools

# Mac
xcode-select --install

# Linux (Ubuntu/Debian)
sudo apt-get install libxtst-dev libpng++-dev
```

### Control Not Working
- Make sure you selected "Full Control" when creating session
- Check that desktop app is running (not web browser)
- Verify the "🎮 CONTROL ACTIVE" badge shows in viewer

### Connection Issues
- Check all three servers are running
- Verify .env files are created
- Check firewall settings

---

## 💡 Pro Tips

1. **For Public Use**: Deploy to a domain with HTTPS
2. **Security**: Add authentication to API
3. **Performance**: Use TURN servers for better connectivity
4. **UX**: Add session password protection
5. **Monitoring**: Add analytics to track sessions

---

## 📞 Next Steps

Choose your path:

### Path 1: Test Full Control Locally
```bash
cd apps/desktop
pnpm install
pnpm dev
```

### Path 2: Deploy to Production
- Set up cloud hosting
- Configure domains
- Add SSL certificates
- Package desktop app for distribution

### Path 3: Enhance Features
- Add file transfer
- Add chat functionality
- Add session recording
- Add multi-viewer support

---

## 🎯 Summary

**What works now**: Web-based screen viewing with cursor movement

**What you need for full control**: Install and run the desktop app

**How to test**: 
```bash
cd apps/desktop && pnpm install && pnpm dev
```

Then create a session in the desktop app and join from the browser!

---

Need help? Check the main README.md for more details!
