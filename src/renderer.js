


class Renderer {
    constructor() {
        this._init();
    }

    _init() {
        this.canvas = document.getElementById("RenderCanvas");
        this.ctx = this.canvas.getContext("2d");

        if(this.ctx == null) {
            console.log("Canvas is not supported on your machine or browser!");
            return;
        }

        this.mesh = Mesh.loadFromStr("t ./resources/images/githubpfp.jpg\nv -0.5 0.5 0 700 0\nv 0.5 0.5 0 0 0\nv -0.5 -0.5 0 700 720\nv 0.5 -0.5 0 0 720\nf 1 2 3\nf 3 2 4");

        this.camera = new Camera();

        this.FPS_TARGET = 60;
        this.FPS_CURRENT = this.FPS_TARGET;
        this.TIME = 0;
        this.DT = 0;

        setTimeout(() => this.start(), 100);
    }



    
    start() {
        this.running = true;
        this.step();
    }

    stop() {
        this.running = false;
    }

    step() {
        if(!this.running) return;
        const start = Date.now();


        let rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        this.camera.update((1 / this.FPS_CURRENT)*1000);
        this.draw();
        

        // Update current fps
        this.DT = Date.now() - start;
        if(this.DT > 1000 / this.FPS_CURRENT) this.FPS_CURRENT = 1000 / this.DT;
        if(this.FPS_CURRENT < this.FPS_TARGET && this.DT < 1000 / this.FPS_CURRENT) this.FPS_CURRENT = Math.min(this.FPS_TARGET, 1000 / this.DT);
        this.TIME += 1000 / this.FPS_CURRENT;

        if(this.onStep) this.onStep();

        setTimeout(() => this.step(), 1000 / this.FPS_CURRENT - this.DT);
    }

    draw() {

        let matCam = Matrix.get_PointAt(this.camera.pos, this.camera.pos.addVec(this.camera.dir), this.camera.up);
        let matView = matCam.quickInverse();

        let matProj = Matrix.get_PerspectiveProjection(this.canvas.height / this.canvas.width, 0.1, 1000, 90);

        let trisToRender = [];

        for(let i in this.mesh.tris) {
            let triM = this.mesh.tris[i].mulMatrix(matView).mulMatrix(matProj);

            triM.v1.pos.x *= this.canvas.width * 0.5;
            triM.v1.pos.y *= this.canvas.height * 0.5;
            triM.v2.pos.x *= this.canvas.width * 0.5;
            triM.v2.pos.y *= this.canvas.height * 0.5;
            triM.v3.pos.x *= this.canvas.width * 0.5;
            triM.v3.pos.y *= this.canvas.height * 0.5;
            triM = triM.translate(new Vec(this.canvas.width*0.5, this.canvas.height*0.5, 0));


            trisToRender.push(triM);
        }




        this.ctx.fillStyle = "#222";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


        let img = this.ctx.createImageData(this.canvas.width, this.canvas.height);


        for(let tri of trisToRender) {
            // this.ctx.fillStyle = "red";
            // this.ctx.strokeStyle = "red";
            // this.ctx.lineWidth = 1;
            // this.ctx.beginPath();
            // this.ctx.moveTo(tri.v1.pos.x, tri.v1.pos.y);
            // this.ctx.lineTo(tri.v2.pos.x, tri.v2.pos.y);
            // this.ctx.lineTo(tri.v3.pos.x, tri.v3.pos.y);
            // this.ctx.closePath();
            // this.ctx.fill();
            // this.ctx.stroke();

            let boundMin = tri.boundMin();
            let boundMax = tri.boundMax(this.canvas.width, this.canvas.height);

            for(let x=boundMin.x; x < boundMax.x; x++) {
                for(let y=boundMin.y; y < boundMax.y; y++) {

                    let uv = tri.point(new Vec(x, y));
                    if(uv == false) continue;

                    let color = this.mesh.tex.get(uv);


                    const ind = (x + y * this.canvas.width) * 4;
                    img.data[ind+0] = color.x;
                    img.data[ind+1] = color.y;
                    img.data[ind+2] = color.z;
                    img.data[ind+3] = 255;

                }
            }

        }


        this.ctx.putImageData(img, 0, 0);


    }
}