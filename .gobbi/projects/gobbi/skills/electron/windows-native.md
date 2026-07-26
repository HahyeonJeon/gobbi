# Electron — Windows and Native Integration

**Owns** — the window and the OS seam: the window-class decision between `BrowserWindow` and
`BaseWindow` + `WebContentsView`, with the manual-cleanup ownership rule for child `webContents`; the app
lifecycle ordering that `open-url` / `open-file` registration depends on; the deep-link triple behind
`requestSingleInstanceLock()`; native `dialog` and its modal parenting; `shell.openPath` /
`shell.showItemInFolder`; `crashReporter` and `app.getPath('logs')`; and the platform failure modes across
tray, `globalShortcut`, `safeStorage`, and macOS notifications.

**Split criterion** — an independently consumed lookup reference
([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): the window-class decision, the lifecycle
ordering and the platform-delta table are read at a decision point — a window is constructed, a listener is
placed, a native API is reached for — not narratively.

This doc **deepens, and does not restate,** SKILL.md rule EL-R-13 and the `BrowserWindow` judgment default:
which window class to construct and what cleanup it leaves you, where in the entry module each listener has
to sit, how a deep link arrives, and which native APIs report failure by returning a value nobody reads.

| Borrowed fact | Its one owner |
|---|---|
| `webPreferences` at a construction site, the `openExternal` allowlist, the window-open handler, session and custom-protocol configuration | [`security.md`](security.md) |
| Code signing and notarization, and packaging the protocol registration | [`packaging-distribution.md`](packaging-distribution.md) |
| The `BrowserView` deprecation row and every other removed-in-vN entry | [`migration.md`](migration.md) |
| What a window, a dialog and a menu *contain* — layout, copy, affordances | [`../ui/SKILL.md`](../ui/SKILL.md) |

## Contents

1. [Choosing the window class](#1-choosing-the-window-class)
2. [Lifecycle ordering: what is registered before ready](#2-lifecycle-ordering-what-is-registered-before-ready)
3. [Deep links arrive by three routes](#3-deep-links-arrive-by-three-routes)
4. [Native dialogs, the shell, and the log path](#4-native-dialogs-the-shell-and-the-log-path)
5. [Menus: prefer a role over a click handler](#5-menus-prefer-a-role-over-a-click-handler)
6. [The four platform failure modes](#6-the-four-platform-failure-modes)

---

## 1. Choosing the window class

**`BrowserWindow` is not deprecated.** `docs/api/base-window.md@v43.2.0` says so from the `BaseWindow`
side, verbatim: *"`BaseWindow` provides a flexible way to compose multiple web views in a single window. For
windows with only a single, full-size web view, the `BrowserWindow` class may be a simpler option."*

The deprecated class is **`BrowserView`**, deprecated in **Electron 30** in favor of `WebContentsView`
([`migration.md`](migration.md) owns that row). The conflation runs both ways: reaching for `BrowserView`
because it is the name in older material, and migrating a single-window application off `BrowserWindow`
because `BaseWindow` looks newer — which trades a class that manages its own web contents for one that does
not.

| Choose | When | What you own |
|---|---|---|
| `BrowserWindow` | one full-size web view — the ordinary application window | nothing extra; the window owns its `webContents` and tears it down with itself |
| `BaseWindow` + `WebContentsView` | several web views composed in one window: a split editor, a fixed chrome around a document, an embedded third-party page | **closing the window does not destroy the child `webContents`** — you close each one |

The leak is the whole cost of the second row, and the same file states it: *"Unlike with a `BrowserWindow`,
if you don't explicitly close the `webContents`, you'll encounter memory leaks."* So a composed window pairs
every `WebContentsView` it creates with a close in the window's own `closed` handler:

```ts main
import { BaseWindow, WebContentsView } from 'electron';

export function createComposedWindow(): BaseWindow {
  const window = new BaseWindow({ width: 1200, height: 800 });

  const editor = new WebContentsView();
  const preview = new WebContentsView();
  window.contentView.addChildView(editor);
  window.contentView.addChildView(preview);

  // Closing the window destroys the native window, not these two `webContents`.
  // Without this handler, every open-and-close leaks a renderer process.
  window.on('closed', () => {
    editor.webContents.close();
    preview.webContents.close();
  });

  return window;
}
```

Both classes are main-process only, and neither may be constructed before the `ready` event (§ 2). Every
`webContents` this window creates is a separate window-open surface and a separate `webPreferences` site —
[`security.md`](security.md) owns both, and EL-R-06 is per `webContents`, not per application.

---

## 2. Lifecycle ordering: what is registered before ready

Two groups of code sit in the entry module, and putting one in the other's place is the defect EL-R-13
exists to catch.

| Register during initial module evaluation | Create after `app.whenReady()` |
|---|---|
| `open-url` and `open-file` listeners | `BrowserWindow`, `BaseWindow`, `WebContentsView` |
| `requestSingleInstanceLock()` and the `second-instance` listener | `Tray` |
| `crashReporter.start()` | `Menu.setApplicationMenu()` |

**The reason the first column is not a style preference.** On macOS the launch itself carries the URL or the
file path: the OS starts the application *in order to* deliver it, and the event fires as part of that
startup. `docs/api/app.md@v43.2.0` is explicit for `open-url` — *"If you register the listener in response
to a `ready` event, you'll miss URLs that trigger the launch of your application"* — and requires `open-file`
to be attached *"very early in your application startup ... (even before the `ready` event is emitted)"*. A
listener attached inside `whenReady()` still works for every event that arrives while the app is already
running, which is exactly why the bug survives testing: the developer drags a file onto a running app, sees
it open, and ships a cold start that silently drops the argument.

`crashReporter.start()` is in the first column for a different reason — it collects from processes created
*after* it starts, so a renderer created before it is unmonitored.

```ts main
import { app, crashReporter } from 'electron';

declare function openDocument(path: string): void;

// Initial module evaluation: everything here runs before the first tick, so no
// event arriving with the launch can be missed. `preventDefault()` claims the
// event instead of leaving it to the default behavior.
crashReporter.start({ uploadToServer: false });

app.on('open-file', (event, path) => {
  event.preventDefault();
  openDocument(path);
});

void app.whenReady().then(() => {
  // Windows, tray icons and application menus are constructed here, and only here.
});
```

EL-R-13's defeater is the shape this ordering does not by itself rule out: a registration written at the top
level of a module that is *itself* loaded by a dynamic `import()` inside `whenReady()`. The listener is
textually at module top level and it still attaches after ready. The property is *when the registration
runs*, not where the line sits — so the entry module reaches these listeners on its first synchronous pass,
through a static import or none at all.

---

## 3. Deep links arrive by three routes

A deep link is one user action — clicking `myapp://project/42` — that reaches three different Electron
surfaces depending on the platform and on whether the application was already running.

| Route | Platform | State | Where the URL is |
|---|---|---|---|
| `open-url` | macOS | running **and** cold start | the event's `url` argument |
| `second-instance` | Windows, Linux | already running | the event's `argv` array |
| `process.argv` | Windows, Linux | cold start | this process's own arguments |

The second route only exists if the application holds the single-instance lock.
`requestSingleInstanceLock()` returns `true` in the primary instance and `false` in every other one; the
losing process has already handed its arguments to the primary and must quit. Without the lock, a Windows
deep link launches a *second copy*, which opens its own window and leaves the first one untouched.

```ts main
import { app } from 'electron';

const PROTOCOL = 'myapp';

declare function focusPrimaryWindow(): void;
declare function handleDeepLink(url: string): void;

function handleDeepLinkIn(argv: readonly string[]): void {
  // `argv` order is not stable and Chromium appends its own arguments, so scan
  // for the prefix; never read a fixed position.
  const url = argv.find((argument) => argument.startsWith(`${PROTOCOL}://`));
  if (url !== undefined) {
    handleDeepLink(url);
  }
}

if (!app.requestSingleInstanceLock()) {
  // This process lost: its arguments are already on their way to the primary
  // instance. Quitting here is what makes the `second-instance` route work.
  app.quit();
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);

  // Route 1 — macOS, running or launched by the link.
  app.on('open-url', (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
  });

  // Route 2 — Windows and Linux, already running. The second instance never
  // gets a window; it only delivers its command line.
  app.on('second-instance', (_event, argv) => {
    focusPrimaryWindow();
    handleDeepLinkIn(argv);
  });

  // Route 3 — Windows and Linux, cold start. The URL is an argument of this
  // process, and no event is ever emitted for it.
  void app.whenReady().then(() => {
    handleDeepLinkIn(process.argv);
  });
}
```

Two properties of that block are the ones that get lost. **All of it is initial module evaluation** except
the `whenReady()` callback, per § 2. And **a URL from any route is untrusted input** — a string another
application chose: parse it, validate the target against a closed set, and never hand it to
`shell.openExternal` or to a window's `loadURL`, both of which [`security.md`](security.md) owns.
The `argv` caution in the helper above is the vendor's: `docs/api/app.md@v43.2.0` warns that the second
instance's `argv` *"will not be exactly the same list of arguments as those passed"*.

**Deep links do not work unpackaged.** `docs/tutorial/launch-app-from-url-in-another-app.md@v43.2.0`: *"On
macOS and Linux, this feature will only work when your app is packaged. It will not work when you're
launching it in development from the command-line."* Testing it means building the artifact, and
[`packaging-distribution.md`](packaging-distribution.md) owns the protocol registration packaging carries.

---

## 4. Native dialogs, the shell, and the log path

`dialog` is main-process only, and its window argument is not decoration: it attaches the dialog to a parent
window and makes it modal — `docs/api/dialog.md@v43.2.0`, *"The `window` argument allows the dialog to
attach itself to a parent window, making it modal."* Omitting it produces a free-floating dialog with no
owner, which on macOS is a window-level dialog rather than a sheet. `shell.openPath`, in the same example,
is the API most often written as if it returned nothing: it resolves with an **error message string**, empty
on success, so the failure signal is in the resolved value and nowhere else.

```ts main
import { app, dialog, shell } from 'electron';

export async function revealChosenFile(parent: Electron.BaseWindow): Promise<void> {
  const result = await dialog.showOpenDialog(parent, {
    defaultPath: app.getPath('logs'),
    properties: ['openFile'],
  });

  const chosen = result.filePaths[0];
  if (result.canceled || chosen === undefined) {
    return;
  }

  shell.showItemInFolder(chosen);

  // Resolves with an error message, NOT a boolean: `''` is success. Dropping
  // the resolved value is how a failed open becomes a silent no-op.
  const failure = await shell.openPath(chosen);
  if (failure !== '') {
    dialog.showErrorBox('Could not open the file', failure);
  }
}
```

`app.getPath('logs')` is the app's log directory, created on first use if `setAppLogsPath()` was never
called. Use it rather than a path assembled from `userData`: it is the directory the platform expects and
where a support request can be told to look. Whatever lands there is in plain sight — EL-N-06 covers what
must not. `shell.openExternal` is a different case from the two calls above: it hands a URL to whatever the
OS registered for that scheme, so it takes an allowlist, and [`security.md`](security.md) § 7 owns it.

---

## 5. Menus: prefer a role over a click handler

A menu item with a `role` inherits the platform's own behavior: the accelerator, the localized label, and
the enable/disable state that goes with the current selection. A hand-written `click` handler inherits none
of those, and the loss is invisible in the language and on the platform the author develops on.
`docs/tutorial/menus.md@v43.2.0` states the preference directly: *"We recommend specifying the `role`
attribute for any menu item that matches a standard role rather than trying to manually implement the
behavior in a `click` function."*

```ts main
import { Menu } from 'electron';

declare function openFindPanel(): void;

// Built and set after `ready`, per § 2.
const template: Electron.MenuItemConstructorOptions[] = [
  { role: 'appMenu' },
  { role: 'fileMenu' },
  {
    label: 'Edit',
    submenu: [
      // Each role carries its own accelerator and localized label on every
      // platform. Written as `click` handlers, all of that has to be re-supplied
      // by hand, per platform, per language.
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      // No standard role covers this one, so it states its own accelerator.
      { label: 'Find in Project', accelerator: 'CommandOrControl+Shift+F', click: openFindPanel },
    ],
  },
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

What the menu should *contain* — which commands earn a top-level position, how they are named and grouped —
is a product question [`../ui/SKILL.md`](../ui/SKILL.md) owns; this file owns only how entries are declared.

---

## 6. The four platform failure modes

These four are the reason this file exists. Each is a correct-looking call that does the wrong thing on one
platform, and **three of the four report nothing at all**.

| API | Platform | What goes wrong | How it surfaces |
|---|---|---|---|
| `tray.setContextMenu` | Linux | mutating a `MenuItem` in place updates the JavaScript object and not the menu the desktop shows | **silent** — the menu keeps showing the old state |
| `globalShortcut.register` | any | the OS already owns the accelerator | **silent** — returns `false`; the shortcut never fires |
| `safeStorage.encryptString` | Linux | no OS secret store is available, so the key is a hardcoded plaintext password | **silent** — encryption "succeeds" and protects nothing |
| `new Notification()` | macOS | the application is not code-signed | **signalled** — a `failed` event on the notification |

### Linux tray menus need a fresh `setContextMenu`

`docs/api/tray.md@v43.2.0`, under Platform Considerations → Linux: *"In order for changes made to individual
`MenuItem`s to take effect, you have to call `setContextMenu` again."* A checkbox toggled in the object model
is not reflected on the desktop until the menu is handed to the tray a second time. Doing that on every
platform costs nothing and removes the platform branch:

```ts main
import { Menu, Tray, nativeImage } from 'electron';

// Called after `ready`, per § 2.
export function createTray(iconPath: string): Tray {
  const tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { id: 'sync-paused', label: 'Pause syncing', type: 'checkbox', checked: false },
      { role: 'quit' },
    ]),
  );
  return tray;
}

export function setSyncPaused(tray: Tray, menu: Electron.Menu, paused: boolean): void {
  const item = menu.items.find((candidate) => candidate.id === 'sync-paused');
  if (item === undefined) {
    return;
  }
  item.checked = paused;
  // The line above updated the object and nothing else. On Linux the menu has
  // to reach the desktop environment again, so hand it back to the tray.
  tray.setContextMenu(menu);
}
```

### `globalShortcut` and `safeStorage`: two return values that carry the whole failure

`docs/api/global-shortcut.md@v43.2.0`: *"When the accelerator is already taken by other applications, this
call will silently fail. This behavior is intended by operating systems, since they don't want applications
to fight for global shortcuts."* `register`'s boolean is the only report. Written as a statement with the
boolean discarded, the feature works on the developer's machine and is absent on a user machine where
something else claimed the same key combination.

`safeStorage` fails one level deeper — it succeeds while protecting nothing.
`docs/api/safe-storage.md@v43.2.0`: *"Note that not all Linux setups have an available secret store. If no
secret store is available, items stored in using the `safeStorage` API will be unprotected as they are
encrypted via hardcoded plaintext password. You can detect when this happens when
`safeStorage.getSelectedStorageBackend()` returns `basic_text`."* `isEncryptionAvailable()` still returns
`true` in that state: it reports that the API works, not that the result is protected. The backend is a
second, separate question, and its answer decides whether the secret may be stored at all.

```ts main
import { globalShortcut, safeStorage } from 'electron';

declare function warnShortcutUnavailable(accelerator: string): void;

export function registerQuickOpen(onTrigger: () => void): boolean {
  const accelerator = 'CommandOrControl+Shift+P';
  // Reading this boolean is the entire failure path. Discard it and an
  // accelerator the OS already owns becomes a feature that quietly does not exist.
  const registered = globalShortcut.register(accelerator, onTrigger);
  if (!registered) {
    warnShortcutUnavailable(accelerator);
  }
  return registered;
}

export function encryptSecret(secret: string): Buffer | null {
  if (!safeStorage.isEncryptionAvailable()) {
    return null;
  }
  if (process.platform === 'linux' && safeStorage.getSelectedStorageBackend() === 'basic_text') {
    // No OS secret store: the key is a hardcoded plaintext password, so the
    // ciphertext protects nothing. Refuse and re-prompt rather than pretend.
    return null;
  }
  return safeStorage.encryptString(secret);
}
```

`getSelectedStorageBackend()` returns `unknown` before the `ready` event, so the check runs after ready and
`unknown` is never treated as a pass.

### macOS notifications are the one that tells you

`docs/api/notification.md@v43.2.0`: *"On MacOS, notifications use the UNNotification API as their underlying
framework. This API requires an application to be code-signed in order for notifications to appear. Unsigned
binaries will emit a `failed` event when notifications are called."* That event is the signal the other three
do not have — and it is only observed if a handler is attached.

```ts main
import { Notification } from 'electron';

declare function reportNotificationFailure(message: string): void;

export function notifyBuildFinished(body: string): void {
  const notification = new Notification({ title: 'Build finished', body });

  // The one delta on this page that reports itself. Without this handler the
  // report is discarded and an unsigned build looks identical to a silent one.
  notification.on('failed', (_event, error) => {
    reportNotificationFailure(error);
  });

  notification.show();
}
```

This is a development-build condition rather than a shipping one: a signed, notarized application does not
hit it ([`packaging-distribution.md`](packaging-distribution.md) owns both). Handle it anyway — the unsigned
build is what everyone runs while writing the feature, and a notification that never appears with no error
is indistinguishable from one that was never sent.

---

## References

One owner per borrowed fact: the sections above state the local consequence, and these entries name the
source that validates it. Each is `verified-against that source on 2026-07-26`.

- `docs/api/base-window.md@v43.2.0` — § 1's two quoted sentences: `BrowserWindow` "may be a simpler option"
  for a single full-size web view, and an unclosed child `webContents` leaks.
  `docs/api/web-contents-view.md@v43.2.0` carries the constructor and the `webContents` property beside it.
- `docs/api/app.md@v43.2.0` — § 2's `open-url` and `open-file` registration warnings; § 3's
  `requestSingleInstanceLock()` semantics, the `second-instance` arguments and the unstable-`argv` caution;
  and `app.getPath('logs')` in § 4. `docs/api/crash-reporter.md@v43.2.0` carries § 2's "as early as possible
  in app startup, preferably before `app.on('ready')`" and the unmonitored-renderer consequence.
- `docs/tutorial/launch-app-from-url-in-another-app.md@v43.2.0` — § 3's packaged-only constraint.
- `docs/api/dialog.md@v43.2.0` — § 4's modal-parenting sentence, repeated on every `show*` method.
  `docs/api/shell.md@v43.2.0` carries `openPath`'s contract — the error message, or `""` on success — and
  `showItemInFolder`.
- `docs/tutorial/menus.md@v43.2.0` — § 5's recommendation to use `role` rather than a hand-written `click`,
  and that a role supplies the label and accelerator per platform.
- The four in § 6, each quoted verbatim from its own page: `docs/api/tray.md@v43.2.0` (the Linux Platform
  Consideration), `docs/api/global-shortcut.md@v43.2.0` ("this call will silently fail", and `register`'s
  boolean return), `docs/api/safe-storage.md@v43.2.0` (the hardcoded-plaintext-password note, the
  `basic_text` detection, `unknown` before ready, and what `isEncryptionAvailable()` means), and
  `docs/api/notification.md@v43.2.0` (the UNNotification signing requirement and the `failed` event).
- [`SKILL.md`](SKILL.md) — EL-R-13 and the `BrowserWindow` judgment default, which this doc deepens and does
  not restate. The supported-majors window every version claim above is read against lives there, and the
  `BrowserView`-deprecated-in-30 claim is registered in [`migration.md`](migration.md).
