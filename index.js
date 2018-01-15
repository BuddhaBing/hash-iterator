const hashIterator = require('./hash-iterator');

(() => {

    const files = ['input/hash-1.txt', 'input/hash-2.txt', 'input/hash-3.txt'];
    
    for (const file of files) {
        hashIterator.process(file);
    };

})();
