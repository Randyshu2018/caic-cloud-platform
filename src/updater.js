/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

// let updater
autoUpdater.autoDownload = false

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error === null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    // title: 'Found Updates',
    message: '发现新版本，是否更新?',
    buttons: ['确定', '取消'],
    noLink:true
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('update-not-available', () => {
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    // title: 'Found Updates',
    message: '  更新完成，是否关闭应用程序安装新版本?',
    buttons: ['确定', '取消'],
    noLink:true
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
        autoUpdater.quitAndInstall(true)
    }
  });
})

// export this to MenuItem click callback
function checkForUpdates (menuItem, focusedWindow, event) {
  // updater.enabled = false
  autoUpdater.checkForUpdates()
}
module.exports.checkForUpdates = checkForUpdates
