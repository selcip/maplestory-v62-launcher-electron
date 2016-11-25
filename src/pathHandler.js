module.exports = {
  getPath,
  checkFile,
  selectPath,
  updatePath,
  test
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
      window.alert('Selecione a pasta do jogo')
      updatePath(selectPath()[0])
  }
  ipc.send('main')
}

function getPath(){
  let path = jsonfile.readFileSync('config.json')
  return path.path
}

function test(){
  let res
  try{
      fs.accessSync('config.json', fs.F_OK)
      res = true
    }catch(e){
      res = false
  }
  return res
}

function selectPath(){
  return dialog.showOpenDialog({properties: ['openDirectory']})
}

function updatePath(path){
  jsonfile.writeFileSync('config.json', {path})
  return;
}
