# Electron — Windows and Native Integration

**Owns** — the window and the OS seam: the window-class decision between `BrowserWindow` and
`BaseWindow` + `WebContentsView`, with the manual-cleanup ownership rule for child `webContents`; the app
lifecycle ordering that `open-url` / `open-file` registration depends on; the deep-link triple behind
`requestSingleInstanceLock()`; native `dialog` and its modal parenting; `shell.openPath` /
`shell.showItemInFolder`; `crashReporter` and `app.getPath('logs')`; and the platform failure modes across
tray, `globalShortcut`, `safeStorage`, and macOS notifications.
