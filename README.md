## Hash Iterator
### Task description
The task is to create a bruteforce [hash](https://en.wikipedia.org/wiki/Hash_function) iterator. This will produce a 10-character string from two parameters:
 - The salt, an ASCII encoded string
 - The number of prefixed zeros, an integer
 
Your code will iteratively attempt to determine a character of the output, by appending incremental integers (1,2,3...) to the end of the salt, then finding the hexadecimal representation of the MD5 hash of this (we’ll call this *the hash*), and following the logic below: 
- If the hash starts with the specified number of zeros, the character following those zeros is the index of the character in the output string to be determined. 
- The character to place at this index is found as follows:
    - Find the modulo of the integer appended to the salt, with respect to the length of the hash (32 bits)
    - The character you should take is then the character at this index position in the hash

This process is then repeated until all 10 characters are known. Do not overwrite previously found characters.

### Example
**Input:**
```
machine-learning,4
```
**Expected output:**
```
f320e001d1
```
**Logic run-through:**
Your code starts by appending `'1'` to the salt, and the hash of this is then found: `'e3aaf8288a4bd99222f8960f39e24816'`. This doesn’t start with 4 zeros, so the next iteration is conducted.

This continues, and, on the 281382nd iteration you hash `'machine-learning281382'` and get `'000045eeb68e49d94edb7c6faf93b301'`.
This has the specified 4 zeros at the beginning, and so is used to find a character of the output. 281382 modulo 32 is 6, and so the character with index 6 of the hash is used (assuming zero indexing), which is `'e'`. The number after the zeroes is 4, so the character of the output string to be updated is at index 4. Therefore, `'e'` goes in position 4, so the output string is `....e.....` (where `.` indicates an unknown character), again assuming zero indexing.

After 6854736 iterations, you should have filled all the positions in the string, and arrived at the string `f320e001d1`.

### How to test the solution
The challenge uses input/output file based testing. The solution needs to read an input from a text file, then output the answer to another text file in the same location with the same nameand the suffix ".answer" appended to the name.

**Your programs must be designed to take in a single command-line argument that will be an absolute path to the input file. For example:**

```
node hash-iterator.js /home/johndoe/challenge/input/hash-1.txt
```

In this case, your program should output the answer to `/home/johndoe/challenge/input/hash-1.txt.answer`.

There are example input and output files provided for each problem, which you can use as a baseline for testing your code. For example, your solution to Problem 1 should be able to read the contents of `hash-1.txt` in the `input` folder and produce a file called `hash-1.txt.answer` in the same folder, whose content is *exactly* equal to that of the `hash-1.txt.example.answer` file.

### Extra notes
- The answer should always be 10 characters long
- Use only the first result for each position
- Ignore invalid positions. For example, ignore a hash starting with `0000c`
- The output file should contain just the string (no newlines, no spaces or extra characters)

## The Solution
### How to run the code:
```
$ git clone https://github.com/treborb/hash-iterator.git
$ cd hash-iterator
$ npm start input/hash-1.txt input/hash-2.txt input/hash-3.txt
```
