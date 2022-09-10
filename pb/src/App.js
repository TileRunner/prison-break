import './App.css';
import {useState} from 'react';
import Login from './login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  return (
    <div>
      <header className="App">
          {!loggedIn && <Login
           loggedIn={loggedIn}
           setLoggedIn={setLoggedIn}
           username={username}
           setUsername={setUsername}
          />}
          Under construction...
      </header>
    </div>
  );
}

export default App;
