/**
 * ============================================================================
 * File: src/index.jsx
 * Description: Application entry point. Mounts the React tree into the DOM,
 *              wraps App in BrowserRouter for client-side routing, and
 *              imports the compiled SCSS design system (main.scss) which
 *              pulls in every abstracts/base/components/layout partial.
 * Usage / Imported By: Loaded directly by the build tool (CRA/Vite) as the
 *                       application bootstrap file.
 * ============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
