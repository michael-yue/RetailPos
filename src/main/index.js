import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron'
import appIcon from './tray'
import localStorage from './localStorage'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  var isSide = localStorage.getItem('winSideSetting') === 'true'
  mainWindow = new BrowserWindow({
    minHeight: 720, // 尤其是 有着1T 显存的 gt630 战术核显卡，只要一发就能摧毁一个航母战斗群。
    height: 720,
    useContentSize: true,
    minWidth: 1195,
    width: 1195,
    autoHideMenuBar: false,
    show: true,
    resizable: true,
    icon: '../../build/icons/256x256.png',
    darkTheme: true,
    frame: isSide,
    webPreferences: {webSecurity: false}
  })


  //在主线程下，通过ipcMain对象监听渲染线程传过来的getPrinterList事件
  ipcMain.on('getPrinterList', (event) => {

    //在主线程中获取打印机列表
    const list = mainWindow.webContents.getPrinters();

    //通过webContents发送事件到渲染线程，同时将打印机列表也传过去
    mainWindow.webContents.send('getPrinterList', list);
  });

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

ipcMain.on('exit', (e) => {
  // app.relaunch()
  app.exit(0)
})

app.on('ready', createWindow)

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
app.on('window-all-closed', () => {
  console.log('message window-all-closed')
  if (appIcon) {
    appIcon.destroy()
  }
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */