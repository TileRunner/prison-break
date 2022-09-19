import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { callGetGameList, callCreateGame, callJoinGame, callDeleteGame } from "./callApi";
import { formatTime } from "./formatTime";
import GetOptions from "./getOptions";
import * as c from './constants';

const ShowGameList = ({username, setInLobby, setGamenumber, setGamechatnumber, setParticipant}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [gamelist, setGamelist] = useState([]);
    const hasFetchedData = useRef(false);
    const [showOptions, setShowOptions] = useState(false);
    useEffect(() => {
        async function fetchData() {
            let jdata = await callGetGameList();
            if (jdata.error) {
                setErrorMessage(jdata.error);
            } else {
                if (JSON.stringify(jdata.gamelist) !== JSON.stringify(gamelist)) {
                    setGamelist(jdata.gamelist);
                }
                setErrorMessage('');
            }
        }
        if (!hasFetchedData.current) {            
            fetchData();
            hasFetchedData.current = true;
        }
        const timer = setInterval(() => {
            fetchData();
        },3000); // every 3 seconds
        return () => clearInterval(timer);
    });
    async function createNewGame(options) {
        let jdata = await callCreateGame(username, options.rackSize);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInLobby(false);
            setErrorMessage('');
            setParticipant(c.PARTY_TYPE_PRISONERS)
        }
    }
    async function joinGame(joingamenumber) {
        let jdata = await callJoinGame(joingamenumber,username);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInLobby(false);
            setErrorMessage('');
            setParticipant(jdata.guardsName === username ? c.PARTY_TYPE_GUARDS : c.PARTY_TYPE_PRISONERS);
        }
    }
    async function deleteGame(deletegamenumber) {
        let jdata = await callDeleteGame(deletegamenumber,username);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamelist(jdata.gamelist);
            setErrorMessage('');
        }
    }
    return (<div>
        {errorMessage && <p className="trWarning">Error: {errorMessage}</p>}
        <p className="trParagraph">
            Number of games: {gamelist ? gamelist.length : 'Loading...'}
        </p>
        {gamelist && gamelist.length > 0 && <Table striped bordered hover size="sm" variant="dark" responsive="sm">
            <thead>
                <tr>
                    <th>Game #</th>
                    <th>Prisoners</th>
                    <th>Guards</th>
                    <th>Create Time</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {gamelist.map((game) => (
                <tr key={`gamelist${game.number}`}>
                    <td>{game.number}</td>
                    <td>{game.prisonersName}</td>
                    <td>{game.guardsName}</td>
                    <td>{formatTime(game.createTime)}</td>
                    <td>{game.finished ? 'Finished' : game.started ? 'In Progress' : 'Not Started'}</td>
                    <td>
                        <Row>
                        {
                        (!game.guardsName || username === game.prisonersName || username === game.guardsName) &&
                        <Col><Button key={`joinbutton${game.number}`}
                        onClick={() => {joinGame(game.number);}}>
                            Join
                        </Button></Col>}
                        { (game.finished && (username === game.prisonersName || username === game.guardsName)) &&
                        <Col><Button key={`deletebutton${game.number}`}
                        variant='danger'
                        onClick={() => {deleteGame(game.number);}}>
                            Delete
                        </Button></Col>
                        }
                        </Row>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>}
        {!showOptions && <Row>
            <Col xs='auto'>
                <Button onClick={() => {setShowOptions(true);}}>
                    Create Game
                </Button>
            </Col>
        </Row>}
        {showOptions && <GetOptions submitOptions={createNewGame} cancelOptions={() => {setShowOptions(false)}}/>}
    </div>
    )
}

export default ShowGameList;