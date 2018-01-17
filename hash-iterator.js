const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

((module) => {

    this.prefixLength;
    this.initialFillValue;
    this.resultLength;
    this.prefixCharacter;
    this.encoding;
    this.fileSuffix;
    this.currentFile;
    this.charactersFound;
    this.processing = false;
    this.iterations = 0;
    this.filesProcessed = 0;
    this.queue = [];
    this.result = [];

    const process = (fileName, resultLength = 10, prefixCharacter = '0', initialFillValue = '.', encoding = 'ascii', fileSuffix = '.answer') => {
        console.log('\nAdding file to queue:', path.join(__dirname, fileName));
        this.queue.push( { fileName, resultLength, prefixCharacter, initialFillValue, encoding, fileSuffix } );
        if (!this.processing) {
            readFile(this.queue[this.filesProcessed].fileName, this.queue[this.filesProcessed].encoding);
        }
    };

    const readFile = (fileName, encoding) => {
        this.processing = true;
        console.log('\nProcessing file:', path.join(__dirname, fileName));
        fs.readFile(path.join(__dirname, fileName), encoding, (err, contents) => err ? handleFileError(err) : start(contents));
    };

    const writeFile = (fileName, fileSuffix, encoding, content) => {
        fs.writeFile(path.join(__dirname, fileName + fileSuffix), content, encoding, (err) => {
            if (err) return handleFileError(err);
            this.filesProcessed >= this.queue.length - 1 ? clear() : next();
        });
    };

    const handleFileError = (err) => {
        this.processing = false;
        this.filesProcessed = 0;
        console.error(err);
        if (this.queue.length > 0) next();
    }
    
    const start = (contents) => {
        this.charactersFound = 0;
        this.iterations++;
        this.currentFile = this.queue[this.filesProcessed];
        this.result = new Array(this.currentFile.resultLength).fill(this.currentFile.initialFillValue);
        this.prefixLength = parseInt(contents[contents.length - 1]);
        const prefix = this.currentFile.prefixCharacter.repeat(this.prefixLength);
        const salt = contents.substring(0, contents.length - 2);
        const hash = createHash(salt + this.iterations);
        isCorrectPrefix(hash, prefix) ? addCharacter(salt, hash, prefix) : tick(salt, prefix);
    };

    const tick = (salt, prefix) => {
        if (isComplete()) return processResult(salt);
        this.iterations++;
        const hash = createHash(salt + this.iterations);
        return isCorrectPrefix(hash, prefix) ? addCharacter(salt, hash, prefix) : tick(salt, prefix);
    };

    const createHash = (str) => crypto.createHash('md5').update(str).digest('hex');

    const addCharacter = (salt, hash, prefix) => {
        const position = hash[this.prefixLength];
        if (isNaN(position)) return tick(salt, prefix);
        const index = this.iterations % 32;
        const char = hash[index];
        if (this.result[position] === this.currentFile.initialFillValue) { 
            this.result[position] = char;
            this.charactersFound++;
            console.log('\nFound character: ', char);
            console.log('Characters remaining: ', this.currentFile.resultLength - this.charactersFound);
        }
        tick(salt, prefix);
    };

    const isComplete = () => this.charactersFound == this.currentFile.resultLength;

    const processResult = () => {
        const file = this.queue[this.filesProcessed];
        writeFile(file.fileName, file.fileSuffix, file.encoding, this.result.join(''));
        console.log('\nAll characters found: ', this.result.join(''));
        console.log('File processed.\nOutput file: ', path.join(__dirname, file.fileName + file.fileSuffix));
    };

    const next = () => {
        this.iterations = 1;
        this.filesProcessed++;
        this.currentFile = this.queue[this.filesProcessed];
        this.result = new Array(this.currentFile.resultLength).fill(this.currentFile.initialFillValue);
        readFile(this.currentFile.fileName, this.currentFile.encoding);
    };

    const clear = () => {
        this.queue = [];
        this.filesProcessed = 0;
        this.charactersFound = 0;
        this.processing = false;
    }

    const isCorrectPrefix = (hash, prefix) => hash.startsWith(prefix);

    module.exports.process = process;

})(module);
