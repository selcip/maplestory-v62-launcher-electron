module.exports = {
  getPath,
  checkFile,
  selectPath,
  updatePath
}

const ipc = require('electron').ipcRenderer
const fs = require('fs')
const { dialog } = require('electron').remote
const jsonfile = require('jsonfile')

function checkFile(){
  try{
      fs.accessSync('config.json', fs.F_OK)
      getPath()
    }catch(e){
      updatePath(selectPath()[0])
  }
  ipc.send('main')
}

function getPath(){
  let path = jsonfile.readFileSync('config.json')
  return path.path
}

function selectPath(){
  return dialog.showOpenDialog({properties: ['openDirectory']})
}

function updatePath(path){
  jsonfile.writeFileSync('config.json', {path})
  return;
}
