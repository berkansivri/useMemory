const getRandomFrameworks = (count = 12) => {
  const frameworks = ['adonis.png', 'after.png', 'agilityjs.png', 'ampersand.png', 'amplitude.png', 'angular-meteor.png', 'angularjs.png', 'babel.png', 'backbone.png', 'chartist.png', 'chartjs.png', 'charts.png', 'clementine.png', 'codecept.png', 'codeclimate.png', 'coffeescript.png', 'commonjs.png', 'cordova.png', 'cujojs.png', 'cyclejs.png', 'cyclow.png', 'ember.png', 'emotion.png', 'ender.png', 'enquirer.png', 'enyo.png', 'epoch.png', 'expressjs.png', 'flux.png', 'mobx-state-tree.png', 'mobx.png', 'mocha.png', 'modernizr.png', 'mojs.png', 'moleculer.png', 'momentjs.png', 'moon.png', 'muuri.png', 'nativescript-angular.png', 'nativescript.png', 'nemo.png', 'nerv.png', 'nest.png', 'neutrino.png', 'next.js.png', 'nightwatch.png', 'nile.js.png', 'nivo.png', 'nodal.png', 'nodejs.png']

  const randomFrameworks = []
  
  //getting random frameworks
  while (randomFrameworks.length < count*2) {
    const index = Math.floor(Math.random() * frameworks.length)
    const name = frameworks[index].split(".png")[0]
    if (randomFrameworks.indexOf(name) === -1) 
      randomFrameworks.push(...[name, name])
  }
  
  //shuffling
  for (let i = randomFrameworks.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [randomFrameworks[i], randomFrameworks[j]] = [randomFrameworks[j], randomFrameworks[i]]
    j = Math.floor(Math.random() * (i + 1));
    [randomFrameworks[i], randomFrameworks[j]] = [randomFrameworks[j], randomFrameworks[i]]
  }
  
  return randomFrameworks.map((name) => ({ name, isOpen: false, isMatch: false }))
}

export { getRandomFrameworks as default }
