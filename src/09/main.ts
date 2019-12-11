import { GetNumbers } from "../core";

const BY_REF = 0;
const BY_VALUE = 1;
const BY_REL = 2;

class IntReader {
    input:number[];
    output:(n:number)=>void;
    private data:number[];
    private pointer:number;
    private input_pointer:number;
    private relative_base:number;

    constructor (data:number[]) {
        this.data = data.map(d => d);
        this.pointer = 0;       
        this.input_pointer = 0;
        this.relative_base = 0;
    }

    execute = async () => {

        while (true) {
            const value = this.read(BY_VALUE);
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
            case 9: return this.op_rel_base();
        }
    }

    private read = (mode:number = BY_REF, move:boolean = false) => {
        const value = this.data[this.pointer];
        if (move) ++this.pointer;

        if (mode===BY_VALUE) return value || 0;

        if (mode===BY_REF) return this.data[ value ] || 0;

        const rel = this.relative_base + value;        
        return this.data[ rel ] || 0;
    }

    private readLiteral = (mode:number = 1, move:boolean = false) => {
        let c = this.read(BY_VALUE, move);
        if (mode===2) c += this.relative_base;
        return c;
    }

    private write = (p:number, v:number) => {
        this.data[p] = v;
    }

    private modes = () => {
        let res = Math.floor(this.read(BY_VALUE)/100);
        const modes:number[] = []
        while (res!==0) {
            modes.push(res%10);
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
        const c = this.readLiteral(modes[2], true);
        
        this.write(c, a+b);
    }

    private op_mul = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        const b = this.read(modes[1], true);      
        const c = this.readLiteral(modes[2], true);
        
        this.write(c, a*b);
    }

    private op_input = async ():Promise<void> => {
        const modes = this.modes();
        const input = await this.getInput();
        ++this.pointer;
        
        const p = this.readLiteral(modes[0], true);
        this.write(p, input);
        
        return Promise.resolve();
    }

    private op_output = () => {
        const modes = this.modes();
        ++this.pointer;
        const out = this.read(modes[0], true);        
        console.log("Output: ", out, "(pointer: "+this.pointer+")");
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
        const c = this.readLiteral(modes[2], true);

        this.write(c, f(a,b)?1:0);
    }

    private op_rel_base = () => {
        const modes = this.modes();
        ++this.pointer;
        const a = this.read(modes[0], true);
        this.relative_base += a;
    }
}

GetNumbers("./src/09/input").then(numbers => { 
    // numbers = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99];
    // numbers = [1102,34915192,34915192,7,4,7,99,0];
    // numbers = [104,1125899906842624,99];
    const reader = new IntReader(numbers);
    reader.input = [2];
    reader.output = n => {};
    
    reader.execute().then(n => {
        console.log("done, ", n);
    })
})
