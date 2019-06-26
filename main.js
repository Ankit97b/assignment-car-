(function () {
    var CAR_WIDTH = 100;
    var CAR_HEIGHT = 50;
    var GAME_FPS = 60;
    var GAME_SPEED = 1;

    var otherCars = [
        './images/carimage.png',
        './images/carimage.png',
        './images/carimage.png',
    ];
    var LANES = {
        'left': '20',
        'middle': '210',
        'right': '360',

    };
    var LANEVALUES = Object.values(LANES);

    (function () {
        //creating road lanes
        var carLane = document.getElementById('carLane');
        carLane.style.background = 'gray';
        carLane.style.width = 500 + 'px';
        carLane.style.height = 500 + 'px';



        //creating road lanes
        var roadStripes = document.getElementById('roadStripes');
        roadStripes.style.position = 'relative';
        roadStripes.style.backgroundImage = `url('./images/stripe.png')`;//used ES6 features otherwise we have to concat
        roadStripes.style.backgroundRepeat = 'repeat-y';
        roadStripes.style.backgroundSize = 100 + '%';


        roadStripes.style.height = 700 + 'px';
        var gamePause = document.getElementById('gamePause');
        gamePause.style.position = 'absolute';



    }());
    //get Random Values from this function
    function getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.random() * (max - min) + min;
    }
    //creating car class
    function CAR(x, y, parentElem) {
        this.x = x;
        this.y = y;
        this.elem = null;
        this.remove = false;

        this.clear = function () {
            this.elem.remove();
            this.remove = true;
        };

        //initialization of the car
        this.init = function (carImage) {
            this.elem = document.createElement('div');
            this.elem.style.backgroundImage = 'url(' + carImage + ')';
            this.elem.style.backgroundRepeat = 'no-repeat';
            this.elem.style.width = CAR_WIDTH + 'px';
            this.elem.style.height = CAR_HEIGHT + 'px';
            this.elem.style.position = 'absolute';
            this.elem.style.backgroundPosition = 'center';
            this.elem.style.backgroundSize = '100% 100%';
            parentElem && parentElem.appendChild(this.elem);
        };
        //drawing the car in x and y co ordinates
        this.draw = function () {
            this.elem.style.top = this.y + 'px';
            this.elem.style.left = this.x + 'px';

        };

        this.move = function (incrementX, incrementY) {
            this.x = this.x + incrementX;
            this.y = this.y + incrementY;
            this.draw();
        }
        this.moveUserCar = function (position) {
            this.x = position;
            this.draw();
        };

        //get the co ordinates of all sides of a car
        this.getCarTop = function () {
            return this.y;
        };
        this.getCarBottom = function () {
            return this.y + CAR_HEIGHT;
        };
        this.getCarLeft = function () {
            return this.x;
        };
        this.getCarRight = function () {
            return this.x + CAR_WIDTH;
        };
    }
    function carAnimation(fps, parentElem) {
        var obstacleCars = []; 
        var userCar = null;
        var carCollision = false;
        var currentLane = 1;
        var score = 0;
        var objectGenerationRate=CAR_HEIGHT*3 + 20;
        fps = fps || GAME_FPS;
         
        var animationFrameVariable = 0;
        var speedIntervalVariable = 0;
        
        var gameSpeed = gameSpeed || GAME_SPEED;

        this.init = function () {
            this.gameReset();

            this.generateUserCar();
            this.gameStart();

           
        };
        //to reset everything 
        this.gameReset = function () {
            obstacleCars = [];
            userCar = null;
            score = 0;
            carCollision = false;
            gameSpeed = gamepeed || GAME_SPEED;

        }
        this.generateUserCar = function () {
            var xaxis = LANEVALUES[currentLane];
            var yaxis = 500 - CAR_HEIGHT - 10;
            userCar = new CAR(xaxis, yaxis, parentElem);
            userCar.init('./images/carimage.png');
            userCar.draw();


        };
        this.gameStart = function () {
            //speed up game speed every 1 sec 
            speedIntervalVariable = setInterval(function () {
                gameSpeed += 0.1;
            }, 1000);

            //generate obstacle after 2 sec
            setTimeout(function () {
                var carObstacle = generateObstacle(parentElem);
                obstacleCars.push(carObstacle);
            }, 2000);

            
            animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
        };
        this.animate = function () {
            if (!carCollision) {
                this.MoveBackgroundImagesAndObstacles();
                 DisplayScoreAndInfo(score, speed);
            
            animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
            }   
            if (carCollision) {
                playButton.innerHTML = 'play Again';
            }

        };
        this.createObstacles = function () {
            
            if (obstacleCars.length != 0) {
                var lastCar = obstacleCars[obstacleCars.length - 1];
                if (lastCar.y > objectGenerationRate) {
                    var carObstacle = generateObstacle(parentElement);
                    obstacleCars.push(carObstacle);
                }
            }

           
            if (distanceTravelled > 5000) {
                objectGenerationRate = CAR_HEIGHT * 2 + 20;
            }
        }
        this.MoveBackgroundImagesAndObstacles = function () {
            var isCarOutOfBoundary = false;
            for (var i = 0; i < obstacleCars.length; i++) {
                obstacleCars[i].draw();

                if (userCar.getCarLeft() < obstacleCars[i].getCarRight() &&
                    userCar.getCarRight() > obstacleCars[i].getCarLeft() &&
                    (userCar.getCarTop() + 10) < obstacleCars[i].getCarBottom() &&
                    userCar.getCarBottom() - 10 > obstacleCars[i].getCarTop()) {
                    carCollision = true;
                }
                if (obstacleCars[i].y > 500) {
                    obstacleCars[i].clear();
                    score += 1;

                }
            }
        };
        this.moveCar = function (e) {
            if (!carCollision) {
                if (e.code == "ArrowLeft") {
                    if (currentLane > 0) {
                        if (userCar.x <= LANEVALUES[currentLane]) {
                            currentLane--;
                            userCar.x = LANEVALUES[currentLane];
                            userCar.draw();
                        }
                    }
                }
                if (e.code == "ArrowRight") {
                    if (currentLane < (LANEVALUES.length - 1)) {
                        if (userCar.x <= LANEVALUES[currentLane]) {
                            currentLane++;
                            userCar.x = LANEVALUES[currentLane];
                            userCar.draw();

                        }
                    }
                }

            };
        }


    };
    function generateObstacle(parentElem) {
        var obstacleImagePosition = getRandom(0, (otherCars.length - 1));
        var obstacleImage = otherCars[obstacleImagePosition];
        var lane = getRandom(0, LANEVALUES.length - 1);
        var car = new CAR(LANEVALUES[lane], 0, parentElem);
        car.init(obstacleImage);
        car.draw();
        return car;

    }
    function DisplayScoreAndInfo(score, speed) {
        speed = Math.floor(speed * 100);
    }
    var parentElem = document.getElementById('roadStripes');
    var carAnimation = new carAnimation(60, parentElem);

    window.addEventListener("keydown", carAnimation.moveCar);

    var gameButton = document.getElementById('playButton');

    gameButton.addEventListener("click", playAgain);

    function playAgain() {
        carAnimation.init();
    }


}());
