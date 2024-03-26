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

/* This is the Extension of tokeniser project  */

/* OOPS is used to implement the logic */

import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type token = [string,number];

class PARSER {
    private tokens: Token[]
}