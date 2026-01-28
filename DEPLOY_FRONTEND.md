# Deploying Frontend to Vercel

Since your backend is already deployed on Render, we can now deploy the frontend to Vercel.

## Prerequisites
- Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).
- You need the URL of your deployed **API** and **Signaling Server**.

## Deployment Steps

1.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repository**: Select your `princeio` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Select **Next.js**.
    *   **Root Directory**: Click "Edit" and select `apps/web`. **This is crucial** because you are in a monorepo.
5.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add the following variables:
        *   `NEXT_PUBLIC_API_URL`: `https://princeio.onrender.com` (or your valid API URL)
        *   `NEXT_PUBLIC_SIGNALING_URL`: The URL of your Signaling Server.
            *   *Note: If you haven't deployed the Signaling Server separately, you must do so. If you tried to deploy both API and Signaling to the same Render service, the Signaling server (WebSockets) might not be running or accessible unless configured specifically.*
6.  **Build & Development Settings (CRITICAL)**:
    *   Since you are in a monorepo with a desktop app (`robotjs`), Vercel will fail to install dependencies by default.
    *   Go to **Settings** -> **General** -> **Build & Development Settings**.
    *   **Install Command**: Valid "Override" and paste:
        ```bash
        rm -rf ../desktop && pnpm install
        ```
        *   **Important**: Since you set the Root Directory to `apps/web`, the desktop app is actually up one level (`../desktop`).
    *   **Build Command**: `pnpm build` (The default Next.js build command is usually fine, or explicitly `pnpm run build`).
    *   **Output Directory**: `.next` (Default).

7.  **Deploy**: Click "Deploy".

## Troubleshooting
- **robotjs Error**: If you see `make: *** [robotjs.target.mk...] Error 1`, use the Install Command `rm -rf ../desktop && pnpm install`.
- **Socket Connection Failed**: Ensure `NEXT_PUBLIC_SIGNALING_URL` points to the correct WebSocket server and that the server supports WSS (Secure WebSockets). Render provides SSL by default.

## Important Note on Signaling Server
Your backend setup consists of two parts:
1.  `apps/api` (HTTP API)
2.  `apps/signaling` (WebSocket Server)

If you only deployed one service to Render (e.g., `princeio.onrender.com`), it likely acts as the API. You may need to create a **second Web Service** on Render for `apps/signaling` (e.g., `princeio-signaling.onrender.com`).
