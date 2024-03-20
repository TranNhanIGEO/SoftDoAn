import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Protected, SignedIn } from './utils/ConfigRoutes';
import Navbar from './layouts/Navbar/Navbar';
import { Home, Admin, Login } from './pages';
import { MapProvider } from './contexts/MapContext'
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/interfaces/Toast/ToastContainer';

function App() {
  const getUser = useSelector(state => state.auth.login?.getUser)
  return (
    <Router>
      <div className="App">
        <ToastProvider>
          <ToastContainer />
          <MapProvider>
          <Navbar />
            <Routes>
              
              <Route path="/admin/">
                <Route index element={<Protected getUser={getUser}> <Admin /> </Protected>} />
                <Route path="login" element={<SignedIn getUser={getUser}> <Login /> </SignedIn>} />
                <Route path="logout" element={<Protected getUser={getUser} />} />
              </Route>

              <Route path="/">
                <Route index element={<Home />}/>
              </Route>

            </Routes>
          </MapProvider>
        </ToastProvider>
      </div>
    </Router>
  );
}

export default App;
