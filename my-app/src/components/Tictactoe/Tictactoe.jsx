import React, { useContext, useEffect, useState } from 'react';
import { LangContext } from '../../App.js';
import Board from './Board.jsx';
import Header from './Header.jsx';
import Reset from './Reset.jsx';

const PLAYERX = "Player 1 - Xs";
const PLAYER0 = "Player 2 - 0s";

export function Tictactoe(props) {
  // Hacemos uso del contexto para cambiar las traducciones de los textos asociados a los turnos y los movimientos
  const {dictionary} = useContext(LangContext)
  const [turn, setTurn] = useState(PLAYERX);
  const [moves, setMoves] = useState(0);
  const [values, setValues] = useState([
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
    ]);

  useEffect(() => {
    document.title = `${dictionary.tictactoe.turn} ${turn}`;
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://myjson.dit.upm.es/api/bins/ccr5");
      const myjson = await res.json();
      setTurn(myjson.turn);
      setMoves(myjson.moves);
      setValues(myjson.values);
    }

    fetchData();
  }, []);

  function appClick(rowNumber, columnNumber) {
      let valuesCopy = JSON.parse(JSON.stringify(values));
      let newMovement = turn === PLAYERX ? 'X' : '0';
      valuesCopy[rowNumber][columnNumber] = newMovement;
      setTurn(turn === PLAYERX ? PLAYER0 : PLAYERX);
      setValues(valuesCopy);
      setMoves(moves + 1); 
  }

  function resetClick(){
    setTurn(PLAYERX);
    setMoves(0);
    setValues([
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-']
    ]);
  }

  
  let text = dictionary.tictactoe.turn + turn;

  return (
    <div className='main-container'>
      <Header text={text}/>
      <Board values={values}  appClick={appClick}/>
      <h3>{dictionary.tictactoe.movements}: {moves}</h3>
      <Reset resetClick={resetClick}></Reset>
    </div>
  );
}
