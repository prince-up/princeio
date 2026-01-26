# 🚀 Deployment Guide: Go Live!

Follow these 3 steps to get PrinceIO running on the internet.

## Step 1: Push to GitHub 🐙

1.  Log in to [GitHub](https://github.com).
2.  Click **"New Repository"** (top right `+` icon).
3.  Name it `princeio`.
4.  Make it **Public** or **Private** (Private is fine).
5.  **Do NOT** initialize with README/gitignore (you already have them).
6.  Click **"Create repository"**.
7.  Copy the commands under **"…or push an existing repository from the command line"**.
    *   It will look like this:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/princeio.git
        git branch -M main
        git push -u origin main
        ```
8.  Run those commands in your VS Code terminal.

---

## Step 2: Deploy Backend (Signaling & API) to Render ☁️

*Vercel is great for the web, but Render is better for Socket.IO (Signaling).*

1.  Go to [dashboard.render.com](https://dashboard.render.com/) and create a free account.
2.  Click **"New +"** → **"Web Service"**.
3.  Connect your GitHub account and select the `princeio` repo.
4.  **Configure the Service**:
    *   **Name**: `princeio-backend`
    *   **Root Directory**: `apps/signaling` (We'll deploy signaling first as it's most critical)
        *   *Note: For a full production setup you might deploy API and Signaling separately, but for testing, let's start with Signaling.*
        *   *Wait, simple monorepo deployment on Render can be tricky. Let's start simple.*
    *   **Build Command**: `pnpm install && pnpm build`
    *   **Start Command**: `pnpm start`
    *   **Plan**: Free
5.  Click **"Create Web Service"**.
6.  **Copy the URL** Render gives you (e.g., `https://princeio-backend.onrender.com`).

---

## Step 3: Deploy Frontend to Vercel ▲

1.  Go to [vercel.com](https://vercel.com) and login.
2.  Click **"Add New..."** → **"Project"**.
3.  Import the `princeio` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (Should auto-detect).
    *   **Root Directory**: Edit this -> Select `apps/web`.
5.  **Environment Variables** (Crucial!):
    expand the "Environment Variables" section and add:
    
    | Key | Value |
    |-----|-------|
    | `NEXT_PUBLIC_API_URL` | *Your Render URL* (e.g. `https://princeio-backend.onrender.com`) |
    | `NEXT_PUBLIC_SIGNALING_URL` | *Your Render URL* (e.g. `https://princeio-backend.onrender.com`) |

6.  Click **"Deploy"**.

---

## 🎉 Done!

Vercel will give you a domain (e.g., `princeio.vercel.app`).
Now you can:
1.  Open `princeio.vercel.app` on **any device** (Phone, Laptop, etc).
2.  Run your **Desktop App** on your PC.
3.  Connect and control from anywhere!
