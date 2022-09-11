import './Puzzle.css';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { ref, push } from "firebase/database";
import { database, session_id } from './firebase_helper';
/*
  Note well: there is a bug in this code. We'll try to find it in class.
*/

export const TEXT_try_button_accessible_name = 'try your sequence'
export const TEXT_number_1_accessible_name = 'first number in sequence'
export const TEXT_number_2_accessible_name = 'second number in sequence'
export const TEXT_number_3_accessible_name = 'third number in sequence'
export const TEXT_try_button_text =  'Try it!'

export function pattern(guess: string[]): boolean {  
  if(guess.length !== 3) return false;
  if(guess[0] >= guess[1]) return false;
  if(guess[1] >= guess[2]) return false;
  return true;
}

// Remember that the parameter names don't necessarily need to overlap.
interface ControlledInputProps {
  value: string, 
  setValue: Dispatch<SetStateAction<string>>,
  ariaLabel: string 
}

function ControlledInput({value, setValue, ariaLabel}: ControlledInputProps) {
  return (
    <input value={value} 
           onChange={(ev) => setValue(ev.target.value)}
           aria-label={ariaLabel}
           ></input>
  );
}

function OldRound( {guess}: {guess: string[]}) {
  const result: boolean = pattern(guess)
  const label: string = result ? 'correct guess' : 'incorrect guess'
  return (
    <div className={"guess-round-"+result}
         aria-label={label}>
      <input value={guess[0]} readOnly/>
      <input value={guess[1]} readOnly/>
      <input value={guess[2]} readOnly/>
    </div>
  );  
}

// Remember that the parameter names don't necessarily need to overlap.
interface NewRoundProps {  
  addGuess: (guess: string[]) => any,
  setNotification: Dispatch<SetStateAction<string>>
}

function NewRound({addGuess, setNotification}: NewRoundProps) {
  const [value0, setValue0] = useState('');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  return (
    <div className="new-round">
      <div className="guess-round-current">  
      <fieldset>
        <legend>Enter a 3-number sequence:</legend>
        <ControlledInput value={value0} setValue={setValue0} ariaLabel={TEXT_number_1_accessible_name}/>
        <ControlledInput value={value1} setValue={setValue1} ariaLabel={TEXT_number_2_accessible_name}/>
        <ControlledInput value={value2} setValue={setValue2} ariaLabel={TEXT_number_3_accessible_name}/>
      </fieldset>   
      </div>
      <div>
        <button onClick={() => {              
            if(!isNaN(parseInt(value0)) && !isNaN(parseInt(value1)) && !isNaN(parseInt(value2))) {              
              addGuess([value0,value1,value2])
              setValue0('')
              setValue1('')
              setValue2('')
              setNotification('')
              logSequence([value0, value1, value2])
            } else {
              setNotification('Please provide a full 3-number sequence.')
            }
          }}
          aria-label={TEXT_try_button_accessible_name}>
          {TEXT_try_button_text}
        </button>
      </div>
    </div>
  );  
}

function logSequence(guess: string[]) {
  const presumed_result: boolean = pattern(guess);
  const log_entry = {
    // Log the sequence that the user picked
    //  (Purpose: detecting patterns of sequences, results before stopping)
    sequence: guess,
    // Log the result they will be shown
    //  (Purpose: inference later might involve bugfixes etc.; want to know what the user saw)
    result: presumed_result,
    // Log a timestamp
    //  (Purpose: ordering sequences picked)
    timestamp: new Date().toUTCString(),
    // Log a unique session ID, freshly generated whenever the page is loaded
    //  (Purpose: distinguishing between different chains of sequences. This is
    //   important because we want to check whether the NYT puzzle's hypothesis 
    //   about when users stop giving sequences holds here, too.)
    session: session_id
  };  

  // https://firebase.google.com/docs/reference/js/database.md#database_package
  // Push: "Generates a new child location using a unique key and returns its Reference.
  //  This is the most common pattern for adding data to a collection of items.""
  //   "If you don't pass a value, nothing is written to the database and the child remains 
  //    empty (but you can use the Reference elsewhere)."
  const parent = ref(database, 'sequences/')
  console.log(`Starting update to new child of ${parent}`)
  push(parent, log_entry).then(  
      (ref) => console.log(`Database update ${ref} completed`)
    ).catch(
      (reason) => console.log(`Database update failed: ${reason}`)
    )
}

export default function Puzzle() {
  // NOTE: useState runs before the initial render. However, in development in strict
  // mode, components will be rendered twice (React does this to try and discover issues).
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [notification, setNotification] = useState('');    
  
  return (
    <div className="App">   
      { guesses.map( (guess,guessNumber) => 
        <OldRound           
          guess={guess}
          key={guessNumber} />)}
      <NewRound                  
        setNotification={setNotification}
        addGuess={(guess: string[]) => {          
          const newGuesses = guesses.slice(); 
          newGuesses.push(guess)
          setGuesses(newGuesses) }} />
      {notification}   
    </div>
  );
}
