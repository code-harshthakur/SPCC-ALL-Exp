import os

def read_assembly(file_name):
    input_lines = []
    try:
        with open(file_name, 'r') as fp:
            for line in fp:
                words = line.strip().split()
                for word in words:
                    input_lines.append(word)
                input_lines.append(';')  # Use ';' to denote end of line
    except IOError as e:
        print(f"Error opening the file: {file_name}\n{e}")
        return None
    return input_lines

def create_output_file(input_data, mnemonics_opcode, mnemonics_size, label_def, label_ref, file_name):
    try:
        with open(file_name, 'w') as output_file:
            start_address = 0
            counter = 0
            for item in input_data:
                if item == ";":
                    counter = 0
                    continue

                if item not in mnemonics_opcode:
                    if counter == 0:
                        label_ref[item] = start_address
                    if counter == 1:
                        label_def[item] = start_address - mnemonics_size[input_data[input_data.index(item) - 1]]

                if item in mnemonics_opcode:
                    output_file.write(f"{item} {mnemonics_opcode[item]} {start_address}\n")
                    start_address += mnemonics_size[item]
                counter += 1
    except IOError as e:
        print(f"Error creating the output file: {file_name}\n{e}")
        return

def ref_def(label_def, label_ref):
    print("Label Def")
    for label, address in label_def.items():
        print(f"{label} {address}")
    print("Label Ref")
    for label, address in label_ref.items():
        print(f"{label} {address}")

def main():
    mnemonics_opcode = {
        "MOV": "000AH",
        "ADD": "000CH",
        "SUB": "0003H",
        "JUMP": "0002H"
    }

    mnemonics_size = {
        "MOV": 1,
        "ADD": 3,
        "SUB": 5,
        "JUMP": 1
    }

    label_def = {}
    label_ref = {}

    input_file = input("Enter filename to read: ")
    input_data = read_assembly(input_file)
    if input_data is not None:
        output_file = input("Save file as: ")
        create_output_file(input_data, mnemonics_opcode, mnemonics_size, label_def, label_ref, output_file)
        print("File Saved")
        ref_def(label_def, label_ref)

if __name__ == "__main__":
    main()