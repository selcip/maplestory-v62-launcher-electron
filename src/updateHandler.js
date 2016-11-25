const path = require('./pathHandler.js')

module.exports = {
  checkUpdate
}

let img = document.createElement('img')
img.src = "img/loading.gif"
img.setAttribute('class', 'circulo')
const package = require('../package.json')
const remote = require("electron").remote
const autoUpdater = remote.autoUpdater

var version = package.version

function checkUpdate(){
  autoUpdater.on('update-availabe', () => {
    document.body.insertBefore(img, document.getElementsByClassName('boneco')[0])
    console.log('update available')
  })
  autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update')
  })
  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available')
    path.checkFile()
  })
  autoUpdater.on('update-downloaded', (e) => {
    autoUpdater.quitAndInstall()
  })
  autoUpdater.on('error', (e)=>{
    console.log(e)
  })

  autoUpdater.setFeedURL('http://149.56.206.52/idmstory/releases/win64')
  autoUpdater.checkForUpdates()
  window.autoUpdater = autoUpdater
}
