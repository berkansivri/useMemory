const getRandomFrameworks = (count) => {
  const frameworks = ['adonis.png', 'after.png', 'agilityjs.png', 'ampersand.png', 'amplitude.png', 'angular-meteor.png', 'angularjs.png', 'babel.png', 'backbone.png', 'chartist.png', 'chartjs.png', 'charts.png', 'clementine.png', 'codecept.png', 'codeclimate.png', 'coffeescript.png', 'commonjs.png', 'cordova.png', 'cujojs.png', 'cyclejs.png', 'cyclow.png', 'ember.png', 'emotion.png', 'ender.png', 'enquirer.png', 'enyo.png', 'epoch.png', 'expressjs.png', 'flux.png', 'mobx-state-tree.png', 'mobx.png', 'mocha.png', 'modernizr.png', 'mojs.png', 'moleculer.png', 'momentjs.png', 'moon.png', 'muuri.png', 'nativescript-angular.png', 'nativescript.png', 'nemo.png', 'nerv.png', 'nest.png', 'neutrino.png', 'next.js.png', 'nightwatch.png', 'nile.js.png', 'nivo.png', 'nodal.png', 'nodejs.png']

  const randomFrameworks = []
  const len = frameworks.length
  while (randomFrameworks.length < count) {
    const index = Math.floor(Math.random() * len)
    const name = frameworks[index].split(".png")[0]
    if (randomFrameworks.indexOf(name) === -1) randomFrameworks.push(name)
  }
  return randomFrameworks
}

export { getRandomFrameworks as default }