import { GetNumbers } from "../core";
const readline = require('readline');


class IntReader {
    input:number[];
    inputPointer:number;
    output:number[];
    pointer:number;
    data:number[];

    read = (immediate:boolean = false, move:boolean = false) => {
        const v = this.data[this.pointer];
        if (move) ++this.pointer;
        return immediate ? v : this.data[v];
    }

    write = (p:number, v:number) => {
        this.data[p] = v;
    }

    modes = () => {
        let res = Math.floor(this.read(true)/100);
        const modes:boolean[] = []
        while (res!=0) {
            modes.push(res%10===1)
            res = Math.floor(res/10);
        }
        return modes;
    }

    op_add = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);
        const c = this.read(true, true);
        this.write(c, a+b);
    }

    op_mul = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);        
        const c = this.read(true, true);
        this.write(c, a*b);
    }

    op_input = () => {
        ++this.pointer;
        const p = this.read(true, true);
        this.write(p, this.input[this.inputPointer]);
        ++this.inputPointer;
    }

    op_output = () => {
        ++this.pointer;
        const p = this.read(true, true);
        const out = this.data[p];
        console.log("Output: ", out, "(pointer: "+p+")");
        this.output.push(out);
    }

    op_jump_nzero = () => this.op_jump(true);
    op_jump_zero = () => this.op_jump(false);

    op_jump = (nzero:boolean) => {
        const modes = this.modes();
        ++this.pointer;
        const v = this.read(modes[0], true);
        const p = this.read(modes[1], true);
        if (nzero && v!==0) {
            this.pointer = p;
        }

        if (!nzero && v===0) {
            this.pointer = p;
        }
    }

    op_less = () => this.op_compare((a,b)=>a<b);
    op_equals = () => this.op_compare((a,b)=>a===b);
    op_compare = (f:(a:number,b:number)=>boolean) => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);
        const p = this.read(true, true);
        this.write(p, f(a,b)?1:0);
    }

    execute = (data:number[], input:number[]):number[] => {
        this.data = data.map(d => d);
        this.pointer = 0;
        this.input = input.map(i => i);
        this.inputPointer = 0;
        this.output = [];
        this._execute();
        return this.output;
    }

    _execute = () => {
        while (true) {
            const value = this.read(true);
            if (!value) throw new Error("Out of range. pointer: "+this.pointer+" value: "+value+" data: "+this.data);
            if (value===99) break;

            switch (value%10) {
                case 1: this.op_add(); break;
                case 2: this.op_mul(); break;
                case 3: this.op_input(); break;
                case 4: this.op_output(); break;
                case 5: this.op_jump_nzero(); break;
                case 6: this.op_jump_zero(); break;
                case 7: this.op_less(); break;
                case 8: this.op_equals(); break;
            }
        }

        return this.data[0];
    }
}

const perm = (xs: any[]): any[] => {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}

GetNumbers("./src/07/input").then(numbers => { 
    const machine = new IntReader();
    const outputs:number[] = [];
    perm([0,1,2,3,4]).forEach(p => {

        const a = machine.execute(numbers, [p[0], 0]);
        const b = machine.execute(numbers, [p[1], a[0]]);
        const c = machine.execute(numbers, [p[2], b[0]]);
        const d = machine.execute(numbers, [p[3], c[0]]);
        const e = machine.execute(numbers, [p[4], d[0]]);
        console.log("perm ", p, e[0]);
        outputs.push(e[0]);
    })
    const max = outputs.reduce((res, el) => {
        return Math.max(res, el);
    }, 0);
    console.log(max);
})
