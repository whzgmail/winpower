const { contextBridge,ipcRenderer } = require('electron')


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
})


contextBridge.exposeInMainWorld('myapi', {
    // queryPowerPlant(calback){
    //     ipcRenderer.send('query-power-plant')
    //     ipcRenderer.on('query-power-plant-result', calback);
    // },
    // setPowerPlant(type,plant_guid,sub_guid,setting_guid,value,calback){
    //     ipcRenderer.send('set-power-plant', type,plant_guid,sub_guid,setting_guid,value )
    //     ipcRenderer.on('set-power-plant-result', calback);
    // }
    queryPowerPlant:()=>ipcRenderer.invoke('query-power-plant'),
    setPowerPlant:(type,plant_guid,sub_guid,setting_guid,value)=>ipcRenderer.invoke('set-power-plant', type,plant_guid,sub_guid,setting_guid,value ),

})
