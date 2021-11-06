import './App.css';
import React, { useState } from 'react';

function pattern(guess) {  
  if(guess.length !== 3) return false;
  if(parseInt(guess[0]) >= parseInt(guess[1])) return false;
  if(parseInt(guess[1]) >= parseInt(guess[2])) return false;
  return true;
}

function ControlledInput(props) {
  return (
    <input value={props.value} onChange={(ev) => props.setValue(ev.target.value)}></input>
  );
}

function OldRound(props) {
  return (
    <div className={"guess-round-"+pattern(props.guess)}>     
      <input value={props.guess[0]} readOnly/>
      <input value={props.guess[1]} readOnly/>
      <input value={props.guess[2]} readOnly/>
    </div>
  );  
}
function NewRound(props) {
  const [value0, setValue0] = useState('');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  return (
    <div className="new-round">
      <div className="guess-round-current">     
        <ControlledInput value={value0} setValue={setValue0} />       
        <ControlledInput value={value1} setValue={setValue1} />       
        <ControlledInput value={value2} setValue={setValue2} /> 
      </div>
      <div>
        <button onClick={() => {  
            if(!isNaN(parseInt(value0)) && !isNaN(parseInt(value1)) && !isNaN(parseInt(value2))) {
              props.addGuess([value0,value1,value2])
              setValue0('')
              setValue1('')
              setValue2('')
              props.setNotification('')
            } else {
              props.setNotification('Please provide a full 3-number sequence.')
            }
          }}>
          Guess!
        </button>
      </div>
    </div>
  );  
}


function App() {
  const [guesses, setGuesses] = useState([]);
  const [notification, setNotification] = useState('');
  return (
    <div className="App">   
      { guesses.map( (guess,guessNumber) => 
        <OldRound           
          guess={guess}
          setGuesses={() => undefined}
          key={guessNumber} />)}
      <NewRound         
        setNotification={setNotification}
        addGuess={(guess) => {          
          const newGuesses = guesses.slice(); 
          newGuesses.push(guess)
          setGuesses(newGuesses) }} />
      {notification}   
    </div>
  );
}

export default App;