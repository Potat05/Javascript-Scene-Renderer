


class Vec {
    constructor(x=0, y=0, z=0, w=1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static all(num, w=1) {
        return new Vec(num, num, num, w);
    }

    copy() {
        return new Vec(this.x, this.y, this.z, this.w);
    }

    getArray() {
        return [this.x, this.y, this.z, this.w];
    }

    static fromArray(arr) {
        return new Vec(arr[0] || 0, arr[1] || 0, arr[2] || 0, arr[3] || 1);
    }

    getColor() {
        return `rgb(${this.x}, ${this.y}, ${this.z})`;
    }



    // Vector Operations
    add(num) {return new Vec(this.x + num, this.y + num, this.z + num)}
    static add(v, num) {return v.add(num)}
    addVec(v) {return new Vec(this.x + v.x, this.y + v.y, this.z + v.z)}  
    static addVec(v1, v2) {return v1.addVec(v2)}

    sub(num) {return new Vec(this.x - num, this.y - num, this.z - num)}
    static sub(v, num) {return v.sub(num)}
    subVec(v) {return new Vec(this.x - v.x, this.y - v.y, this.z - v.z)}  
    static subVec(v1, v2) {return v1.subVec(v2)}

    mul(num) {return new Vec(this.x * num, this.y * num, this.z * num)}
    static mul(v, num) {return v.mul(num)}
    mulVec(v) {return new Vec(this.x * v.x, this.y * v.y, this.z * v.z)}
    static mulVec(v1, v2) {return v1.mulVec(v2)}

    div(num) {return this.mul(1 / num)}
    static div(v, num) {return v.div(num)}
    divVec(v) {return new Vec(this.x / v.x, this.y / v.y, this.z / v.z)}
    static divVec(v1, v2) {return v1.divVec(v2)}

    mod(num) {return new Vec(this.x % num, this.y % num, this.z % num)}
    static mod(v, num) {return v.mod(num)}
    modVec(v) {return new Vec(this.x % v.x, this.y % v.y, this.z % v.z)}
    static modVec(v1, v2) {v1.mod(v2)}

    // Advanced Vector Operations
    get length2() {return this.x**2 + this.y**2 + this.z**2}
    get length() {return Math.sqrt(this.length2)}

    normalized() {return this.div(this.length)}
    static normalized(v) {return v.normalized()}

    dot(v) {return this.x * v.x + this.y * v.y + this.z * v.z}
    static dot(v1, v2) {return v1.dot(v2)}

    cross(v) {
        return new Vec(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    static cross(v1, v2) {return v1.cross(v2)}

    static fromAngles(theta, phi) {
        return new Vec(
            Math.cos(theta) * Math.cos(phi),
            Math.sin(phi),
            Math.sin(theta) * Math.cos(phi)
        );
    }

    area(v2, v3) {
        return Math.abs((this.x*(v2.y-v3.y) + v2.x*(v3.y-this.y)+ v3.x*(this.y-v2.y))/2.0);
    }


    // Other
    equals(v) {return (this.x == v.x && this.y == v.y && this.z == v.z)}
    static equals(v1, v2) {return v1.equals(v2)}
}



