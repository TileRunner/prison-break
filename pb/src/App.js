import './App.css';
import './prisonbreak.css';
import {useState} from 'react';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Login from './login';
import ShowGameList from './showGameList';
import ShowChat from './showChat';
import Game from './game';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [inLobby, setInLobby] = useState(true);
  const [gamenumber, setGamenumber] = useState(-1);
  const [gamechatnumber, setGamechatnumber] = useState(-1);
  console.log(`Render App ${loggedIn}|${username}|${inLobby}|${gamenumber}|${gamechatnumber}`);
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
                      <td><ShowGameList username={username} setInLobby={setInLobby} setGamenumber={setGamenumber} setGamechatnumber={setGamechatnumber}/></td>
                      <td><ShowChat chattype='PRISONBREAK' username={username}/></td>
                  </tr>
              </tbody>
            </Table>
          }
          {inLobby && <div>
            <a href="http://www.scrabbleplayers.org"><img border="0" src="http://www.scrabbleplayers.org/pix/logo-only-160px.png" alt="[NASPA Logo]"/></a>
            <span className='ackNASPA'>NWL20 used with permission from NASPA</span>
            </div>}
          {loggedIn && !inLobby &&
            <div>
              <Row>
                <Col xs={9}>
                  <Game
                    gameid={gamenumber}
                    nickname={username}
                    setInLobby={setInLobby}
                  />
                </Col>
                <Col xs={3}>
                  <ShowChat chattype='GAMECHAT' chatnumber={gamechatnumber} username={username}/>
                </Col>
              </Row>
            </div>
          }
      </header>
    </div>
  );
}

export default App;
