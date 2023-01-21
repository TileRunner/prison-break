import React, { useState } from 'react';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ExchangeTiles = ({originalTiles, acceptSwapTiles, cancelSwapTiles}) => {
  const [tiles, setTiles] = useState([]); // tiles to swap

  function clickTile(index) {
    let newtiles = [...tiles];
    if (tiles.indexOf(index) < 0) {
        // not selected so select it
        newtiles = [...newtiles, index];
    } else {
        // selected already so deselect it
        newtiles.splice(tiles.indexOf(index), 1);
    }
    setTiles(newtiles);
  }

  function mysubmit() {
    let swaps = '';
    tiles.forEach((value) => {
        if (tiles.indexOf(value) > -1) {
            swaps = swaps + originalTiles[value];
        }
    });
    acceptSwapTiles(swaps);
  }

  function mycancel() {
    setTiles([]);
    cancelSwapTiles();
  }

  return (
    <>
      <Modal show onHide={mycancel} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Tile Exchange</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Click on the tiles you wish to exchange.</p>
            <ButtonToolbar>
            {originalTiles.map((tile, index) => (
                <ButtonGroup key={index}>
                    <Button
                    variant={tiles.indexOf(index) < 0 ? 'secondary' : 'primary'}
                    onClick={() => {clickTile(index);}}
                    >{tile}</Button>
                </ButtonGroup>
                ))}

            </ButtonToolbar>
            <p>Selected:
                {tiles.map((value) => (
                    <span> {originalTiles[value]}</span>
                ))}
            </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={mycancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={mysubmit} disabled={tiles.length === 0}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ExchangeTiles;