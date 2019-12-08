import { GetNumbers } from "../core";

class IntReader {
    input:number[];
    output:(n:number)=>void;
    private data:number[];
    private pointer:number;
    private input_pointer:number;

    constructor (data:number[]) {
        this.data = data.map(d => d);
        this.pointer = 0;       
        this.input_pointer = 0;
    }

    execute = async () => {

        while (true) {
            const value = this.read(true);
            if (!value) {
                const e = "Out of range! pointer: "+this.pointer+" value: "+value+" data: "+this.data;
                throw new Error(e);
            }
            if (value===99) break;
            await this._executeOpCode(value);
        }
        return this.data[0];
    }

    private _executeOpCode = (value:number) => {
        switch (value%10) {
            case 1: return this.op_add();
            case 2: return this.op_mul();
            case 3: return this.op_input();
            case 4: return this.op_output();
            case 5: return this.op_jump_nzero();
            case 6: return this.op_jump_zero();
            case 7: return this.op_less();
            case 8: return this.op_equals();
        }
    }

    private read = (immediate:boolean = false, move:boolean = false) => {
        const v = this.data[this.pointer];
        if (move) ++this.pointer;
        return immediate ? v : this.data[v];
    }

    private write = (p:number, v:number) => {
        this.data[p] = v;
    }

    private modes = () => {
        let res = Math.floor(this.read(true)/100);
        const modes:boolean[] = []
        while (res!=0) {
            modes.push(res%10===1)
            res = Math.floor(res/10);
        }
        return modes;
    }

    private getInput = async ():Promise<number> => {
        const timeout = (ms:number) => new Promise(res => setTimeout(res, ms));        
        let input = this.input[this.input_pointer];
        while (input===undefined) { 
            // console.log("waiting for input 50ms")
            await timeout(50);
            input = this.input[this.input_pointer];
        }
        ++this.input_pointer;
        return input;
    }

    private op_add = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);
        const c = this.read(true, true);
        this.write(c, a+b);
    }

    private op_mul = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);        
        const c = this.read(true, true);
        this.write(c, a*b);
    }

    private op_input = async ():Promise<void> => {
        const input = await this.getInput();
        ++this.pointer;
        const p = this.read(true, true);
        this.write(p, input);
        
        return Promise.resolve();
    }

    private op_output = () => {
        ++this.pointer;
        const p = this.read(true, true);
        const out = this.data[p];
        console.log("Output: ", out, "(pointer: "+p+")");
        this.output(out);
    }

    private op_jump_nzero = () => this.op_jump(true);
    private op_jump_zero = () => this.op_jump(false);

    private op_jump = (nzero:boolean) => {
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

    private op_less = () => this.op_compare((a,b)=>a<b);
    private op_equals = () => this.op_compare((a,b)=>a===b);
    private op_compare = (f:(a:number,b:number)=>boolean) => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);
        const p = this.read(true, true);
        this.write(p, f(a,b)?1:0);
    }
}

const perm = <T>(xs: T[]): T[][] => {
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

const execute = async (perm:number[], data:number[]) => {

    const a = new IntReader(data);
    const b = new IntReader(data);
    const c = new IntReader(data);
    const d = new IntReader(data);
    const e = new IntReader(data);

    a.input = [perm[0], 0];
    b.input = [perm[1]];
    c.input = [perm[2]];
    d.input = [perm[3]];
    e.input = [perm[4]];

    a.output = n => b.input.push(n);
    b.output = n => c.input.push(n);
    c.output = n => d.input.push(n);
    d.output = n => e.input.push(n);
    e.output = n => a.input.push(n);

    await Promise.all([
        a.execute(),
        b.execute(),
        c.execute(),
        d.execute(),
        e.execute(),
    ]);

    return Promise.resolve(a.input[a.input.length - 1]);
}

GetNumbers("./src/07/input").then(numbers => { 
    const promises = perm([5,6,7,8,9]).map(perm => {
        return execute(perm, numbers);
    });

    Promise.all(promises).then(results => {
        const max = results.reduce((res, el) => {
            return Math.max(res, el);
        }, 0);

        console.log("max thrust: ", max);
    })
})
