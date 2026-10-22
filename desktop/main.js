const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

// رابط موقعك: التطبيق يفتح الموقع مباشرة، فأي تعديل تنشره يظهر بالتطبيق بدون إعادة بناء
const SITE = "https://yuseef824.github.io/my-store/";

if (!app.requestSingleInstanceLock()) app.quit();

function createWindow() {
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 420, minHeight: 600,
    backgroundColor: "#0d0e12", title: "Torch Store",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  win.loadURL(SITE);
  win.webContents.on("did-fail-load", (e, code, d, url, isMain) => {
    if (isMain) win.loadFile(path.join(__dirname, "offline.html"));
  });
  // روابط واتساب وتلي وغيرها تنفتح بالمتصفح، مو داخل التطبيق
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith(SITE) && !url.startsWith("file:")) { e.preventDefault(); shell.openExternal(url); }
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
