import React from "react";
import PropTypes from "prop-types";
import * as c from './constants';


const PlayerSection = (props) => {
    const playerIcon = props.participant === c.PARTY_TYPE_PRISONERS ? c.PARTY_ICON_PRISONERS : c.PARTY_ICON_GUARDS;
    const playerTitle = props.participant === c.PARTY_TYPE_PRISONERS ? c.PARTY_TITLE_PRISONERS : c.PARTY_TITLE_GUARDS;
  
    return (
      <div className="pbPlayerInnerSection">
        <div className="pbPlayerTitle"><i className="material-icons">{playerIcon}</i>&nbsp;{playerTitle}&nbsp;<i className="material-icons">{playerIcon}</i></div>
        <div className="pbTilerack">
            {/* I have to check props.racktiles so the Build does not fail on 'map' undefined */}
            {props.racktiles && props.racktiles.map((t, ti) =>
                <RackTile
                    key={`RackTile${ti}`}
                    whoseturn={props.whoseturn}
                    participant={props.participant}
                    selection={props.selection}
                    tileindex={ti}
                    tilevalue={t}
                    onClick={() => props.onClick(ti)}
                />
            )}
        </div>
        {props.whoseturn === props.participant &&
          showActionButtons(props)
        }
      </div>
    );
  };

PlayerSection.propTypes = {
    participant: PropTypes.string.isRequired,
    racktiles: PropTypes.arrayOf(PropTypes.string),
    whoseturn: PropTypes.string.isRequired,
    selection: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    moves: PropTypes.arrayOf(PropTypes.any)
};

const RackTile = (props) => {
    const selectedUnselected = props.selection === props.tileindex ? "Selected " : "Unselected ";
    const uNotU = props.tilevalue === "Q" ? "u " : "";
    const tileclass = "pbTileOnRack " + selectedUnselected + uNotU + props.participant;
    const tileindex = props.tileindex;
    return (
        <div
            key={tileindex}
            className={tileclass}
            onClick={(tileindex) => props.onClick(tileindex)}
        >
            <div className="pbTileOnRackText">{props.tilevalue}</div>
        </div>
    );
}

RackTile.propTypes = {
    selection: PropTypes.number.isRequired,
    tileindex: PropTypes.number.isRequired,
    tilevalue: PropTypes.string.isRequired,
    participant: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

const FinishTurnButton = (props) => {
    return (
      <button className="pbActionButton" onClick={props.onClick}>
        <span className="pbActionButtonText"><i className="material-icons">check</i>&nbsp;Finish Turn</span>
      </button>
    );
  };

  FinishTurnButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

const TileExchangeButton = (props) => {
    return (
        <button className="pbActionButton" onClick={props.onClick}>
            <span className="pbActionButtonText"><i className="material-icons">cached</i>&nbsp;Swap Tiles</span>
        </button>
    );
};

TileExchangeButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

const PassPlayButton = (props) => {
    return (
        <button className="pbActionButton" onClick={props.onClick}>
            <span className="pbActionButtonText"><i className="material-icons">not_interested</i>&nbsp;Pass Turn</span>
        </button>
    );
};

PassPlayButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

function showActionButtons(props) {
    return <div className="pbActionButtonDiv">
        <p>
            <FinishTurnButton onClick={() => props.onClickFinishTurn()} />
        </p>
        <p>
            <TileExchangeButton onClick={() => props.onClickTileExchange()} />
        </p>
        <p>
            <PassPlayButton onClick={() => props.onClickPassPlay()} />
        </p>
    </div>;
}

export default PlayerSection;