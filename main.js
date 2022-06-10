const carCanvas=document.getElementById("carCanvas");
carCanvas.width=300;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road= new Road(carCanvas.width/2,carCanvas.width*0.90)
const N = 500;
const cars = generateCars(N);
const traffic = generateTraffic(10);
let bestBrain = cars[0].brain; 
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



// console.log(traffic)
animate();


function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function loadCache(){
    if(localStorage.getItem("bestBrain")){
    bestBrain=JSON.parse(
    localStorage.getItem("bestBrain"));
    }
}

function generateCars(N){
    const cars=[];
    // cars.push(new Car(road.getLaneCenter(1),100,32,66,"KEYS",5));
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(2),100,29,71,"AI",8))
    }
    return cars;
}

function moreTraffic(){
    for(let i=0; i<10; i++){
        traffic.push(new Car(road.getLaneCenter(getRandomIntFromRange(0,5)),getRandomFromRange(bestCar.y-750,bestCar.y-2000),32,66,"DUMMY",getRandomFromRange(2,8)));
    }
    return traffic;
}

function moreAI(){
    for(let i=0;i<100;i++){
        cars.push(new Car(road.getLaneCenter(2),bestCar.y,29,71,"AI",8)); 
        console.log(cars.length-1);
        cars[cars.length-1].brain=bestBrain;
        NeuralNetwork.mutate(cars[cars.length-1].brain,0.15);
    }
    return cars;
}

function generateTraffic(N) {
    const traffic = [];
    for(let i=0; i<N; i++){
        traffic.push(new Car(road.getLaneCenter(getRandomIntFromRange(0,5)),getRandomFromRange(-100,-1000),32,66,"DUMMY",getRandomFromRange(2,8)));
    }

    return traffic;
}


function animate(time){
    // console.log(traffic.length)
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(...cars.map(c=>c.y)) //creating  a new array with obly 'y' values then spreading it because min doesnt worh with array
    );

    // bestCar=cars[0];

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
    console.log(bestCar.speed)

    carCtx.restore();

    networkCtx.lineDashOffset=-time/60;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    requestAnimationFrame(animate);
}

function play() {
  var audio = new Audio('audio/drift.mp3');
  audio.play();
}