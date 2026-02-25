const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = !app.isPackaged

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#0a0e1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    icon: path.join(__dirname, '../../assets/icon.png'),
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }
}

// Save/Load build files
const getBuildsDir = () => {
  const dir = path.join(app.getPath('userData'), 'builds')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

ipcMain.handle('save-build', async (event, { name, data }) => {
  const filePath = path.join(getBuildsDir(), `${name}.json`)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  return { success: true, path: filePath }
})

ipcMain.handle('load-build', async (event, { name }) => {
  const filePath = path.join(getBuildsDir(), `${name}.json`)
  if (!fs.existsSync(filePath)) return { success: false, error: 'Build not found' }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return { success: true, data }
})

ipcMain.handle('list-builds', async () => {
  const dir = getBuildsDir()
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
  return files.map(f => f.replace('.json', ''))
})

ipcMain.handle('delete-build', async (event, { name }) => {
  const filePath = path.join(getBuildsDir(), `${name}.json`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  return { success: true }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
