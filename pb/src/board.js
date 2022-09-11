import React from "react";
import PropTypes from "prop-types";
import Square from './square';
import * as c from './constants';

// Here I used default squareArray=[] so the npm run build always has squareArray defined
const Board = ({ onClick, squareArray=[], rcd }) => {
    const renderSquare = (square, ri, ci) => {
      return (
        <td key={`Square${ri}-${ci}`} className="pbSquareOuter">
          <Square
            usedBy={square.usedBy}
            type={square.isEscapeHatch ? 'EscapeHatch'
             : square.isCenterSquare ? 'CenterSquare'
             : square.usedBy === c.USED_BY_PRISONERS || square.usedBy === c.USED_BY_GUARDS ? 'PlayerTile'
             : square.isPrimarySquare ? 'style1'
             : 'style2'
            }
            letter={square.letter}
            ri={ri}
            ci={ci}
            rcd={rcd}
            onClick={() => onClick(ri, ci)}
          />
        </td>
      );
    };
    const renderRow = (ri) => {
      return (
        <tr key={`BoardRow${ri}`} className="pbRow">
          <td className="pbBoardRowHeader" id="BoardHeaderLeft">
            {c.BOARD_ROW_HEADERS[ri]}
          </td>
          {squareArray[ri].map((square, ci) => renderSquare(square, ri, ci))}
          <td className="pbBoardRowHeader" id="BoardHeaderRight">
            {c.BOARD_ROW_HEADERS[ri]}
          </td>
        </tr>
      );
    };
  
    return (
      <table className="pbBoard">
        <tbody>
          <tr className="pbBoardColumnHeaderRow">
            <td className="pbBoardHeaderTopLeft">&nbsp;</td>
            {squareArray.map((_$,i) => (
              <td className="pbBoardColumnHeader" key={`TopColumnHeader${i}`}>
                {c.BOARD_COL_HEADERS[i]}
              </td>
            ))}
            <td className="pbBoardHeaderTopRight">&nbsp;</td>
          </tr>
          {squareArray.map((r, ri) => renderRow(ri))}
          <tr className="pbBoardColumnHeaderRow" id="BoardHeaderBottom">
            <td className="pbBoardHeaderBottomLeft">&nbsp;</td>
            {squareArray.map((_$,i) => (
              <td className="pbBoardColumnHeader" key={`BottomColumnHeader${i}`}>
                {c.BOARD_COL_HEADERS[i]}
              </td>
            ))}
            <td className="pbBoardHeaderBottomRight">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    );
  };
  
Board.propTypes = {
  onClick: PropTypes.func.isRequired,
  squareArray: PropTypes.arrayOf(PropTypes.any),
  rcd: PropTypes.arrayOf(PropTypes.any)
};

export default Board;