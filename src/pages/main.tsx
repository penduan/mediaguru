import React from "react";
import { render } from 'react-dom';
import Main from "src/components/Main";

export default function createApp() {

  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  render(<Main />, container)
}

;('undefined' != typeof wx && wx.getSystemInfoSync) || createApp()
