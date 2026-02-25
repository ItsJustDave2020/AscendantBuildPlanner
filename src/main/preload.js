const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  saveBuild: (name, data) => ipcRenderer.invoke('save-build', { name, data }),
  loadBuild: (name) => ipcRenderer.invoke('load-build', { name }),
  listBuilds: () => ipcRenderer.invoke('list-builds'),
  deleteBuild: (name) => ipcRenderer.invoke('delete-build', { name }),
})
