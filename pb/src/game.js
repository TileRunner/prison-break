import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PlayerSection from './playerSection';
import Board from './board';
import ShowUnseenTiles from './unseenTilesSection';
import ShowMoves from './movesSection';
import ShowRescues from './rescuesSection';
import * as c from './constants';
import { scrollToBottom } from "./scrollToBottom";
import { usePrevious } from "./usePrevious";
import { callGetGame, callMakeMove, determineInvalidWords } from "./callApi";

const Game = ({ participant // P=Prisoners, G=Guards
    , gameid
    , nickname='' // Give it a default for Build
    }) => {
    const [snats, setSnats] = useState(['Hello. This space is for debugging messages.']);
    const [racksize, setRacksize] = useState(4);
    const [middle, setMiddle] = useState(4); // Middle element in row or column array, fixed in initialize
    const [edge, setEdge] = useState(8); // Last element in row or column array, fixed in initialize
    const [tiles, setTiles] = useState([]);
    const [ptiles, setPtiles] = useState([]);
    const [gtiles, setGtiles] = useState([]);
    const [squareArray, setSquareArray] = useState([]);
    const [selection, setSelection] = useState(-1); // relative to rack of player making a play
    const [whoseturn, setWhoseturn] = useState(c.WHOSE_TURN_PRISONERS); // game starts with prisoners play
    const [currentcoords, setCurrentcoords] = useState([]);
    const [rescues, setRescues] = useState(0);
    const [rcd, setRcd] = useState([-1,-1,c.DIR_NONE]);
    const [moves, setMoves] = useState([]); // move history, each element is the array is a json object of info about the move
    const [jokeindex, setJokeindex] = useState(0);
    const [oppname, setOppname] = useState('');
    const prevRescues = usePrevious(rescues);
    function addSnat(snat) {
      let newSnats = [...snats];
      let current_datetime = new Date();
      let current_hours = current_datetime.getHours();
      let current_minutes = current_datetime.getMinutes();
      let current_seconds = current_datetime.getSeconds();
      let formatted_date = `${current_hours < 10 ? '0' : ''}${current_hours}:${current_minutes < 10 ? '0' : ''}${current_minutes}:${current_seconds < 10 ? '0' : ''}${current_seconds}`;
      newSnats.push(`${formatted_date}: ${snat}`);
      setSnats(newSnats);
    }

    useEffect(() => { // This code executes the first time Game is used only (but somehow it runs twice!)
      async function firstcall() {
        let apireturn = await callGetGame(gameid);
        // first time only values:
        setRacksize(apireturn.rackSize);
        setMiddle(apireturn.rackSize);
        setEdge(apireturn.rackSize * 2);
        if (participant === c.PARTY_TYPE_PRISONERS) {
          setOppname(apireturn.guardsName);
        }
        if (participant === c.PARTY_TYPE_GUARDS) {
          setOppname(apireturn.prisonersName);
        }
        // remaining values:
        let newWhoseturn = apireturn.finished ? c.WHOSE_TURN_GAMEOVER : apireturn.prisonersToMove ? c.PARTY_TYPE_PRISONERS : c.WHOSE_TURN_GUARDS;
        setWhoseturn(newWhoseturn);
        setPtiles(apireturn.prisonersRack);
        setGtiles(apireturn.guardsRack);
        setTiles(apireturn.tileBag);
        setMoves(apireturn.moves);
        setRescues(apireturn.rescues);
        setSquareArray(apireturn.squares);
        }
    firstcall();
    }, [gameid, participant]);
    useEffect(() => {
      scrollToBottom("ScrollableMoves");
    },[moves])
    useEffect(() => {
      scrollToBottom("ScrollableSnats");
    },[snats])
    useEffect(() => {
      if (rescues > prevRescues) {
          var myaudio = document.createElement('audio');
          myaudio.src = participant === c.PARTY_TYPE_GUARDS ? "https://tilerunner.github.io/OneGotAway.m4a" : "https://tilerunner.github.io/yippee.m4a";
          myaudio.play();
      }
    }, [rescues, participant, prevRescues]); // Play a sound when a rescue is made
    useEffect(() => {
      setJokeindex(current => current === c.JOKE_ARRAY.length - 1 ? 0 : current + 1);
    }, [whoseturn]); // want up to date value of whoseturn to decide whether to ask for an update

    useEffect(() => {
      const interval = setInterval(() => {
        if ((participant !== whoseturn && whoseturn !== c.WHOSE_TURN_GAMEOVER) || (!oppname)) {
          requestSyncData(); // Send a request for game data when waiting for their move or waiting for guards to join
        }
        }, c.PING_INTERVAL); // this many milliseconds between above code block executions
      return () => clearInterval(interval);
    });

    function putAtMoveStart() {
      setSelection(-1);
      setRcd([-1,-1,c.DIR_NONE]);
      setCurrentcoords([]);
    }
  
    // Calling setSelection (from handleKeyDown) then handleBoardSquareClick does not let it recognize selection with the new value
    // So I pass newSelection when I want to also set it, otherwise I pass -1 to instruct it to use current value of selection
    // Also passing newRcd
    const handleBoardSquareClick = (ri, ci, newSelection, newRcd) => {
      let newSquareArray = JSON.parse(JSON.stringify(squareArray)); // Deep copy
      let newSquareArrayRow = [...newSquareArray[ri]]; // The row of squares they clicked on
      let newSquareArrayCell = newSquareArrayRow[ci]; // The square in the row they clicked on
      let newPtiles = ptiles ? [...ptiles] : [];
      let newGtiles = gtiles ? [...gtiles] : [];
      let newCurrentcoords = [...currentcoords];
      let coord = String(ri) + "-" + String(ci);
      let cci = currentcoords.indexOf(coord);
      if (newSelection === -1) {
        newSelection = selection;
        newRcd = rcd;
      }
      if (newSelection > -1 && newSquareArrayCell.usedBy === c.USED_BY_NONE) { // tile is selected from rack and clicked square is not used yet
        let selectedTile = whoseturn === c.WHOSE_TURN_PRISONERS ? newPtiles[newSelection] : newGtiles[newSelection];
        newSquareArrayCell.letter = selectedTile;
        newSquareArrayCell.usedBy = whoseturn;
        newSquareArrayRow[ci] = newSquareArrayCell;
        newSquareArray[ri] = [...newSquareArrayRow];
        whoseturn === c.WHOSE_TURN_PRISONERS
          ? newPtiles.splice(newSelection, 1)
          : newGtiles.splice(newSelection, 1);
        if (whoseturn === c.WHOSE_TURN_PRISONERS && newSelection === newPtiles.length) { 
          newSelection = newSelection - 1
        }
        if (whoseturn === c.WHOSE_TURN_GUARDS && newSelection === newGtiles.length) { 
          newSelection = newSelection - 1
        }
        setSelection(newSelection);
        setSquareArray(newSquareArray);
        setPtiles(newPtiles);
        setGtiles(newGtiles);
        setCurrentcoords([...currentcoords, coord]);
        setRcd(newRcd); // key down handler figured it out
        return;
      }
      if (cci > -1) { // clicked square has a tile on it from the current move in progress, so put it back on the player rack
        whoseturn === c.WHOSE_TURN_PRISONERS
          ? newPtiles.push(newSquareArrayCell.letter)
          : newGtiles.push(newSquareArrayCell.letter);
        newSquareArrayCell.usedBy = c.USED_BY_NONE;
        newSquareArrayCell.letter = c.LETTER_NONE;
        newSquareArrayRow[ci] = newSquareArrayCell;
        newSquareArray[ri] = [...newSquareArrayRow];
        setSelection(
          whoseturn === c.WHOSE_TURN_PRISONERS ? newPtiles.length - 1 : newGtiles.length - 1
        );
        newCurrentcoords.splice(cci, 1);
        setSquareArray(newSquareArray);
        setPtiles(newPtiles);
        setGtiles(newGtiles);
        setCurrentcoords(newCurrentcoords);
        setRcd([-1,-1,c.DIR_NONE]); // make player click again to set direction
        return;
      }
      // They didn't click a square to place a selected tile there
      // They didn't click a square to remove an existing tile
      if (newSquareArrayCell.usedBy === c.USED_BY_NONE) {
        // There is nothing on the square so they are picking where to place the next tile via keyboard
        let newDirection = rcd[0] !== ri || rcd[1] !== ci ? c.DIR_RIGHT : //click new square, start with right
         rcd[2] === c.DIR_RIGHT ? c.DIR_DOWN : //click same square that was right, change to down
         rcd[2] === c.DIR_DOWN ? c.DIR_NONE : //click same square that was down, change to no direction
         c.DIR_RIGHT; // click same square that was no direction, change to right
        newRcd = [ri,ci,newDirection];
        setRcd(newRcd);
        return;
      }
    };
  
    const handleRackTileClick = (tileindex) => {
      // If no tile is selected already then set the selection
      if (selection === -1) {
        setSelection(tileindex);
        return;
      }
      // If the same tile is already selected then unselect
      if (selection === tileindex) {
        setSelection(-1);
        return;
      }
      // A tile was already selected and they clicked another tile - move the tile
      let newrack = participant === c.PARTY_TYPE_PRISONERS ? [...ptiles] : [...gtiles];
      let movefrom = selection;
      let movetile = newrack[movefrom];
      let moveto = tileindex;
      newrack.splice(movefrom, 1); // remove tile from original selected position
      newrack.splice(moveto,0,movetile); // insert moved tile at the newly selected position
      participant === c.PARTY_TYPE_PRISONERS ? setPtiles(newrack) : setGtiles(newrack);
      setSelection(-1);
    }
  
    async function endPlayersTurn() {
      if (!isPlayValid()) {
        return;
      }
      let playinfo = await getPlayInfo();
      if (playinfo.invalidwords.length !== 0) {
        alert(`Invalid according to ENABLE2K lexicon: ${playinfo.invalidwords.join().replace(".","?").toUpperCase()}`);
        return; // Do not apply the play
      }
      let apireturn = await callMakeMove(gameid, false, false, playinfo.mainword, playinfo.extrawords, playinfo.pos, moves.length);
      if (applyApireturn(apireturn)) {
        putAtMoveStart();
      }
    }

    function applyApireturn(apireturn) {
      if (apireturn.error) {
        addSnat(apireturn.error);
        return false;
      }
      let newWhoseturn = apireturn.finished ? c.WHOSE_TURN_GAMEOVER : apireturn.prisonersToMove ? c.PARTY_TYPE_PRISONERS : c.WHOSE_TURN_GUARDS;
      setWhoseturn(newWhoseturn);
      setPtiles(apireturn.prisonersRack);
      setGtiles(apireturn.guardsRack);
      setTiles(apireturn.tileBag);
      setMoves(apireturn.moves);
      setRescues(apireturn.rescues);
      setSquareArray(apireturn.squares);
      return true;
    }

    async function swapPlayersTiles() {
      if (tiles.length < racksize) {
        window.alert("Need " + racksize + " tiles in the bag to exchange")
        return;
      }
      let apireturn = await callMakeMove(gameid, false, true, '', '', '', moves.length);
      applyApireturn(apireturn);
    }
    
    function isPlayValid() {
      // Check if this is the first word since it affects the validity rules
      let firstWord = true;
      let nummoves = moves.length;
      for (var moveindex = 0; firstWord && (moveindex < nummoves); ++moveindex) {
        if (moves[moveindex].type === c.MOVE_TYPE_PLAY) {
          firstWord = false;
        }
      }
      // First word must hit center square
      if (firstWord && squareArray[middle][middle].usedBy === c.USED_BY_NONE) {
        window.alert("First play must hit center square");
        return false;
      }
      // At least 1 tile must be played
      if (currentcoords.length === 0) {
        window.alert("You didn't play any tiles");
        return false;
      }
      /* Go through each played tile
          Make sure it is not isolated from all the other tiles
          Determine the lowest and highest row and column numbers of tiles played this move
      */
      let numcoords = currentcoords.length;
      let lowrow = edge+1;
      let highrow = -1;
      let lowcol = edge+1;
      let highcol = -1;
      for (var coord=0; coord < numcoords; ++coord) { // Each tile played this move
        let temprow = parseInt(currentcoords[coord].split("-")[0]);
        let tempcol = parseInt(currentcoords[coord].split("-")[1]);
        if (temprow < lowrow) { lowrow = temprow;}
        if (temprow > highrow) { highrow = temprow;}
        if (tempcol < lowcol) { lowcol = tempcol;}
        if (tempcol > highcol) { highcol = tempcol;}
        // Make sure there is another tile immediately above, below, left, or right (not isolated)
        if (!(temprow > 0 && squareArray[temprow-1][tempcol].usedBy !== c.USED_BY_NONE) &&
          !(tempcol > 0 && squareArray[temprow][tempcol-1].usedBy !== c.USED_BY_NONE) &&
          !(temprow < edge && squareArray[temprow+1][tempcol].usedBy !== c.USED_BY_NONE) &&
          !(tempcol < edge && squareArray[temprow][tempcol+1].usedBy !== c.USED_BY_NONE)
          ) {
            window.alert("Each played tile must be part of a word");
            return false;
          }
      }
      // Using the high and low values, check if the play is in a straight line
      if (lowrow !== highrow && lowcol !== highcol) {
        window.alert("Tiles played must be in a straight line");
        return false;
      }
      let playthru = false;
      let hookmade = false;
      /* Traverse from first played tile to last player tile
          Make sure there are no unused squares inbetween (gaps in the played word)
          Check if we played through existing tiles
          Check if we hooked existing tiles/words
      */
      for (var temprow = lowrow; temprow <= highrow; ++temprow) {
        for (var tempcol = lowcol; tempcol <= highcol; ++tempcol) {
          if (squareArray[temprow][tempcol].usedBy === c.USED_BY_NONE) {
            window.alert("There is a gap in your word");
            return false;
          }
          if (!firstWord) { // Play through and hook not possible on first move
            let tempcoord = temprow + "-" + tempcol;
            if (currentcoords.indexOf(tempcoord) < 0) { // Tile was not played this move (was already on the board)
              playthru = true;
            }
            if (lowrow === highrow && temprow > 0 && squareArray[temprow-1][tempcol].usedBy !== c.USED_BY_NONE) { hookmade = true; }
            if (lowrow === highrow && temprow < edge && squareArray[temprow+1][tempcol].usedBy !== c.USED_BY_NONE) { hookmade = true; }
            if (lowcol === highcol && tempcol > 0 && squareArray[temprow][tempcol-1].usedBy !== c.USED_BY_NONE) { hookmade = true; }
            if (lowcol === highcol && tempcol < edge && squareArray[temprow][tempcol+1].usedBy !== c.USED_BY_NONE) { hookmade = true; }  
          }
        }
      }
      if (!firstWord) {
        // We already found play through a tile between first and last played tile
        // Now check if played word has a tile before first or after last played tile
        if (lowrow === highrow && lowcol > 0 && squareArray[lowrow][lowcol-1].usedBy !== c.USED_BY_NONE) { playthru = true; }
        if (lowrow === highrow && highcol < edge && squareArray[lowrow][highcol+1].usedBy !== c.USED_BY_NONE) { playthru = true; }
        if (lowcol === highcol && lowrow > 0 && squareArray[lowrow-1][lowcol] !== c.USED_BY_NONE) { playthru = true; }
        if (lowcol === highcol && highrow < edge && squareArray[highrow+1][lowcol].usedBy !== c.USED_BY_NONE) { playthru = true; }
        // Now we have fully identified play through we can make sure they played through or made a hook
        // This in mandatory since it is not the first move
        if (!playthru && !hookmade) {
          window.alert("New words must extend an existing word and/or hook existing words or tiles");
          return false;
        }
      }
      return true;
    }
  
    async function getPlayInfo() {
      let playinfo = {};
      let mainword = "";
      let extrawords = [];
      let wordstartcoord = "";
      let numrows = edge+1;
      let numcols = edge+1;
      let lowrow = numrows;
      let highrow = -1;
      let lowcol = numcols;
      let highcol = -1;
      let numcoords = currentcoords.length;
      for (var coord=0; coord < numcoords; ++coord) {
        let row = parseInt(currentcoords[coord].split("-")[0]);
        let col = parseInt(currentcoords[coord].split("-")[1]);
        if (row < lowrow) {
          lowrow = row;
        }
        if (row > highrow) {
          highrow = row;
        }
        if (col < lowcol) {
          lowcol = col;
        }
        if (col > highcol) {
          highcol = col;
        }
      }
      if (lowrow < highrow || numcoords === 1) { // tiles placed on difference rows so play is vertical, or single tile played
        let col = lowcol; // lowcol and highcol will have the same value
        // find the lowest row number of the main word, which may be lower than that of the first played tile
        let lowestrow = lowrow;
        while (lowestrow > 0 && squareArray[lowestrow-1][col].usedBy !== c.USED_BY_NONE) {
          lowestrow = lowestrow - 1;
        }
        // find the highest row number of the main word, which may be higher than that of the last played tile
        let highestrow = highrow;
        while (highestrow < edge && squareArray[highestrow+1][col].usedBy !== c.USED_BY_NONE) {
          highestrow = highestrow + 1;
        }
        wordstartcoord = c.BOARD_COL_HEADERS[col] + c.BOARD_ROW_HEADERS[lowestrow]; // vertical play coords start with col header
        for (var row = lowestrow; row <= highestrow; ++row) {
          mainword = mainword + squareArray[row][col].letter;
          let coord = row + "-" + col;
          if (currentcoords.indexOf(coord) > -1) { // This tile was played, check for hooks
            let lowestcol = col;
            while (lowestcol > 0 && squareArray[row][lowestcol-1].usedBy !== c.USED_BY_NONE) {
              lowestcol = lowestcol - 1;
            }
            let highestcol = col;
            while (highestcol < edge && squareArray[row][highestcol+1].usedBy !== c.USED_BY_NONE) {
              highestcol = highestcol + 1;
            }
            if (lowestcol < highestcol) { // hook was made
              let extraword = "";
              for (var tempcol = lowestcol; tempcol <= highestcol; ++tempcol) {
                extraword = extraword + squareArray[row][tempcol].letter;
              }
              extrawords = [...extrawords, extraword];
            }
          }
        }
      }
      if (mainword.length < 2) { // Horizontal play or single tile drop that cannot be a vertical play
        let row = lowrow; // lowrow and highrow will have the same value
        // find the lowest col number of the main word, which may be lower than that of the first played tile
        let lowestcol = lowcol;
        while (lowestcol > 0 && squareArray[row][lowestcol-1].usedBy !== c.USED_BY_NONE) {
          lowestcol = lowestcol - 1;
        }
        // find the highest col number of the main word, which may be higher than that of the last played tile
        let highestcol = highcol;
        while (highestcol < edge && squareArray[row][highestcol+1].usedBy !== c.USED_BY_NONE) {
          highestcol = highestcol + 1;
        }
        wordstartcoord = c.BOARD_ROW_HEADERS[row] + c.BOARD_COL_HEADERS[lowestcol]; // horizontal play coords start with row header
        mainword = ""; // In case we got a 1 letter mainword in the previous block
        extrawords = []; // Ditto
        for (var col = lowestcol; col <= highestcol; ++col) {
          mainword = mainword + squareArray[row][col].letter;
          let coord = row + "-" + col;
          if (currentcoords.indexOf(coord) > -1) { // This tile was played, check for hooks
            let lowestrow = row;
            while (lowestrow > 0 && squareArray[lowestrow-1][col].usedBy !== c.USED_BY_NONE) {
              lowestrow = lowestrow - 1;
            }
            let highestrow = row;
            while (highestrow < edge && squareArray[highestrow+1][col].usedBy !== c.USED_BY_NONE) {
              highestrow = highestrow + 1;
            }
            if (lowestrow < highestrow) { // hook was made
              let extraword = "";
              for (var temprow = lowestrow; temprow <= highestrow; ++temprow) {
                extraword = extraword + squareArray[temprow][col].letter;
              }
              extrawords = [...extrawords, extraword];
            }
          }
        }
      }
      let invalidwords = await validateWords(mainword, extrawords);
      playinfo = {mainword: mainword, extrawords: extrawords, pos: wordstartcoord, invalidwords: invalidwords};
      return playinfo;
    }

    async function validateWords(mainword, extrawords) {
      // Build complete list of newly formed words for validation against lexicon
      let allwords = mainword;
      extrawords.forEach((ew) => {
        allwords = allwords + "," + ew;
      })
      let invalidWords = determineInvalidWords(allwords);
      return invalidWords;
    }
  
    async function playerPassTurn() {
      let apireturn = await callMakeMove(gameid, true, false, '', '', '', moves.length);
      applyApireturn(apireturn);
    }

    async function requestSyncData() {
      let apireturn = await callGetGame(gameid);
      applyApireturn(apireturn);
    }
  
    const handleKeyDown = (event) => {
      event.preventDefault();
      if (participant !== whoseturn) {return;}
      if (event.key === "Enter") {
        endPlayersTurn();
        return;
      }
      if (event.key === "Escape") {
        return;
      }
      // eslint-disable-next-line
      let lettertest = /^[A-Za-z\?]$/; // single letter or question mark key pressed
      if (event.key.match(lettertest)) {
        let letter = event.key.toUpperCase();
        let rack = whoseturn === c.WHOSE_TURN_PRISONERS ? ptiles : gtiles;
        let newSelection = rack.indexOf(letter);
        if (newSelection === -1) {
          newSelection = rack.indexOf("?"); // Use the blank if they have one
        }
        if (newSelection > -1) { // Pressed letter is on the rack
          let row = rcd[0];
          let col = rcd[1];
          let dir = rcd[2];
          if (row >-1 && col > -1 && dir !== c.DIR_NONE) { // row, col, dir are set to accept keystroke
            // Need to figure out next sqaure to auto-place a tile
            let newRcd = rcd;
            if (dir === c.DIR_RIGHT) { // playing rightwards
              let newc = -1;
              for (var tempcol = col + 1; tempcol < edge + 1 && newc === -1; tempcol++) {
                if (squareArray[row][tempcol].usedBy === c.USED_BY_NONE) {
                  newc = tempcol;
                }
              }
              if (newc === -1) {
                newRcd = [-1,-1,c.DIR_NONE];
              } else {
                newRcd = [row, newc, c.DIR_RIGHT];
              }
              handleBoardSquareClick(row,col,newSelection,newRcd);
              setSelection(-1); // when they are typing they are not selecting rack tiles by clicking them on the rack
              return;
            }
            if (dir === c.DIR_DOWN) { // playing downwards
              let newr = -1;
              let numrows = (racksize*2)+1;
              for (var temprow = row + 1; temprow < numrows && newr === -1; temprow++) {
                if (squareArray[temprow][col].usedBy === c.USED_BY_NONE) {
                  newr = temprow;
                }
              }
              if (newr === -1) {
                newRcd = [-1,-1,c.DIR_NONE];
              } else {
                newRcd = [newr, col, c.DIR_DOWN];
              }
              handleBoardSquareClick(row,col,newSelection,newRcd);
              setSelection(-1); // when they are typing they are not selecting rack tiles by clicking them on the rack
              return;
            }
          }
        }
        return;
      }
      if (event.key === "Backspace" && currentcoords.length > 0) {
        // Same as clicking on a played-this-move tile in terms of returning the tile to the rack
        // However we also want to set up rcd so they can press the key they meant and continue
        let coord = currentcoords[currentcoords.length - 1]; // tile to return to rack
        let row = parseInt(coord.split("-")[0]);
        let col = parseInt(coord.split("-")[1]);
        let newCurrentcoords = [...currentcoords];
        let newPtiles = [...ptiles];
        let newGtiles = [...gtiles];
        let newSquareArray = JSON.parse(JSON.stringify(squareArray)); // Deep copy
        let newSquareArrayRow = newSquareArray[row];
        let newSquareArrayCell = newSquareArrayRow[col];
        let newRcd = [-1,-1,c.DIR_NONE];
        let newSelection = selection;
        newCurrentcoords.splice(currentcoords.length-1,1);
        let returnedTile = squareArray[row][col].letter;
        if (whoseturn === c.WHOSE_TURN_PRISONERS) {
          newPtiles.push(returnedTile);
          newSelection = newPtiles.length-1;
        } else {
          newGtiles.push(returnedTile);
          newSelection = newGtiles.length-1;
        }
        newSquareArrayCell.usedBy = c.USED_BY_NONE;
        newSquareArrayCell.letter = c.LETTER_NONE;
        newSquareArrayRow[col] = newSquareArrayCell;
        newSquareArray[row] = [...newSquareArrayRow];
        let dir = rcd[2];
        if (dir !== c.DIR_NONE) {
          // direction was set so keep it
          newRcd = [row,col,dir];
          if (currentcoords.length === 1) {
            newSelection = -1; // if they backspace all the letters off leave rack tile unselected
          }
        }
        setCurrentcoords(newCurrentcoords);
        setGtiles(newGtiles);
        setPtiles(newPtiles);
        setSquareArray(newSquareArray);
        setRcd(newRcd);
        setSelection(newSelection);
      }
    }
    const handleMoveClick = () => {}
    return (
      <div className="prisonbreak">
        <div className="w3-display-container w3-teal topBarHeight">
          <div className="w3-display-middle">
            <h1 className="myHeadingFont">Prison Break</h1>
          </div>
          <div className="w3-display-topleft w3-black topBarCorner commonFontFamily">
            Game id: {gameid}
          </div>
          <div className="w3-display-bottomleft w3-orange topBarCorner commonFontFamily">
            Prisoners: {
              participant === c.PARTY_TYPE_PRISONERS ? nickname
              : participant === c.PARTY_TYPE_GUARDS ? oppname
              : 'Secret'
              }
          </div>
          <div className="w3-display-bottomright w3-orange topBarCorner commonFontFamily">
            Guards: {
              participant === c.PARTY_TYPE_PRISONERS ? oppname
              : participant === c.PARTY_TYPE_GUARDS ? nickname
              : 'Secret'
              }
          </div>
        </div>
        <div className="row">
          <div className="col pbTileAndMovesOuter">
              <ShowUnseenTiles
                tiles={tiles}
                othertiles={participant === c.PARTY_TYPE_PRISONERS ? gtiles : ptiles}
                />
              <ShowMoves moves={moves} onmoveclick={(mi) => handleMoveClick(mi)}/>
          </div>
          <div className="col pbPlayerOuterSection">
            <PlayerSection
              racktiles={participant === c.PARTY_TYPE_PRISONERS ? ptiles : gtiles}
              whoseturn={whoseturn}
              selection={selection}
              onClick={(ti) => handleRackTileClick(ti)}
              onClickFinishTurn={() => endPlayersTurn()}
              onClickTileExchange={() => swapPlayersTiles()}
              onClickPassPlay={() => playerPassTurn()}
              participant={participant}
              moves={moves}
            />
          </div>
          <div className="col">
            {participant === whoseturn ?
              <div className="row" onKeyDownCapture={handleKeyDown}>
                <Board
                  squareArray={squareArray}
                  rcd={rcd}
                  onClick={(ri, ci) => handleBoardSquareClick(ri, ci, -1,null)}
                />
              </div>
            :
              <div className="row">
                <Board
                  squareArray={squareArray}
                  rcd={rcd}
                  onClick={() => {}}
                />
              </div>
            }
          </div>
          <div className="col">
            <ShowRescues rescues={rescues ? rescues : 0} />
          </div>
        </div>
        <div className="w3-display-container w3-teal topBarHeight">
          <div className="w3-display-middle commonFontFamily">
            {whoseturn === c.WHOSE_TURN_GAMEOVER ?
              <h1>Game Over!</h1>
            :
              <p>{c.JOKE_ARRAY[jokeindex]}</p>
            }
          </div>
        </div>
        {nickname && nickname.length > 3 && nickname.toUpperCase().substring(0,4) === 'TEST' &&
          <div id="ScrollableSnats" className="pbSnatDiv">
            {snats.map((snat,i) => (
             <p key={`snat${i}`} className="pbSnat">{snat}</p>
            ))}
          </div>
        }
      </div>
    );
  };

  Game.propTypes = {
    participant: PropTypes.string.isRequired,
    gameid: PropTypes.number.isRequired,
    nickname: PropTypes.string.isRequired,
  };
  

export default Game;
