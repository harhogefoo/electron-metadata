const { app, BrowserWindow, ipcMain } = require('electron')
const util = require('util')
const fs = require('fs')
// make fs.stat able to use promises ( instead of callbacks )
const stat = util.promisify(fs.stat)

const path = require('path')

let mainWindow

app.on('ready', () => {
  console.log('app ready')
  const htmlPath = path.join('src', 'index.html')
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile(htmlPath)
})

ipcMain.on('files', async (event, filesArr) => {
  try {
    const data = await Promise.all(
      filesArr.map(async ({ name, path }) => ({
        ...await stat(path),
        name,
        pathName: path
      }))
    )
    mainWindow.webContents.send('metadata', data)
  } catch (error) {
    mainWindow.webContents.send('metadata:error', error)
  }
})
