const carCanvas=document.getElementById("carCanvas");
carCanvas.width=300;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road= new Road(carCanvas.width/2,carCanvas.width*0.90)
const N =300;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
        localStorage.getItem("bestBrain")
    );
    if(i!=0){
        NeuralNetwork.mutate(cars[i].brain,0.15);
    }
    }
    
}

const traffic = [
    new Car(road.getLaneCenter(1),-100,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(2),-300,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(3),-250,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(0),-500,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(0),-350,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(3),-650,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(4),-700,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(3),-700,29,71,"DUMMY",getRandomFromRange(1,4)),
    new Car(road.getLaneCenter(2),-800,29,71,"DUMMY",getRandomFromRange(1,4)),
    
];

console.log(traffic)

animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(2),100,29,71,"AI",5))
    }

    return cars;
}

function animate(time){
    console.log(traffic.length)
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(...cars.map(c=>c.y)) //creating  a new array with obly 'y' values then spreading it because min doesnt worh with array
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha=0.2;
    cars[0].draw(carCtx,"yellow");
    for(let i=1;i<cars.length;i++){

        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/60;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    requestAnimationFrame(animate);
}