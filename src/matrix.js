


class Matrix {
    constructor(width=4, height=4, elements) {
        this.width = width;
        this.height = height;
        this.elements = elements || 0;
        if(typeof this.elements == "number" || typeof this.elements == "function") this.fill(this.elements);
    }

    /**
     * Copies the matrix
     * @returns {Matrix}
     */
    copy() {
        return new Matrix(this.width, this.height, this.elements);
    }

    fix() {
        if(!(this.elements instanceof Array)) this.elements = new Array(this.width * this.height).fill(0);
    }


    // Data modification
    /**
     * Gets data from position in the matrix
     * @param {Number} x 
     * @param {Number} y 
     * @returns Data from the matrix at the position
     */
    get(x, y) {
        return this.elements[x + y * this.width];
    }

    /**
     * Sets data at position in the matrix
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} num 
     * @returns {Number} Data that was overritten
     */
    set(x, y, num) {
        let ind = x + y * this.width;
        let l = this.elements[ind];
        this.elements[ind] = num;
        return l;
    }

    /**
     * Fills all the data in the matrix
     * @param {Number|Function} data 
     */
    fill(data=0) {
        this.fix();

        if(typeof data == "function") {
            for(let x=0; x < this.width; x++) {
                for(let y=0; y < this.height; y++) {
                    this.set(x, y, data(this.get(x, y), x, y));
                }
            }
            return;
        }

        for(let i in this.elements) {
            this.elements[i] = data;
        }
    }

    /**
     * Gets a row in the matrix
     * @param {Number} row 
     * @returns {Array}
     */
    getRow(row=0) {
        let arr = [];
        for(let i=0; i < this.height; i++) {
            arr[i] = this.get(i, row);
        }
        return arr;
    }

    /**
     * Gets a collumn in the matrix
     * @param {Number} col 
     * @returns {Array}
     */
    getCol(col=0) {
        let arr = [];
        for(let i=0; i < this.width; i++) {
            arr[i] = this.get(col, i);
        }
        return arr;
    }


    /**
     * Combines this smaller matrix to a bigger one
     * @param {Matrix} m 
     */
    getCombined(m) {
        if(m.width < this.width) return m.combine(this);

        let r = m.copy();
        for(let x=0; x < this.width; x++) {
            for(let y=0; y < this.height; y++) {
                r.set(x, y, this.get(x, y));
            }
        }
        return r;
    }

    /**
     * To size of s (The new elements are of a identity matrix)
     * @param {Number} s 
     * @returns {Matrix}
     */
    toSize(s) {
        return this.getCombined(Matrix.get_Identity(s));
    }



    ///////////////////////
    // PREMADE MATRICIES //
    ///////////////////////
    
    /**
     * Identity Matrix
     * 
     * [1 0 0 . 0]
     * [0 1 0 . 0]
     * [0 0 1 . 0]
     * [. . . . .]
     * [0 0 0 . 1]
     * 
     * @param {Number} size 
     * @returns {Matrix}
     */
    static get_Identity(size) {
        let m = new Matrix(size, size);
        for(let i=0; i < size; i++) {
            m.set(i, i, 1);
        }
        return m;
    }

    /**
     * Rotation matrix for X
     * Useful to rotate a point around the X axis
     * @param {Number} theta Amount to rotate in radians
     * @returns {Matrix}
     */
    static get_RotationX(theta=0) {
        let m = Matrix.get_Identity(3); let cos = Math.cos(theta); let sin = Math.sin(theta);
        m.set(1, 1, cos);
        m.set(2, 1, -sin);
        m.set(1, 2, sin);
        m.set(2, 2, cos);
        return m;
    }

    /**
     * Rotation matrix for Y
     * Useful to rotate a point around the Y axis
     * @param {Number} theta Amount to rotate in radians
     * @returns {Matrix}
     */
    static get_RotationY(theta=0) {
        let m = Matrix.get_Identity(3); let cos = Math.cos(theta); let sin = Math.sin(theta);
        m.set(0, 0, cos);
        m.set(2, 0, sin);
        m.set(0, 2, -sin);
        m.set(2, 2, cos);
        return m;
    }

    /**
     * Rotation matrix for Z
     * Useful to rotate a point around the Z axis
     * @param {Number} theta Amount to rotate in radians
     * @returns {Matrix}
     */
    static get_RotationZ(theta=0) {
        let m = Matrix.get_Identity(3); let cos = Math.cos(theta); let sin = Math.sin(theta);
        m.set(0, 0, cos);
        m.set(1, 0, -sin);
        m.set(0, 1, sin);
        m.set(1, 1, cos);
        return m;
    }

    /**
     * Rotation matrix
     * @param {Number} thetaX Amount to rotate the X axis in radians
     * @param {Number} thetaY Amount to rotate the Y axis in radians
     * @param {Number} thetaZ Amount to rotate the Z axis in radians
     */
    static get_Rotation(thetaX=0, thetaY=0, thetaZ=0) {
        let m = Matrix.get_Identity(3);
        let cosX = Math.cos(thetaX); let sinX = Math.sin(thetaX); let sinY = Math.sin(thetaY); let cosY = Math.cos(thetaY); let sinZ = Math.sin(thetaZ); let cosZ = Math.cos(thetaZ);
        m.set(0, 0, cosY*cosX);
        m.set(1, 0, sinZ*sinY*cosX - cosZ*sinX);
        m.set(2, 0, cosZ*sinY*cosX + sinZ*cosX);
        m.set(0, 1, cosY*sinX);
        m.set(1, 1, sinZ*sinY*sinX + cosZ*cosX);
        m.set(2, 1, cosZ*sinY*sinX - sinZ*cosX);
        m.set(0, 2, -sinY);
        m.set(1, 2, sinZ*cosY);
        m.set(2, 2, cosZ*cosY);
        return m;
    }

    static get_PerspectiveProjection(aspect, near=0.01, far=9999, fov=80) {
        let fovrad = 1 / Math.tan(fov * 0.5 / 180 * Math.PI);
        let m = new Matrix(4, 4);
        m.set(0, 0, aspect * fovrad);
        m.set(1, 1, fovrad);
        m.set(2, 2, far / (far - near));
        m.set(2, 3, (-far * near) / (far - near));
        m.set(3, 2, 1);
        m.set(3, 3, 0);
        return m;
    }

    static get_PointAt(pos, target, up=new Vec(0, 1, 0)) {
        let newForward = target.subVec(pos).normalized();
        let newUp = up.subVec(newForward.mul(up.dot(newForward))).normalized();
        let newRight = newUp.cross(newForward);

        let m = new Matrix(4, 4);
        m.elements = [
            newRight.x  , newRight.y  , newRight.z  , 0,
            newUp.x     , newUp.y     , newUp.z     , 0,
            newForward.x, newForward.y, newForward.z, 0,
            pos.x       , pos.y       , pos.z       , 1
        ];
        return m;
    }

    static get_Translation(pos) {
        let m = Matrix.get_Identity(4);
        m.set(3, 0, pos.x);
        m.set(3, 1, pos.y);
        m.set(3, 2, pos.z);
        return m;
    }






    ///////////////////////
    // MATRIX OPERATIONS //
    ///////////////////////
    mulMatrix(other) {
        // console.log(this, other);
        if(this.width != other.height) {
            throw "MATRIX MULTIPLICATION ERROR: Incompatible sizes.";
        }

        let result = new Matrix(other.width, this.height);
        for(let i=0; i < this.height; i++) {
            for(let j=0; j < other.width; j++) {
                let sum = 0;
                for(let k=0; k < this.width; k++) {
                    sum += this.get(k, i) * other.get(j, k);
                }
                result.set(j, i, sum);
            }
        }
        return result;
    }

    mulVec(v) {
        let r = new Vec();

        r.x = v.x * this.get(0, 0) + v.y * this.get(0, 1) + v.z * this.get(0, 2) + v.w * this.get(0, 3);
        r.y = v.x * this.get(1, 0) + v.y * this.get(1, 1) + v.z * this.get(1, 2) + v.w * this.get(1, 3);
        r.z = v.x * this.get(2, 0) + v.y * this.get(2, 1) + v.z * this.get(2, 2) + v.w * this.get(2, 3);
        r.w = v.x * this.get(3, 0) + v.y * this.get(3, 1) + v.z * this.get(3, 2) + v.w * this.get(3, 3);

        return r.div(r.w);
        // return r;
    }


    quickInverse() {
        let m = new Matrix(4, 4);
        m.set(0, 0, this.get(0, 0)); m.set(1, 0, this.get(0, 1)); m.set(2, 0, this.get(0, 2)); m.set(3, 0, 0);
        m.set(0, 1, this.get(1, 0)); m.set(1, 1, this.get(1, 1)); m.set(2, 1, this.get(1, 2)); m.set(3, 1, 0);
        m.set(0, 2, this.get(2, 0)); m.set(1, 2, this.get(2, 1)); m.set(2, 2, this.get(2, 2)); m.set(3, 2, 0);
        m.set(0, 3, -(this.get(0, 3) * m.get(0, 0) + this.get(1, 3) * m.get(0, 1) + this.get(2, 3) * m.get(0, 2)));
        m.set(1, 3, -(this.get(0, 3) * m.get(1, 0) + this.get(1, 3) * m.get(1, 1) + this.get(2, 3) * m.get(1, 2)));
        m.set(2, 3, -(this.get(0, 3) * m.get(2, 0) + this.get(1, 3) * m.get(2, 1) + this.get(2, 3) * m.get(2, 2)));
        m.set(3, 3, 1);
        return m;
    }

}


