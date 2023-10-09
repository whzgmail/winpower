// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('node:path')
const { spawn,exec } = require('child_process');
const iconv = require('iconv-lite');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame : false,
    show: false,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.maximize()
  mainWindow.show()
  // 加载 index.html
  mainWindow.loadFile('html/dist/index.html')
//   mainWindow.loadURL('http://127.0.0.1:8080/#/')
  mainWindow.menuBarVisible = false

  // 打开开发工具
//   mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。


ipcMain.handle('query-power-plant', async () => {
    // 创建一个函数，用于执行 cmd 命令 powercfg /QUERY
    const options = {
        encoding: 'buffer',
        timeout: 0,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        cwd: null,
        env: null
    }
    res = await new Promise((resolve, reject) => {
        console.log('start query power plant..........')
        exec('powercfg /QUERY', options, (error, stdout, stderr) => {
            console.log('done ......')
            if (error) {
                console.error(`执行出错: ${error}`)
                reject(false)
            }
            stdout = iconv.decode(stdout, 'cp936')
            power_plant = { subs:[] }
            lines = stdout.split("\n")
            header = lines.shift()
            if(/GUID: (.*?)  \((.*?)\)/.test(header)){
                power_plant.guid = RegExp.$1
                power_plant.name = RegExp.$2
            }
            var sub = {
                settings:[]
            }
            var setting = {}
            var item = {}
            lines.forEach((r)=>{
                if(/子组 GUID: (.*?)  \((.*?)\)/.test(r)){
                    sub = {
                        guid:RegExp.$1,
                        name:RegExp.$2,
                        settings:[]
                    }
                    power_plant.subs.push(sub)
                    return
                }

                if(/电源设置 GUID: (.*?)  \((.*?)\)/.test(r)){
                    setting = {
                        guid:RegExp.$1,
                        name:RegExp.$2
                    }
                    sub.settings.push(setting)
                    return
                }

                if(/最小可能的设置: (.*)/.test(r)){
                    setting.min = RegExp.$1
                    return
                }
                if(/最大可能的设置: (.*)/.test(r)){
                    setting.max = RegExp.$1
                    return
                }
                if(/可能的设置增量: (.*)/.test(r)){
                    setting.possible = RegExp.$1
                    return
                }
                if(/可能的设置单位: (.*)/.test(r)){
                    setting.unit = RegExp.$1
                    return
                }
                if(/当前交流电源设置索引: (.*)/.test(r)){
                    setting.ac = parseInt(RegExp.$1,16)
                    if( setting.items ) setting.ac = '00'+setting.ac
                    return
                }
                if(/当前直流电源设置索引: (.*)/.test(r)){
                    setting.dc = parseInt(RegExp.$1,16)
                    if( setting.items ) setting.dc = '00'+setting.dc
                    return
                }

                if(/可能的设置索引: (.*)/.test(r)){
                    if( ! setting.items ){ setting.items = [] }
                    item = { value : RegExp.$1 }
                    setting.items.push(item)
                    return
                }

                if(/可能的设置友好名称: (.*)/.test(r)){
                    item.label = RegExp.$1
                    return
                }

            })
            // event.sender.send('query-power-plant-result', power_plant);
            resolve(power_plant)
        })
    })
    return res
});

ipcMain.handle('set-power-plant', async (event, type,plant_guid,sub_guid,setting_guid,value) => {
    console.log('[main] change power plant setting',type,plant_guid,sub_guid,setting_guid,value)

    // 创建一个函数，用于执行 cmd 命令 pwoercfg /QUERY
    const options = {
        encoding: 'buffer',
        timeout: 0,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        cwd: null,
        env: null
    }

    type = type == 'ac' ? '/SETACVALUEINDEX' : '/SETDCVALUEINDEX'
    command = `powercfg ${type} ${plant_guid} ${sub_guid} ${setting_guid} ${value}`
    console.log(command)
    return await new Promise( (resolve,reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行出错: ${error}`)
                reject( false );
                return
            }
            stdout = iconv.decode(stdout, 'cp936')
            resolve(true)
        })
    })
})