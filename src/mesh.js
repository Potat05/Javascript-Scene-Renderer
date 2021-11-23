


class Mesh {
    constructor(tris=[], tex=new Texture()) {
        this.tris = tris;
        this.tex = tex;
    }

    static loadFromStr(str="") {
        let verts = [];
        let tris = [];

        let texture = new Texture();

        const data = str.split("\n");
        // First pass, Find the texture file location
        for(let i in data) {
            const split = data[i].split(" ");
            if(split[0] == "t") texture = new Texture(data[i].slice(2, 9999));
        }
        // Second pass, Find the verticies
        for(let i in data) {
            const split = data[i].split(" ");
            if(split[0] == "v") verts.push(Vert.d(Number(split[1]), Number(split[2]), Number(split[3]), Number(split[4]), Number(split[5])));
        }
        // Third pass, Find the tris
        for(let i in data) {
            const split = data[i].split(" ");
            if(split[0] == "f") tris.push([Number(split[1])-1, Number(split[2])-1, Number(split[3])-1]);
        }

        // Create the tris
        for(let i in tris) {
            tris[i] = new Tri(
                verts[tris[i][0]].copy(),
                verts[tris[i][1]].copy(),
                verts[tris[i][2]].copy(),
            );
        }
        
        return new Mesh(tris, texture);
    }

}

