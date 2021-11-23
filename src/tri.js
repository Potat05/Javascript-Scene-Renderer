

// Triangle with 3 verticies
class Tri {
    constructor(v1, v2, v3) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    copy() {
        return new Tri(this.v1.copy(), this.v2.copy(),this.v3.copy());
    }

    normal() {
        return this.v2.pos.subVec(this.v1.pos).cross(this.v3.pos.subVec(this.v1.pos)).normalized();
    }

    mulMatrix(mat) {
        let t = this.copy();
        t.v1.pos = mat.mulVec(t.v1.pos);
        t.v2.pos = mat.mulVec(t.v2.pos);
        t.v3.pos = mat.mulVec(t.v3.pos);
        return t;
    }

    translate(pos) {
        let t = this.copy();
        t.v1.pos = t.v1.pos.addVec(pos);
        t.v2.pos = t.v2.pos.addVec(pos);
        t.v3.pos = t.v3.pos.addVec(pos);
        return t;
    }

    scale(k) {
        let t = this.copy();
        t.v1.pos = t.v1.pos.mul(k);
        t.v2.pos = t.v2.pos.mul(k);
        t.v3.pos = t.v3.pos.mul(k);
        return t;
    }

    point(v, dif=0.01) {
        // Triangle bounds
        let a = this.v1.pos.area(this.v2.pos, this.v3.pos);
        let a1 = v.area(this.v2.pos, this.v3.pos);
        let a2 = this.v1.pos.area(v, this.v3.pos);
        let a3 = this.v1.pos.area(this.v2.pos, v);
        if(a1+a2+a3 < a-dif || a1+a2+a3 > a+dif) return false; // We find if it's in a small range to fix a bug
        // Get uv on triangle
        return this.v1.uv.mul(a1 / a).add(this.v2.uv.mul(a2 / a)).add(this.v3.uv.mul(a3 / a));
    }

    boundMin() {
        return new Vec(
            Math.floor(Math.max(Math.min(this.v1.pos.x, this.v2.pos.x, this.v3.pos.x), 0)),
            Math.floor(Math.max(Math.min(this.v1.pos.y, this.v2.pos.y, this.v3.pos.y), 0))
        );
    }

    boundMax(width=9999, height=9999) {
        return new Vec(
            Math.ceil(Math.min(Math.max(this.v1.pos.x, this.v2.pos.x, this.v3.pos.x), width)),
            Math.ceil(Math.min(Math.max(this.v1.pos.y, this.v2.pos.y, this.v3.pos.y), height))
        );
    }
}