type Token = [string, number]; // data type of single token

class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): boolean {
    return this.S() && this.eof();
  }

  private eof(): boolean {
    return this.position === this.tokens.length;
  }

  private S(): boolean {
    const savedPosition = this.position;

    // S -> Id = E
    if (this.Id() && this.match("=") && this.E()) {
      return true;
    }

    this.position = savedPosition;
    return false;
  }

  private E(): boolean {
    return this.T() && this.EPrime();
  }

  private EPrime(): boolean {
    const savedPosition = this.position;

    if ((this.match("+") || this.match("-")) && this.T() && this.EPrime()) {
      return true;
    }

    this.position = savedPosition; // Reset if not matched
    return true; // E' -> ε
  }

  private T(): boolean {
    return this.P() && this.TPrime();
  }

  private TPrime(): boolean {
    const savedPosition = this.position;

    if ((this.match("*") || this.match("/")) && this.P() && this.TPrime()) {
      return true;
    }

    this.position = savedPosition; // Reset if not matched
    return true; // T' -> ε
  }

  private F(): boolean {
    const savedPosition = this.position;

    // F -> (E)
    if (this.match("(") && this.E() && this.match(")")) {
      return true;
    }

    this.position = savedPosition;

    // F -> id | int literal | float literal
    // Assuming id, int literal, and float literal are identified by specific numbers in LEX_TABLE or as identifierNumber
    if (this.Id() || this.IntLiteral() || this.FloatLiteral()) {
      return true;
    }

    return false;
  }

  private P(): boolean {
    return this.F() && this.PPrime();
  }

  private PPrime(): boolean {
    const savedPosition = this.position;

    if (this.match("^") && this.P()) {
      return true;
    }

    this.position = savedPosition;
    return true; // P' -> ε
  }

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

  private Id(): boolean {
    // Assuming identifier tokens are marked with a specific number
    if (
      this.position < this.tokens.length &&
      this.tokens[this.position][1] === 99
    ) {
      this.position++;
      return true;
    }
    return false;
  }

  private IntLiteral(): boolean {
    // Implement based on your LEX_TABLE or token definition
    return false;
  }

  private FloatLiteral(): boolean {
    // Implement based on your LEX_TABLE or token definition
    return false;
  }
}

// Example usage:
const tokens: Token[] = tokenizer("your input string here");
const parser = new Parser(tokens);
const isValid = parser.parse();
console.log(isValid ? "Valid" : "Invalid");
