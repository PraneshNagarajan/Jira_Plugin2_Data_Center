import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Pages/App';

// Waits until everything on the page is fully loaded — HTML, CSS, JS, images. 
// Safer than DOMContentLoaded in Jira because Jira's own scripts finish loading first.

// React 16 - Accept terrnary operation
// ReactDOM.render(
//   <App />,
//   root_container ? root_container : false
// );


// React 18/19
window.addEventListener('load', () => {
  const root = document.getElementById('container')
  const backend_info = document.getElementById('backendInfo').value;
  if (root) {
    // put <App /> inside <div id="container">
    const root_container = ReactDOM.createRoot(root)  
    root_container.render(<React.StrictMode><App info={backend_info} /></React.StrictMode>)
  }
})
