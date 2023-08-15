import React from 'react'
import ReactDOM from 'react-dom'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  ReactDOM.render(<div>Log page</div>, container)
}

;('undefined' != typeof wx && wx.getSystemInfoSync) || createApp()
