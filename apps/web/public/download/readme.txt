This is a placeholder for the PrinceIO Desktop App.

To get the real app:
1. Since the AI environment could not build the .exe, you need to build it locally.
2. Run `npm install -g electron-packager` on your laptop.
3. Run `electron-packager apps/desktop princeio --platform=win32 --arch=x64`
4. Zip the result and name it `princeio-win32-x64.zip`.
5. Place it in `apps/web/public/download/`.
