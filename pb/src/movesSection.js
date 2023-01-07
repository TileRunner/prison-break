import React from "react";
import PropTypes from "prop-types";
import * as c from './constants';

const ShowMoves = ({moves}) => { // show moves made
    return (
      <div className="pbMoves">
        <div className="pbMovesTitle">Moves made:</div>
        <div className="pbMovesScrollable" id="ScrollableMoves">
          {moves && moves.map((m, mi) => (
            <div key={`move${mi}`} className="pbMove">
              <span className="pbMove by">{m.isPrisonersMove ? c.PARTY_TYPE_PRISONERS : c.PARTY_TYPE_GUARDS}</span>
              :
              <span className={`pbMove ${m.isPass ? c.MOVE_TYPE_PASS : m.isExchange ? c.MOVE_TYPE_SWAP : c.MOVE_TYPE_PLAY}`}>
                {!m.isPass && !m.isExchange ?
                  <>{m.coords} {m.mainWord}
                    {m.extraWords?.split(",").map((w, wi) => (
                      <span key={`extraword${wi}`}>
                        ,&nbsp;
                        {w}
                      </span>
                    ))}
                  </>
                :
                  <></>
                }
              </span>
            </div>
            ))}
        </div>
      </div>
    );
};
  
ShowMoves.propTypes = {
  moves: PropTypes.arrayOf(PropTypes.any)
};

export default ShowMoves;  