// Definition of a token as a tuple of the token's value and its type number
type Token = [string, number];

// Parser class to handle syntax analysis
class Parser {
  private tokens: Token[]; // Array of tokens to be parsed
  private position: number = 0; // Current position in the token array

  constructor(tokens: Token[]) {
    this.tokens = tokens; // Initialize with an array of tokens
  }

  // Entry point for parsing. Returns true if the syntax is valid, otherwise false.
  parse(): boolean {
    return this.S() && this.eof();
  }

  // Checks if the end of the token array has been reached, indicating the end of file/input.
  private eof(): boolean {
    return this.position === this.tokens.length;
  }

  // S -> Id = E; Production rule for starting symbol
  private S(): boolean {
    const savedPosition = this.position;
    // Attempt to parse an identifier followed by '=' and an expression E
    if (this.Id() && this.match("=") && this.E()) {
      return true; // Successfully matched the production rule
    }
    // Restore the position if parsing fails to allow backtracking
    this.position = savedPosition;
    return false;
  }

  // E -> TE'; Production rule for expressions
  private E(): boolean {
    return this.T() && this.EPrime();
  }

  // E' -> +TE' | -TE' | ε; Production rule for handling addition and subtraction
  private EPrime(): boolean {
    const savedPosition = this.position;
    if ((this.match("+") || this.match("-")) && this.T() && this.EPrime()) {
      return true; // Successfully matched a continuation of the expression
    }
    this.position = savedPosition;
    return true; // Accepting ε, representing the end of this production rule
  }

  // T -> PT'; Production rule for term
  private T(): boolean {
    return this.P() && this.TPrime();
  }

  // T' -> *PT' | /PT' | ε; Production rule for multiplication and division
  private TPrime(): boolean {
    const savedPosition = this.position;
    if ((this.match("*") || this.match("/")) && this.P() && this.TPrime()) {
      return true;
    }
    this.position = savedPosition;
    return true; // Accepting ε, indicating the end of multiplication/division operations
  }

  // F -> (E) | id | int literal | float literal; Production rule for factors
  private F(): boolean {
    const savedPosition = this.position;
    // Try to match a parenthesized expression
    if (this.match("(") && this.E() && this.match(")")) {
      return true;
    }
    this.position = savedPosition;

    // Assuming all literals and identifiers are marked as 99 for simplicity
    if (this.Id()) {
      return true; // Successfully matched an identifier or literal
    }

    return false;
  }

  // P -> FP'; Production rule for power operations
  private P(): boolean {
    return this.F() && this.PPrime();
  }

  // P' -> ^P | ε; Production rule for exponentiation
  private PPrime(): boolean {
    const savedPosition = this.position;
    if (this.match("^") && this.P()) {
      return true; // Successfully matched exponentiation
    }
    this.position = savedPosition;
    return true; // Accepting ε, indicating no further exponentiation
  }

  // Attempts to match a specific token with the expected value and advances the position
  private match(expected: string): boolean {
    if (
      this.position < this.tokens.length &&
      this.tokens[this.position][0] === expected
    ) {
      this.position++;
      return true;
    }
    return false;
  }

  // Checks if the current token is an identifier, assuming a specific marking (99) for simplicity
  private Id(): boolean {
    if (
      this.position < this.tokens.length &&
      this.tokens[this.position][1] === 99
    ) {
      this.position++;
      return true;
    }
    return false;
  }
}

// Example usage of the parser
const input = "x = 3 + 4 * 2"; // Example input string
const tokens: Token[] = tokenizer(input); // Tokenize the input string
const parser = new Parser(tokens); // Create a parser instance with the tokenized input
const isValid = parser.parse(); // Start parsing
console.log(isValid ? "Valid syntax." : "Invalid syntax."); // Print the result
