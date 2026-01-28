# Deploying API Server to Render

Great news! The service you already deployed (`princeio.onrender.com`) is your **Signaling Server** (it supports WebSockets).

Now you need to deploy the **REST API** (which handles sessions, authentication, etc.) as a **Second Web Service**.

## Steps

1.  **Dashboard**: Go to [Render Dashboard](https://dashboard.render.com/).
2.  **New Service**: Click **New +** -> **Web Service**.
3.  **Connect Repo**: Select your `princeio` repository.
4.  **Configure Service**:
    *   **Name**: `princeio-api`
    *   **Region**: Same as before.
    *   **Root Directory**: `.` (Use root to allow workspace access)
    *   **Runtime**: **Node**
    *   **Build Command**: `rm -rf apps/desktop && pnpm install --filter @princeio/api... && pnpm --filter @princeio/api build`
        *   *Correction*: We changed `pnpm run build --filter...` to `pnpm --filter ... build` to correctly target the package without passing flags to the inner script.
    *   **Start Command**: `pnpm --filter @princeio/api start`
    *   **Instance Type**: Free.

5.  **Environment Variables**:
    *   Add:
        *   `JWT_SECRET`: (Generate a random string, e.g., `my-super-secret-key-123`)
        *   `NODE_ENV`: `production`

6.  **Deploy**: Click **Create Web Service**.

## Final Configuration (Vercel)

Once `princeio-api` is Live, you will have **TWO** URLs:
1.  **Signaling URL**: `https://princeio.onrender.com` (Your existing one)
2.  **API URL**: `https://princeio-api.onrender.com` (The new one)

**Update Vercel Environment Variables:**
*   `NEXT_PUBLIC_SIGNALING_URL`: `https://princeio.onrender.com`
*   `NEXT_PUBLIC_API_URL`: **[The URL of your new API service]**

Redeploy Vercel, and you are done!
