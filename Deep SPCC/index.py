def read_assembly(file_name):
    input_data = []
    try:
        with open(file_name, 'r') as fp:
            word = ''
            while True:
                ch = fp.read(1)
                if not ch:
                    break
                if ch == '\n':
                    if word:  # Add the last word if exists before adding a new line indicator
                        input_data.append(word)
                    input_data.append(';')
                    word = ''
                elif ch == ' ':
                    if word:  # Only add non-empty words to avoid adding empty strings
                        input_data.append(word)
                    word = ''
                else:
                    word += ch
            if word:  # Add the last word if exists
                input_data.append(word)
    except IOError as e:
        print(f"Error opening the file: {file_name}\n{e}")
        return None
    return input_data

def create_output_file(input_data, mnemonics_opcode, mnemonics_size, label_def, label_ref, equ_values, dc_ds_length, dc_ds_address, file_name):
    try:
        with open(file_name, 'w') as outputFile:
            start_address = 0
            i = 0
            while i < len(input_data):
                temp = input_data[i]
                if temp == ";":
                    i += 1
                    continue
                
                if temp in mnemonics_opcode:
                    outputFile.write(f"{temp} {mnemonics_opcode[temp]} {start_address}\n")
                    start_address += mnemonics_size[temp]

                i += 1
    except IOError as e:
        print(f"Error creating the output file: {file_name}\n{e}")

def final_obj_file(input_data, mnemonics_opcode, mnemonics_size, label_def, label_ref, equ_values, dc_ds_length, dc_ds_address, file_name):
    try:
        with open(file_name, 'w') as outputFile:
            start_address = 0
            for i, temp in enumerate(input_data):
                if temp == ";":
                    continue

                if temp in mnemonics_opcode:
                    outputFile.write(f"{start_address} {mnemonics_opcode[temp]} ")
                    start_address += mnemonics_size[temp]
                elif temp in equ_values:
                    outputFile.write(f"{equ_values[temp]} ")
                elif temp in dc_ds_length:
                    outputFile.write(f"{start_address} {dc_ds_length[temp]} ")
                    start_address += dc_ds_length[temp]
                elif temp in dc_ds_address:
                    outputFile.write(f"{dc_ds_address[temp]} ")

                outputFile.write("\n")
    except IOError as e:
        print(f"Error creating the final output file: {file_name}\n{e}")

def main():
    mnemonics_opcode = {
        "L": "58",
        "AR": "1A",
        "ST": "50",
        "JUMP": "4F"
    }

    mnemonics_size = {
        "L": 4,
        "AR": 2,
        "ST": 4,
        "JUMP": 4
    }

    label_def = {}
    label_ref = {}
    equ_values = {}
    dc_ds_address = {}
    dc_ds_length = {}

    inputfile = input("Enter filename to read: ")
    intermediate_outputfile = input("Save intermediate file as: ")
    final_outputfile = input("Save final object file as: ")

    input_data = read_assembly(inputfile)
    if input_data:
        create_output_file(input_data, mnemonics_opcode, mnemonics_size, label_def, label_ref, equ_values, dc_ds_length, dc_ds_address, intermediate_outputfile)
        final_obj_file(input_data, mnemonics_opcode, mnemonics_size, label_def, label_ref, equ_values, dc_ds_length, dc_ds_address, final_outputfile)
        print("Files Saved")

if __name__ == "__main__":
    main()
