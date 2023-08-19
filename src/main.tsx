import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NDKProvider } from "@nostr-dev-kit/ndk-react"


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NDKProvider
      relayUrls={[
        "ws://127.0.0.1:8080"
      ]}
    >

      <App />
    </NDKProvider>
  </React.StrictMode>,
)
