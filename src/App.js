import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import useToken from './useToken';

function App() {
  const { token, setToken } = useToken();

  if (!token) return <Login setToken={setToken}/> //aqui voy a login si no tiene token.
  
  return (
    <div className="wrapper">
      <h1>Clients visualization</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home token={token}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
