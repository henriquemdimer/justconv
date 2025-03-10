/* @refresh reload */
import './index.scss'
import App from './App.tsx'
import { createRoot } from 'react-dom/client'
import { client } from './lib/index.ts';

client.init();
createRoot(document.getElementById('root')!).render(<App />)
