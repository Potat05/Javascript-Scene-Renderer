

// Texture coordinate
class UV {
    constructor(u=0, v=0) {
        this.u = u;
        this.v = v;
    }

    add(uv) {
        return new UV(
            this.u + uv.u,
            this.v + uv.v
        );
    }

    mul(k) {
        return new UV(
            this.u * k,
            this.v * k
        );
    }
}
