"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizer = void 0;
function tokenizer(input) {
    // Define operators & Delimenter
    const operators = ["+", "-", "*", "/", "^", "(", ")"];
    const delimeter = " ";
    // Define Token[] to store the results
    const tokens = [];
    // Define states of DFA/Analysis
    let State;
    (function (State) {
        State[State["START"] = 0] = "START";
        State[State["IN_TOKEN"] = 1] = "IN_TOKEN";
        State[State["DELIMITER"] = 2] = "DELIMITER";
    })(State || (State = {}));
    // A special number for identifiers not found in the lextable
    const identifierNumber = 99;
    // Declare a lext_table
    let LEX_TABLE = {
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
    let token = "";
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
                }
                else {
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
                }
                else {
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
exports.tokenizer = tokenizer;
// Testing
const inputString = " x = ( x + 1 ) ";
const tokens = tokenizer(inputString);
console.log(tokens);
