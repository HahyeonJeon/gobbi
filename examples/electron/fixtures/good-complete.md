# Fixture — good complete block

A self-contained `complete` block, tagged with its process, that type-checks
clean in the `main` pass. The harness MUST exit 0 on this file.

```ts main complete
import { app, ipcMain, shell } from "electron";

app.whenReady().then(() => {
  ipcMain.handle("open-external", async (_event, url: string): Promise<void> => {
    await shell.openExternal(url);
  });
});
```
