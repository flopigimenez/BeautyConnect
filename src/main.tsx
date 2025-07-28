import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import '../styles.css'
import App from './App'
import { store } from './redux/store';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Envolvemos la aplicación en Provider y pasamos la tienda de Redux como prop */}
      <Provider store={store}>
        <App /> {/* Renderizamos el componente principal de la aplicación */}
      </Provider>
       </BrowserRouter>
  </StrictMode>,
)
