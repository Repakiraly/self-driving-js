class Road{
    constructor(x,width,lanes=3){
        this.x=x;
        this.width=width;
        this.lanes=lanes;

        this.left=x-width/2;
        this.right=x+width/2;
    
        const infinity=10000000;
        this.top=-infinity;
        this.bottom=infinity;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=0; i<=this.lanes;i++){
            const x=lerp(this.left,this.right,i/this.lanes);
        
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }
    }
}

