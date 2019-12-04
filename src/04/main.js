const range = "197487-673251";
const input = [...Array(673251-197487).keys()].map(i => (197487+i).toString());
//console.log(input)

const check = (arr) => {
    const multiples = {};
    let last = 0;
    for (let i=0; i<arr.length; ++i) {
        const char = arr.charCodeAt(i);        
        if (char<last) return false;
        multiples[char] = (multiples[char] || 0) + 1;        
        last = char;
    }

    const double = Object.keys(multiples).find(k => {
        const count = multiples[k];
        return count===2;
    })

    return double!==undefined;
}
const filtered = input.filter(check);
console.log(filtered.length);