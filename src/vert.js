

// Vertex with position & texture coordinate
class Vert {
    constructor(pos, uv) {
        this.pos = pos;
        this.uv = uv;
    }

    static d(x, y, z, u, v) {
        return new Vert(new Vec(x, y, z), new UV(u, v));
    }

    copy() {
        return new Vert(
            new Vec(this.pos.x, this.pos.y, this.pos.z),
            new UV(this.uv.u, this.uv.v)
        );
    }
}