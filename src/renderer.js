


class Renderer {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        if(this.ctx == null) {
            console.log("Canvas is not supported on your machine or browser!");
            return;
        }



        Scene.loadFromFile("./resources/models/test.obj").then((scene) => {
            this.scene = scene;
            this.scene.loadTexture("./resources/images/githubpfp.jpg", 1).then(() => {
                this.start();
            });
        });



        this.camera = 0; // Camera texture index
        this.cameraRenderScale = 0.5;



        this.FPS_TARGET = 30;
        this.FPS_CURRENT = this.FPS_TARGET;
        this.TIME = 0;
        this.DT = 0;

    }

    getCamera() {
        return this.scene.objects[this.camera];
    }

    getCameraTex() {
        return this.scene.textures[this.getCamera().texture];
    }

    
    start() {
        this.running = true;
        this.step();
        if(this.onstart) this.onstart(this);
    }

    stop() {
        this.running = false;
    }

    step() {
        if(!this.running) return;
        const start = Date.now();


        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = Math.floor(rect.width * this.cameraRenderScale);
        this.canvas.height = Math.floor(rect.height * this.cameraRenderScale);
        let ctex = this.getCameraTex();
        if(this.canvas.width != ctex.width || this.canvas.height != ctex.height) {
            this.scene.textures[this.getCamera().texture] = new ImageData(this.canvas.width, this.canvas.height);
        }

        this.scene.update((1 / this.FPS_CURRENT)*1000);

        this.ctx.putImageData(this.getCameraTex(), 0, 0);
        

        // Update current fps
        this.DT = Date.now() - start;
        if(this.DT > 1000 / this.FPS_CURRENT) this.FPS_CURRENT = 1000 / this.DT;
        if(this.FPS_CURRENT < this.FPS_TARGET && this.DT < 1000 / this.FPS_CURRENT) this.FPS_CURRENT = Math.min(this.FPS_TARGET, 1000 / this.DT);
        this.TIME += 1000 / this.FPS_CURRENT;

        if(this.onStep) this.onStep();

        setTimeout(() => this.step(), 1000 / this.FPS_CURRENT - this.DT);
    }

}