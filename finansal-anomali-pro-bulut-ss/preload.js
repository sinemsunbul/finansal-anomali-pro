const { contextBridge, ipcRenderer } = require("electron")

// Renderer process için güvenli bir API tanımla
contextBridge.exposeInMainWorld("electronAPI", {
  getData: () => ipcRenderer.invoke("get-data"),
  filterData: (filters) => ipcRenderer.invoke("filter-data", filters),
  filterHighScore: () => ipcRenderer.invoke("filter-high-score"),
})
