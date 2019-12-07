import { GetLines } from "../core";

const execute = (lines:string[]) => {

    const map = lines.reduce((result, l) => {
        const split = l.split(")");
        result[split[1]] = split[0];
        return result;
    }, {} as {[a:string]:string})
    
    const indirect = (planet:string):number => {
        const found = map[planet];
        return found ? 1 + indirect(found) : 0;
    }

    const count = Object.keys(map).reduce((result, k) => {
        ++result;
        result += indirect(map[k]);
        return result;
    }, 0);

    const transfers = (planet:string):string[] => {
        const arr = [planet];
        let orbiting = map[planet];
        while (orbiting) {
            arr.push(orbiting);
            orbiting = map[orbiting];
        }

        return arr;
    }
    console.log("count: ", count);
    const san = transfers("SAN");
    const you = transfers("YOU");
    const youI = you.findIndex(y => san.find(s => s===y)!==undefined);
    const sanI = san.findIndex(s => s===you[youI]);
    console.log(youI, you[youI]);
    console.log(sanI, san[sanI]);
    console.log(youI+sanI-2);
}

GetLines("./src/06/input").then(execute)
