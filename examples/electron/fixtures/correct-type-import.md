# Fixture — correct process-local type imports

The generated main and preload views preserve the value and type sides of their
vendor namespaces. The harness MUST exit 0 on both blocks. A generator that
exports only a `const` typed with `typeof Electron.Main` or
`typeof Electron.Renderer` fails these correct imports with `TS2305`.

```ts main complete
import { ipcMain, type IpcMainInvokeEvent, type WebContents } from "electron";

function senderId(contents: WebContents): number {
  return contents.id;
}

ipcMain.handle("sender:id", (event: IpcMainInvokeEvent): number => {
  return senderId(event.sender);
});
```

```ts preload complete
import {
  clipboard,
  contextBridge,
  type Clipboard,
  type ContextBridge,
} from "electron";

const clipboardApi: Clipboard = clipboard;
const bridgeApi: ContextBridge = contextBridge;

bridgeApi.exposeInMainWorld("clipboardText", {
  read: (): string => clipboardApi.readText(),
});
```
