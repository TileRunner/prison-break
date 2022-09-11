import './App.css';
import './prisonbreak.css';
import {useState} from 'react';
import Table from 'react-bootstrap/Table';
import Login from './login';
import ShowGameList from './showGameList';
import ShowChat from './showChat';
import Game from './game';
import * as c from './constants';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [inLobby, setInLobby] = useState(true);
  const [gamenumber, setGamenumber] = useState(-1);
  const [gamechatnumber, setGamechatnumber] = useState(-1);
  const [participant, setParticipant] = useState(c.PARTY_TYPE_UNDETERMINED);
  return (
    <div>
      <header  className="trBackground">
          {inLobby && <Login
           loggedIn={loggedIn}
           setLoggedIn={setLoggedIn}
           username={username}
           setUsername={setUsername}
          />}
          {loggedIn && inLobby &&
            <Table>
              <thead>
                  <tr className='trSubtitle'>
                      <th>Game List</th>
                      <th>Chat</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td><ShowGameList username={username} setInLobby={setInLobby} setGamenumber={setGamenumber} setGamechatnumber={setGamechatnumber} setParticipant={setParticipant}/></td>
                      <td><ShowChat chattype='PRISONBREAK' username={username}/></td>
                  </tr>
              </tbody>
            </Table>
          }
          {loggedIn && !inLobby &&
            <Table>
              <thead>
                <tr className='trSubtitle'>
                      <th>Game</th>
                      <th>Chat</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>
                        <Game
                         participant={participant}
                         gameid={gamenumber}
                         nickname={username}
                        />
                      </td>
                      <td><ShowChat chattype='GAMECHAT' chatnumber={gamechatnumber} username={username}/></td>
                  </tr>
              </tbody>
            </Table>
          }
      </header>
    </div>
  );
}

export default App;
