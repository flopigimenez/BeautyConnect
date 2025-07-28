import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createRoot } from 'react-dom/client'
import RoutesApp from './routes/RoutesApp'
import '../styles.css'
import { store } from './redux/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Envolvemos la aplicación en Provider y pasamos la tienda de Redux como prop */}
      <Provider store={store}>
        <RoutesApp />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
