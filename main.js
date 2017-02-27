const electron = require('electron')
// Module to control application life.
const app = electron.app
const protocol = electron.protocol
const path = require('path')
const url = require('url')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  devToolsLog(commandLine);
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }

  devToolsLog('process args ' + commandLine.join(','))
  devToolsLog('initial url? ' + initialUrl)
  // on Windows, new app is created every time someone tries to open
  // custom protocol link. On Mac OS X, we have single application instance
  // and the custom protocol link is passed via "open-url" event (see below)
  const openUrl = initialUrl || commandLine[1]
  const firstUrl = openUrl ? openUrl : base
  devToolsLog('opening ' + firstUrl)

  let params = {
    video: firstUrl
  };

  let paramString = "";
  for(let i=0; i<Object.keys(params).length; i++) {
    paramString = paramString + (Object.keys(params)[i] + "=" + encodeURIComponent(params[Object.keys(params)[i]]));
  }

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/player/index.html'),
    protocol: 'file:',
    slashes: true,
    search: paramString
  }))

})

if(shouldQuit) {
  app.quit();
}


console.log('process args', process.argv)

// TODO pass the base url in the environment variable during setup?
const base = 'http://mn-l.mncdn.com/kanal24/smil:kanal24.smil/playlist.m3u8'
let initialUrl = 'http://mn-l.mncdn.com/kanal24/smil:kanal24.smil/playlist.m3u8'
// This application opens links that start with this protocol
const PROTOCOL = 'playerJs://'
const PROTOCOL_PREFIX = PROTOCOL.split(':')[0]

// prints given message both in the terminal console and in the DevTools
function devToolsLog(s) {
  console.log(s)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }

}

function stripCustomProtocol(url) {
  if (!url) {
    return url
  }
  if (!url.startsWith(PROTOCOL)) {
    return url
  }
  const videoPath = url.substr(11)
  return videoPath
}

function createWindow () {
  mainWindow = new BrowserWindow({width: 1000, height: 800})
  // just for demo purposes
  mainWindow.webContents.openDevTools()

  devToolsLog('process args ' + process.argv.join(','))
  devToolsLog('initial url? ' + initialUrl)
  // on Windows, new app is created every time someone tries to open
  // custom protocol link. On Mac OS X, we have single application instance
  // and the custom protocol link is passed via "open-url" event (see below)
  const openUrl = initialUrl || process.argv[1]
  const firstUrl = openUrl ? openUrl : base
  devToolsLog('opening ' + firstUrl)

  let params = {
    video: firstUrl
  };

  let paramString = "";
  for(let i=0; i<Object.keys(params).length; i++) {
    paramString = paramString + (Object.keys(params)[i] + "=" + encodeURIComponent(params[Object.keys(params)[i]]));
  }

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/player/index.html'),
    protocol: 'file:',
    slashes: true,
    search: paramString
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {
    devToolsLog(req);
    const paramUrl = req.url ? req.url : base;
    const videoUrl = stripCustomProtocol(paramUrl)
    const msg = `playing video ${paramUrl}`
    devToolsLog(msg)

    let params = {
      video: videoUrl
    };

    let paramString = "";
    for(let i=0; i<Object.keys(params).length; i++) {
      paramString = paramString + (Object.keys(params)[i] + "=" + encodeURIComponent(params[Object.keys(params)[i]]));
    }

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '/player/index.html'),
      protocol: 'file:',
      slashes: true,
      search: paramString
    }))
  }, (err) => {
    if (!err) {
      console.log('registered todo protocol')
    } else {
      console.error('could not register todo protocol')
      console.error(err)
    }
  })

  protocol.interceptHttpProtocol(
    "http",
    (request,callback) => {
      console.log("request intercepted");
      callback(request);
    },
    (err) => {
      if (!err) {
        console.log('registered todo protocol')
      } else {
        console.error('could not register todo protocol')
        console.error(err)
      }
    }
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Mac OS X sends url to open via this event
app.on('open-url', function (e, url) {
  console.log('open-url', url)
  if (url.startsWith('/')) {
    url = url.substr(1)
  }

  // if the main window has not been created yet
  initialUrl = stripCustomProtocol(url)
  devToolsLog('setting initial url to ' + initialUrl)

  if (mainWindow) {

    let params = {
      video: paramUrl
    };

    let paramString = "";
    for(let i=0; i<Object.keys(params).length; i++) {
      paramString = paramString + (Object.keys(params)[i] + "=" + encodeURIComponent(params[Object.keys(params)[i]]));
    }
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '/player/index.html?video=' + initialUrl),
      protocol: 'file:',
      slashes: true,
      search: paramString
    }))
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
