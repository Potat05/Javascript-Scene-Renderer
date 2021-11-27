


class Camera extends Viewport {
    constructor(pos=new Vec(), yaw=0, pitch=0, texture=0) {
        super(pos, yaw, pitch, texture);
        
        this.moveSpeed = 0.01;
        this.turnRate = 0.005;

        this.KEYS = [];
        document.addEventListener("keydown", (e) => {
            this.KEYS = this.KEYS.filter((k) => {return k != e.code});
            this.KEYS.push(e.code);
        });
        document.addEventListener("keyup", (e) => {
            this.KEYS = this.KEYS.filter((k) => {return k != e.code});
        });
        this.isKeyDown = (code) => {
            return this.KEYS.some((k) => {return k == code});
        }
    }

    update(scene, dt=1) {
        super.update(scene, dt);

        if(this.isKeyDown("KeyW")) this.pos = this.pos.addVec(this.dir.mul(this.moveSpeed * dt));
        if(this.isKeyDown("KeyS")) this.pos = this.pos.subVec(this.dir.mul(this.moveSpeed * dt));
        if(this.isKeyDown("KeyA")) this.pos = this.pos.subVec(this.left.mul(this.moveSpeed * dt));
        if(this.isKeyDown("KeyD")) this.pos = this.pos.addVec(this.left.mul(this.moveSpeed * dt));
        if(this.isKeyDown("Space")) this.pos = this.pos.subVec(this.up.mul(this.moveSpeed * dt));
        if(this.isKeyDown("ShiftLeft")) this.pos = this.pos.addVec(this.up.mul(this.moveSpeed * dt));

        if(this.isKeyDown("ArrowLeft")) this.yaw -= this.turnRate * dt;
        if(this.isKeyDown("ArrowRight")) this.yaw += this.turnRate * dt;
        if(this.isKeyDown("ArrowUp")) this.pitch += this.turnRate * dt;
        if(this.isKeyDown("ArrowDown")) this.pitch -= this.turnRate * dt;

        this.calc();

    }
}