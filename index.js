const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const filePath = path.join(__dirname, 'input/hash-1.txt');
const files = ['hash-1.txt', 'hash-2.txt', 'hash-3.txt']; // TODO: see if can find files matching 'hash'
const encoding = { 
    default: 'ascii',
    hex: 'hex'
};
const initialFillValue = '.';
const resultLength = 10;
const prefixCharacter = '0';

let prefixLength;
let prefix;
let contentLength;
let salt;
let index;
let hash;
let iterations;
let result;
let filesProcessed = 0;

begin = () => {
    readFile(files[filesProcessed]);
}

readFile = (filePath) => fs.readFile(`input/${filePath}`, encoding.default, (err, contents) => firstRun(contents)); // TODO: catch error

writeFile = (filePath, content) => fs.writeFile(`input/${filePath}.answer`, content, encoding.default, () => next()); // TODO: catch error

firstRun = (contents) => {
    iterations = 1;
    result = new Array(resultLength).fill(initialFillValue);
    prefixLength = parseInt(contents[contents.length - 1]);
    prefix = prefixCharacter.repeat(prefixLength);
    salt = contents.substring(0, contents.length - 2);
    contentLength = salt.length;
    hash = createHash(salt);
    isCorrectPrefix(hash, prefixLength) ? addCharacter(hash) : tick(salt + iterations);
};

createHash = (str) => crypto.createHash('md5').update(str).digest(encoding.hex);

tick = (salt) => {
    if (iterations % 100000 === 0) console.log('iterations', iterations);
    if (isComplete()) return processResult(salt);
    salt = increment(salt);
    hash = createHash(salt);
    isCorrectPrefix(hash, prefixLength) ? addCharacter(hash) : setTimeout(() => tick(salt), 0);
};

addCharacter = (hash) => {
    const position = hash[prefixLength];
    console.log('position', position); // TODO: remove me
    if (isNaN(position)) return tick(salt);
    console.log('salt', salt); // TODO: remove me
    console.log('iterations', iterations); // TODO: remove me
    index = iterations % 32;
    console.log('index', index); // TODO: remove me
    const char = hash[index];
    console.log('char', char); // TODO: remove me
    if (result[position] === initialFillValue) result[position] = char;
    console.log('file', files[filesProcessed]); // TODO: remove me
    console.log('result', '\n\n' + result + '\n\n'); // TODO: remove me
    tick(salt);
};

isComplete = () => result.every(el => el !== initialFillValue);

processResult = (salt) => {
    console.log(result.join('')); // TODO: remove me
    writeFile(files[filesProcessed], result.join(''));
};

next = () => {
    filesProcessed++;
    console.log('filesProcessed', filesProcessed); // TODO: remove me
    console.log('nextFile', files[filesProcessed]); // TODO: remove me
    if (filesProcessed < files.length) readFile(files[filesProcessed]);
};

isCorrectPrefix = (hash, prefixLength) => {
    return hash.substring(0, prefixLength) === prefix;
};

increment = (str) => {
    iterations++;
    return str.substr(0, contentLength) + iterations;
};

// convertStr = (str, from, to) => Buffer.from(str, from).toString(to);

// String.prototype.convert = function(from, to) {
//     return Buffer.from(this.toString(), from).toString(to);
// };

// String.prototype.asciiToHex = function() {
//     return convertStr(this.toString(), encoding.default, encoding.hex);
// };

// String.prototype.hexToAscii = function() {
//     return convertStr(this.toString(), encoding.hex, encoding.default);
// };

begin();
