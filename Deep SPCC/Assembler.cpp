#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <map>

using namespace std;

int readAssembly(string &fileName, vector<string> &input)
{
    char ch;
    fstream fp;
    fp.open(fileName.c_str(), std::fstream::in);

    if (!fp)
    {
        cerr << "Error opening the file: " << fileName << endl;
        return 1; // Return an error code
    }

    string word;
    while (fp >> noskipws >> ch)
    {
        if (ch == '\n')
        {
            input.push_back(word);
            input.push_back(";");
            word = "";
        }
        else if (ch == ' ')
        {
            input.push_back(word);
            word = "";
        }
        else
        {
            word += ch;
        }
    }

    input.push_back(word);

    fp.close();
    return 0; // Return success code
}

void createOutputFile(vector<string> &input, map<string, string> &mneomonics_oppcode, map<string, int> &mneomonics_size, map<string, int> &label_def, map<string, int> &label_ref, string &fileName)
{
    ofstream outputFile;
    outputFile.open(fileName.c_str(), std::ios::out);

    if (!outputFile.is_open())
    {
        cerr << "Error creating the output file: " << fileName << endl;
        return;
    }

    int startAddress = 0;
    // counter to now which part of the line we are in
    int counter = 0;
    for (int i = 0; i < input.size(); i++)
    {
        string temp = input[i];

        if (temp == ";")
        {
            counter = 0;
            continue;
        }

        if (mneomonics_oppcode.find(temp) == mneomonics_oppcode.end())
        {

            if (counter == 0)
            {
                label_ref[temp] = startAddress;
            }

            if (counter == 1)
            {
                // as I am adding the size of the mneomonics in the start address previously
                // so I am subtracting it from the start address to get the address of the label
                label_def[temp] = startAddress - mneomonics_size[input[i - 1]];
            }
        }

        if (mneomonics_oppcode.find(temp) != mneomonics_oppcode.end())
            outputFile << temp << " " << mneomonics_oppcode[temp] << " " << startAddress << endl;
        startAddress += mneomonics_size[temp];
        counter++;
    }

    outputFile.close();
}

// frinting the label ref and def
void ref_def(map<string, int> &label_def, map<string, int> &label_ref)
{
    cout << "Label Def" << endl;
    for (auto i : label_def)
    {
        cout << i.first << " " << i.second << endl;
    }
    cout << "Label Ref" << endl;
    for (auto i : label_ref)
    {
        cout << i.first << " " << i.second << endl;
    }
}

int main()
{

    // the data set of the  mneomonics_oppcode and mneomonics
    map<string, string> mneomonics_oppcode;
    mneomonics_oppcode["MOV"] = "000AH";
    mneomonics_oppcode["ADD"] = "000CH";
    mneomonics_oppcode["SUB"] = "0003H";
    mneomonics_oppcode["JUMP"] = "0002H";

    map<string, int> mneomonics_size;
    mneomonics_size["MOV"] = 1;
    mneomonics_size["ADD"] = 3;
    mneomonics_size["SUB"] = 5;
    mneomonics_size["JUMP"] = 1;
    map<string, int> label_def;
    map<string, int> label_ref;

    // the dataset end here
    vector<string> input;
    string inputfile;
    string outputfile;

    cout << "Enter filename to read" << endl;
    cin >> inputfile;

    // Call the readAssembly function to populate the input vector
    if (readAssembly(inputfile, input) == 0)
    {

        cout << "Save file as" << endl;
        cin >> outputfile;

        createOutputFile(input, mneomonics_oppcode, mneomonics_size, label_def, label_ref, outputfile);
        cout << "File Saved" << endl;
        ref_def(label_def, label_ref);
    }

    return 0;
}
