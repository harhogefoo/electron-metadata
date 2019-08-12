const { ipcRenderer } = require('electron')

const submitListener = document
  .querySelector('form')
  .addEventListener('submit', (event) => {
    // prevent default behavior that causes page refresh
    event.preventDefault()

    const files = [...document.getElementById('filePicker').files]
    const filesFormatted = files.map(file => {
      const { name, path } = file
      return { name, path }
    })

    // send the data to the main process
    ipcRenderer.send('files', filesFormatted)
  })

// metadata from the main process
ipcRenderer.on('metadata', (event, metadata) => {
  const pre = document.getElementById('data')

  pre.innerText = JSON.stringify(metadata, null, 2)
})

// error event from catch block in main process
ipcRenderer.on('metadata:error', (event, error) => {
  console.error(error)
})
