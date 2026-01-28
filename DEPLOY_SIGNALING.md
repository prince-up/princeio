# Deploying Signaling Server to Render

Since you have a separate application for real-time communication (`apps/signaling`), you need to deploy it as a **separate Web Service** on Render.

## Steps

1.  **Dashboard**: Go to your [Render Dashboard](https://dashboard.render.com/).
2.  **New Service**: Click **New +** and select **Web Service**.
3.  **Connect Repo**: Select your `princeio` repository.
4.  **Configure Service**:
    *   **Name**: `princeio-signaling` (or similar).
    *   **Region**: Same as your API (e.g., Singapore, Oregon).
4.  **Configure Service**:
    *   **Name**: `princeio-signaling` (or similar).
    *   **Region**: Same as your API (e.g., Singapore, Oregon).
    *   **Root Directory**: `.` (Leave as root! We will use filter commands)
        *   *Correction*: It is often safer to run from the **Root** of the repo to access the lockfile correctly, but use Filter commands. If you already set `apps/signaling`, that's okay, but the command below is crucial.
    *   **Runtime**: **Node**
    *   **Build Command**: `rm -rf apps/desktop && pnpm install --filter @princeio/signaling... && pnpm run build --filter @princeio/signaling`
        *   *Robust Fix*: This command **deletes** the desktop app folder (only on the server) before installing. This works 100% to prevent `robotjs` errors.
    *   **Start Command**: `pnpm run start --filter @princeio/signaling`
    *   **Instance Type**: Free or Starter.

5.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add:
        *   `NODE_ENV`: `production`
    *   *Note*: The `PORT` variable is automatically managed by Render.

6.  **Deploy**: Click **Create Web Service**.

## After Deployment

1.  **Get the URL**: Once deployed, Render will give you a URL like `https://princeio-signaling.onrender.com`.
2.  **Update Frontend**:
    *   Go to your **Vercel** project settings.
    *   Update (or add) the environment variable:
        *   `NEXT_PUBLIC_SIGNALING_URL`: `https://princeio-signaling.onrender.com` (use your actual new URL).
    *   **Redeploy** your frontend on Vercel for the changes to take effect.
