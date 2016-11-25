const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

if(require('electron-squirrel-startup')) return;
// Referencia global pro objeto que vai executar a janela, se não tiver isso o
// coletor de lixo pode fechar seu programa do nada
let win, winLoad
let main = {
  width: 800,
  height: 600,
  show: false,
  resizable: false,
  transparent: true,
  frame: false,
  icon: path.join(__dirname, 'build/idm.ico')
}
let loading = {
  width: 800,
  height: 186,
  show: false,
  resizable: false,
  frame: false,
  transparent: true,
  movable: false,
  icon: path.join(__dirname, 'build/idm.ico')
}

function startLoading() {
  winLoad = new BrowserWindow(loading)

  winLoad.loadURL(url.format({
    pathname: path.join(__dirname, 'app/loading.html'),
    protocol: 'file:',
    slashes: true
  }))

  winLoad.on('closed', ()=>{
    winLoad=null
  })

  //winLoad.webContents.openDevTools()

  winLoad.once('ready-to-show', ()=>{
    winLoad.show()
  })

}

function startMain() {
  win = new BrowserWindow(main)

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', ()=>{
    win=null
  })

  win.once('ready-to-show', ()=>{
    winLoad.destroy()
    win.show()
  })
}

// Executa a funcao @CreateWindow quando o aplicativo está pronto
app.on('ready', startLoading)

//Caso todas as janelas estejam fechadas, o aplicativo é finalizado
app.on('window-all-close', ()=>{
  if (process.platform !== 'darwin'){
    app.quit()
  }
})

app.on('activate', ()=>{
  if (win === null){
    createWindow('main')
  }
})

ipcMain.on('main', startMain)

ipcMain.on('leave', ()=>{
  app.quit()
})

const squirrelCommand = process.argv[1]
switch (squirrelCommand) {
  case '--squirrel-install':
  case '--squirrel-updated':
  case '--squirrel-obsolete':
  app.quit()
  return true
}
