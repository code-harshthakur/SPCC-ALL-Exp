/*    e:epsilon
 S   ->    Id = E 
 E   ->    TE'
 E'  ->    +TE | -TE' | e
 T   ->    PT'
 T'  ->    *PT' | PT' | e
 F   ->    ( E ) |  id | int litreal | float litreal
 P   ->    FP'
 P'  ->    ^P | e
*/

/* 
This is the Extension of tokeniser project  
OOPS is used to implement the logic
eof: End of file 
*/

import * as readline from "readline";
import { tokenizer } from "../../../Tokenizer/src/index";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// Defination of token : A tuple of the token's value and its type number
type token = [string, number];

class PARSER {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): boolean {
    // Entry point for parsing. Returns true if the syntax is valid, otherwise false.
    return this.S() && this.eof();
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

  private eof(): boolean {
    //  Checks if the end of the token array has been reached, indicating the end of file/input.
    return this.position === this.tokens.length;
  }

  private S(): boolean {
    // S -> id = E : Entry point for parsing. Returns true if the syntax is valid, otherwise false.
    const savedPosition = this.position;
    if (this.Id() && this.match("=") && this.E()) {
      return true;
    }
    // Restore the position if parsing fails,to allow backtracking
    this.position = savedPosition;
    return false;
  }

  private E(): boolean {
    // E -> TE'
    return this.T() && this.EPrime();
  }

  private EPrime(): boolean {
    //  E' -> +TE' | -TE' | e;
    const savedPosition = this.position;
    if ((this.match("*") || this.match("/")) && this.P() && this.TPrime()) {
      return true;
    }
    this.position = savedPosition;
    return true; // Accepting e
  }

  private T(): boolean {
    // T -> PT'
    return this.P() && this.TPrime();
  }

  private TPrime(): boolean {
    //  T' -> *PT' | /PT' | e
    const savedPosition = this.position;
    if ((this.match("*") || this.match("/")) && this.P() && this.TPrime()) {
      return true;
    }
    this.position = savedPosition;
    return true; // Accepting e
  }

  private F(): boolean {
    // F -> (E) | id | int literal | float literal
    const savedPosition = this.position;
    // Try to match a parenthesized expression
    if (this.match("(") && this.E() && this.match(")")) {
      return true;
    }
    this.position = savedPosition;
    // All the literals are marked as "99"
    if (this.Id()) {
      return true; // Successfully matched the identifier or litreal
    }
    return false;
  }

  private P(): boolean {
    // P -> FP'
    return this.F() && this.PPrime();
  }

  private PPrime(): boolean {
    // P' -> ^P | e
    const savedPosition = this.position;
    if (this.match("^") && this.P()) {
      return true;
    }
    this.position = savedPosition;
    return true; // Accepting e
  }

  private Id(): boolean {
    // Checks if the current token is an identifier, assuming a specific marking (99) for simplicity
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
