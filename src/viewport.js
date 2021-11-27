


class Viewport {
    constructor(pos=new Vec(), yaw=0, pitch=0, texture=0, fov=90) {
        this.pos = pos;
        this.yaw = yaw;
        this.pitch = pitch;
        this.calc();

        this.texture = texture;  
        this.backgroundEnabled = true;
        this.background = "dimgray"; 

        this.fov = fov;  
    }

    calc() {
        this.dir = Vec.fromAngles(this.yaw, this.pitch);
        this.up = new Vec(0, -1, 0);
        this.left = this.up.cross(this.dir);
    }

    update(scene, dt) {
        this.render(scene);
    }

    render(scene) {
        // Will always try to render at max size of texture

        // Set texture as background color
        if(this.backgroundEnabled) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = scene.textures[this.texture].width;
            canvas.height = scene.textures[this.texture].height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            scene.textures[this.texture] = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        const texture = scene.textures[this.texture];



        
        let matCam = Matrix.get_PointAt(this.pos, this.pos.addVec(this.dir), this.up);
        let matView = matCam.quickInverse();

        let matProj = Matrix.get_PerspectiveProjection(texture.height / texture.width, 0.1, 1000, this.fov);

        let trisToRender = [];

        for(let i in scene.tris) {
            const triV = scene.tris[i].mulMatrix(matView);

            let triM = triV.mulMatrix(matProj);

            triM.v1.pos.x *= texture.width * 0.5;
            triM.v1.pos.y *= texture.height * 0.5;
            triM.v2.pos.x *= texture.width * 0.5;
            triM.v2.pos.y *= texture.height * 0.5;
            triM.v3.pos.x *= texture.width * 0.5;
            triM.v3.pos.y *= texture.height * 0.5;
            triM = triM.translate(new Vec(texture.width*0.5, texture.height*0.5, 0));

            if(triM.v1.z <= 1) continue;

            trisToRender.push(triM);
        }




        trisToRender.sort((a, b) => {
            return (b.v1.pos.z + b.v2.pos.z + b.v3.pos.z)*0.33 - (a.v1.pos.z + a.v2.pos.z + a.v3.pos.z)*0.33;
        });




        for(let tri of trisToRender) {

            const textureF = scene.textures[tri.texture];
            if(!textureF) continue;

            let boundMin = tri.boundMin();
            let boundMax = tri.boundMax(texture.width, texture.height);

            for(let x=boundMin.x; x < boundMax.x; x++) {
                for(let y=boundMin.y; y < boundMax.y; y++) {

                    let uv = tri.point(new Vec(x, y));
                    if(uv == false) continue;

                    const indF = (Math.floor(uv.u) + Math.floor(uv.v) * textureF.width) *4;

                    const ind = (x + y * texture.width) * 4;
                    texture.data[ind+0] = textureF.data[indF+0];
                    texture.data[ind+1] = textureF.data[indF+1];
                    texture.data[ind+2] = textureF.data[indF+2];
                    texture.data[ind+3] = 255;

                }
            }

        }

    }
}