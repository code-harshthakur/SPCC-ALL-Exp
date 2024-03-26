import * as fs from 'fs';
import * as readline from 'readline';

interface MacroDefinition {
    parameters: string[];
    expansion: string;
}

// ---- Pass 1: Define Macros ----- 
function pass1(inputFilename: string, macroTable: Record<string, MacroDefinition>) {
    const rl = readline.createInterface({
        input: fs.createReadStream(inputFilename),
        crlfDelay: Infinity
    });

    rl.on('line', (line: string) => {
        const match = line.match(/^#define (\w+)\((.*)\)\s*(.*)$/);
        if (match) {
            const parameters = match[2].split(',').map(param => param.trim());
            const expansion = match[3];
            macroTable[match[1]] = { parameters, expansion };
        }
    });

    return new Promise<void>((resolve, reject) => {
        rl.on('close', resolve); 
        rl.on('error', reject); 
    });
}

// ---- Pass 2: Expand Macros ----- 
function pass2(inputFilename: string, outputFilename: string, macroTable: Record<string, MacroDefinition>) {
    const inputFile = fs.createReadStream(inputFilename);
    const outputFile = fs.createWriteStream(outputFilename);

    const rl2 = readline.createInterface({
        input: inputFile,
        crlfDelay: Infinity
    });

    rl2.on('line', (line: string) => {
        const match = line.match(/(\w+)\((.*)\)/);
        if (match) {
            const macroName = match[1];
            const args = match[2].split(',').map(arg => arg.trim());

            if (macroName in macroTable) {
                const { parameters, expansion } = macroTable[macroName];
                let expanded = expansion;
                for (let i = 0; i < parameters.length; i++) {
                    expanded = expanded.replace(
                        new RegExp(`\\b${parameters[i]}\\b`, "g"),
                        args[i]
                    );
                }
                outputFile.write(expanded + "\n");
                return; 
            }
        }
        outputFile.write(line + "\n"); // Unchanged line
    });

    return new Promise<void>((resolve, reject) => {
        rl2.on('close', resolve);
        rl2.on('error', reject);
    });
}

// ---- Main Function -----
async function preprocessFile(inputFilename: string, outputFilename: string) {
    const macroTable: Record<string, MacroDefinition> = {};

    try {
        const outputFolderPath = './out'; // Specify the output folder path
        const outputPath = `${outputFolderPath}/${outputFilename}`; // Construct the output file path
        await pass1(inputFilename, macroTable); 
        await pass2(inputFilename, outputPath, macroTable); // Use the output file path
        console.log('Macro preprocessing completed!');
    } catch (error) {
        console.error('Error during preprocessing:', error);
    }
}

// Sample Usage
preprocessFile('src/macros.txt', 'processed_macros.txt'); // Specify the input file path
