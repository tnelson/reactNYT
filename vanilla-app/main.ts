// Each guess is stored as an array of strings. GUESSES stores all previous guesses.
let GUESSES: Array<Array<string>> = []
// A reference to the guess button.
let guessButton: HTMLButtonElement

window.onload = () => {
    // On window load, get the reference to the guess button
    guessButton = document.getElementById("guess-button") as HTMLButtonElement
    guessButton.addEventListener("click", () => updateGuesses())
}

/**
 * Tells whether or not a guess was correct.
 * @param {string[]} guess A guess of three integers in string form.
 */
function pattern(guess: string[]): boolean {
    return !(guess.length !== 3 || parseInt(guess[0]) >= parseInt(guess[1]) || parseInt(guess[1]) >= parseInt(guess[2]))
}

/**
 * When the guess button is clicked, updates the GUESSES array and re-renders HTML.
 */
function updateGuesses() {
    const firstGuess = document.getElementById("guess-1") as HTMLInputElement
    const secondGuess = document.getElementById("guess-2") as HTMLInputElement
    const thirdGuess = document.getElementById("guess-3") as HTMLInputElement
    GUESSES.push([firstGuess.value, secondGuess.value, thirdGuess.value])
    console.log("Guesses:", GUESSES)
    renderOldGuesses()
}

/**
 * Handles rendering HTML when GUESSES is updated.
 */
function renderOldGuesses() {
    let newHtml: string = ''
    GUESSES.map((guess: string[], guessNumber: number) => {
        const correct: boolean = pattern(guess)
        newHtml += `<div class="${correct ? "correct-guess" : "incorrect-guess"}">
            <p>Guess #${guessNumber + 1}</p>
            <input value="${guess[0]}" readonly />
            <input value="${guess[1]}" readonly />
            <input value="${guess[2]}" readonly />
        </div>`
    })
    const oldGuesses = document.getElementById("old-rounds") as HTMLDivElement
    oldGuesses.innerHTML = newHtml
}