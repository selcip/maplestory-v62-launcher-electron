module.exports = {
  startVerify
}

const { getPath } = require('./pathHandler')
const progress = require('./progressHandler')
const glob = require ('glob')
const forEachAsync = require('forEachAsync').forEachAsync
const request = require('request')
const req_progress = require('request-progress')
const rp = require('request-promise')
const fs = require('fs')
const status = document.getElementsByClassName('texto')[0]

var cmd = 'start IDM.exe 143.202.36.242 8484 --startAsAdmin'
var options = {
    uri: 'http://149.56.206.52/check',
    json: true
}
var arquivos = [
  'Base.wz', 'Character.wz', 'Effect.wz', 'Etc.wz', 'Item.wz', 'List.wz', 'Map.wz', 'Mob.wz', 'Morph.wz', 'Npc.wz', 'Quest.wz', 'Reactor.wz', 'Skill.wz', 'Sound.wz', 'String.wz', 'TamingMob.wz', 'UI.wz',
  'Canvas.dll', 'WZ.NET.dll', 'Gr2D_DX8.dll', 'ijl15.dll', 'NameSpace.dll', 'npkcrypt.dll', 'npkpdb.dll', 'PCOM.dll', 'ResMan.dll', 'Shape2D.dll', 'Sound_DX8.dll', 'WzFlashRenderer.dll', 'WzMss.dll', 'ZLZ.dll'
], baixar = ['IDM.exe']

function startVerify(tipo){
  rp(options)
      .then(function(files){
          compareFiles(files, tipo)
      })
      .catch(function (err){
          console.log(err)
      })
}

function compareFiles(files, tipo){
  forEachAsync(arquivos, function(next, arquivo){
    progress.addProgress((arquivos.indexOf(arquivo)+1)/arquivos.length)
    status.innerHTML = `Verificando arquivos [${arquivos.indexOf(arquivo)+1}/${arquivos.length}]`
    glob(getPath()+'/'+arquivo, function(er, file){
      if(file.length != 0){
        let size = fs.statSync(getPath() + '/' + arquivo)['size']
        console.log(arquivo + ': ' + size)
        if(size != files[arquivo]){
          baixar.push(arquivo)
        }else{
          if(tipo==0){
            window.alert('Algum arquivo foi alterado!')
            window.close()
          }
          console.log('nossa')
        }
      }else{
        if(tipo==0){
          window.alert('Algum arquivo está faltando!')
          window.close()
        }
        baixar.push(arquivo)
      }
      next()
    })
  }).then(function(){
    progress.addProgress(1)
    if (tipo == 1){
      setTimeout(()=>{
          progress.resetProgress()
          downloadFiles()
      }, 2000)
    }else{
      exec('start '+getPath()+'/IDM.exe 143.202.36.242 8484 --startAsAdmin' function(error, stdout, stderr) {
        playButton.disabled = false
      })
    }
  })
}

function downloadFiles(){
  forEachAsync(baixar, function(next, arquivo){
    req_progress(request('http://149.56.206.52/download/'+arquivo), {
    })
    .on('progress', function(state){
      status.innerHTML = `${arquivo} (${formatBytes(state.size.transferred)} de ${formatBytes(state.size.total)}) [${baixar.indexOf(arquivo)+1}/${baixar.length}]`
      progress.addProgress(state.percentage)
    })
    .on('error', function(err){
      console.log('erro ao baixar')
    })
    .on('end', function(){
      console.log('Terminado o download de:', arquivo)
      progress.resetProgress()
      next()
    })
    .pipe(fs.createWriteStream(getPath() + '/' + arquivo))
  }).then(function(){
    status.innerHTML = "Atualização concluida"
    progress.addProgress(1)
    document.getElementsByClassName('update')[0].remove()
  })
}

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
