module.exports = {
  addProgress,
  resetProgress
}

const progressbar = require('progressbar.js')
const line = new progressbar.Line(bar, {
  easing: 'easeInOut',
  duration: 1400,
  svgStyle: {width: '100%', height: '100%'},
  from: {color: '#ED6A5A'},
  to: {color: '#FFEA82'},
  step: (state, bar) => {
    bar.path.setAttribute('stroke', state.color);
  }
})

function addProgress(value){
    line.animate(value)
}

function resetProgress(){
  line.set(0)
}
