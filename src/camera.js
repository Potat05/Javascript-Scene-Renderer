


class Camera {
    constructor(pos=new Vec(0, 0, -5), yaw=0, pitch=0) {
        this.pos = pos;
        this.yaw = yaw;
        this.pitch = pitch;
        this.calc();
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

    calc() {
        this.dir = Vec.fromAngles(this.yaw, this.pitch);
        this.up = new Vec(0, -1, 0);
        this.left = this.up.cross(this.dir);
    }

    update(dt=1) {
        // console.log(this.KEYS);
        // this.yaw += 0.1;
        // this.calc();

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

        // console.log(this.pos, this.yaw, this.pitch);
    }
}