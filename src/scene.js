


class Scene {
    constructor(tris=[], objects=[new Camera()], textures=[new ImageData(100, 100)]) {
        this.tris = tris;
        this.objects = objects;
        this.textures = textures;
    }


    async loadTexture(src="", index=this.textures.length) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = src;

            // Convert image to imagedata
            img.addEventListener("load", () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                
                ctx.drawImage(img, 0, 0);

                this.textures[index] = ctx.getImageData(0, 0, canvas.width, canvas.height);
                resolve();
            });
        })
    }

    update(dt) {
        for(let i in this.objects) {
            this.objects[i].update(this, dt);
        }
    }



    static async loadFromStr(str="") {

        const data = str.split(/[\n\r]+/g);

        let scene = new Scene();

        let verts = [];
        let currentTextureIndex = 0;
        let textureCount = 1;

        for(const line of data) {
            // Comment
            if(line.startsWith(":")) continue;
            // Set texture index
            if(line.startsWith("ti")) {
                currentTextureIndex = parseInt(line.split(" ")[1]);
                continue;
            }
            // Create new texture & set index to it
            if(line.startsWith("tf")) {
                currentTextureIndex = textureCount++;
                scene.loadTexture(line.slice(2, 99999), currentTextureIndex);
                continue;
            }
            // Create vertex
            if(line.startsWith("v")) {
                const split = line.split(" ");
                verts.push(new Vert(new Vec(parseFloat(split[1]), parseFloat(split[2]), parseFloat(split[3])), new UV(parseInt(split[4]), parseInt(split[5]))));
                continue;
            }
            // Create triangle
            if(line.startsWith("f")) {
                const split = line.split(" ");
                scene.tris.push(new Tri(verts[parseInt(split[1])-1].copy(), verts[parseInt(split[2])-1].copy(), verts[parseInt(split[3])-1].copy(), currentTextureIndex));
                continue;
            }



        }


        
        return scene;
    }

    static async loadFromFile(location="./resources/models/test.obj") {
        return new Promise((resolve, reject) => {
            const client = new XMLHttpRequest();
            client.open("GET", location);
            client.onloadend = () => {
                resolve(Scene.loadFromStr(client.responseText));
            }
            client.send();
        })
    }
}