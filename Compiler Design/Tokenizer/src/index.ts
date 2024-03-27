 export function tokenizer(input: string): Array<[string, number]> {
  // Define operators & Delimenter
  const operators: string[] = ["+", "-", "*", "/", "^", "(", ")"];
  const delimeter: string = " ";

  // Define Token[] to store the results
  const tokens: Array<[string, number]> = [];

  // Define states of DFA/Analysis
  enum State {
    START,
    IN_TOKEN,
    DELIMITER,
  }

  // A special number for identifiers not found in the lextable
  const identifierNumber: number = 99;

  // Declare a lext_table
  let LEX_TABLE: { [key: string]: number } = {
    "=": 5,
    "+": 6,
    "-": 7,
    "*": 8,
    "/": 9,
    ";": 10,
    "(": 11,
    ")": 12,
    "{": 13,
    "}": 14,
  };

  // Initial State
  let currentState = State.START;
  let token: string = "";

  for (let char of input) {
    switch (currentState) {
      case State.START:
      case State.DELIMITER:
        if (char.match(/\s/)) {
          currentState = State.DELIMITER;
          if (tokens.length > 0) {
            const tokenNumber = LEX_TABLE[token] || identifierNumber;
            tokens.push([token, tokenNumber]);
            token = "";
          }
        } else {
          currentState = State.IN_TOKEN;
          token += char;
        }
        break;
      case State.IN_TOKEN:
        if (char.match(/\s/)) {
          currentState = State.DELIMITER;
          const tokenNumber = LEX_TABLE[token] || identifierNumber;
          tokens.push([token, tokenNumber]);
          token = "";
        } else {
          token += char;
        }
        break;
    }
  }

  /*  If the input string ends without a delimiter, 
      the last token won't be pushed inside the 
      loop and must be handled separately. 
  */

  if (token.length > 0) {
    const tokenNumber = LEX_TABLE[token] || identifierNumber;
    tokens.push([token, tokenNumber]);
  }

  return tokens;
}

// Testing
const inputString: string = " x = ( x + 1 ) ";
const tokens = tokenizer(inputString);
console.log(tokens);
