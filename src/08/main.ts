import { GetLines } from "../core";

const width = 25;
const height = 6;
const execute = (lines:string[]) => {
    const input:number[] = []
    for (let i=0; i<lines[0].length; ++i) {
        input.push( Number.parseInt(lines[0][i]) );
    }

    const size = (width*height);
    const count = input.length / size;
    console.log("layersize ", size);
    console.log("layercount ", count);

    const analyze = (index:number) => {
        const offset = index*size;
        const arr:number[] = []
        for (let i=0; i<size; ++i) {
            arr.push(input[i+offset]);
        }
        return arr;
    }

    const getChecksum = () => {

        let minZeroLayer = -1;
        let zeroes = Number.MAX_VALUE;
        for (let i=0; i<count; ++i) {
            const zeroCount = analyze(i).filter(n => n===0).length;
            if (zeroCount < zeroes) {
                zeroes = zeroCount;
                minZeroLayer = i;
            }
        }
        
        const layer = analyze(minZeroLayer);
        return layer.filter(l => l===1).length * layer.filter(l => l===2).length;
    }


    console.log("checksum ", getChecksum());

    const final:number[] = [];
    for (let i=0; i<size; ++i) {
        let layerId = 0;
        let pixel = input[i+(layerId*size)];
        while (pixel===2) {
            ++layerId;
            pixel = input[i+(layerId*size)];
        }
        final.push(pixel);
    }

    // console.log(final)

    for (let y=0; y<height; ++y) {
        let line:string = "";
        for (let x=0; x<width; ++x) {
            line += (final[x+(y*width)]===0) ? " " : "@";
        }
        console.log(line);
    }
}

GetLines("./src/08/input").then(execute)
