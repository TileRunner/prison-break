import React from "react";
import PropTypes from "prop-types";
import * as c from './constants';

const ShowMoves = ({moves, onmoveclick}) => { // show moves made
    return (
      <div className="pbMoves">
        <div className="pbMovesTitle">MOVES</div>
        <div className="pbMovesScrollable" id="ScrollableMoves">
          {moves && moves.map((m, mi) => (
            <div key={`move${mi}`} className="pbMove" onClick={() => onmoveclick(mi)}>
              <span className="pbMove by">{m.isPrisonersMove ? c.PARTY_TYPE_PRISONERS : c.PARTY_TYPE_GUARDS}</span>
              :
              <span className={`pbMove ${m.isPass ? c.MOVE_TYPE_PASS : m.isExchange ? c.MOVE_TYPE_SWAP : c.MOVE_TYPE_PLAY}`}>
                {!m.isPass && !m.isExchange ?
                  <>{m.coords} {m.mainWord.replace("Q","Qu")}
                    {m.extraWords?.split(",").map((w, wi) => (
                      <span key={`extraword${wi}`}>
                        ,&nbsp;
                        {w.replace("Q","Qu")}
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
  moves: PropTypes.arrayOf(PropTypes.any),
  onmoveclick: PropTypes.func.isRequired
};

export default ShowMoves;  