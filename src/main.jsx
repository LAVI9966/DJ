import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './redux/store.jsx'
import { Provider } from 'react-redux'
import { PlayerProvider } from './context/player/playerContext.jsx'
import Play from './components/player/play2.jsx'
import { Auth0Provider } from "@auth0/auth0-react";
import MyStates from './context/data/myStates.jsx'
import { FavoritesProvider } from './context/player/FavoritesProvider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-msjrwkev4m8lmvoq.us.auth0.com"
      clientId="BOHu9cjrlAcceqg0byDe4FfSosihBY2t"
      authorizationParams={{ redirect_uri: window.location.origin }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <FavoritesProvider>

        <PlayerProvider>
          <Provider store={store}>
            <MyStates>
              <App />

              <Play></Play>
            </MyStates>
          </Provider>
        </PlayerProvider>
      </FavoritesProvider>
    </Auth0Provider>
  </StrictMode>,
)

