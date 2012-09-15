(function(_, Backbone, SumOfUs, undefined){
    var Game = Backbone.Model.extend({
        defaults : {
	    numberOfTeams : 4,
	    carsPerTeam : 2,
	    roundsCompleted : 0,
	    playerDefaultMaxSpeed : 5,
	    playerDefaultAcceleration : 1,
	    pointsPerCheckpoint : 10,
	    secondsPerMove : 30,
	    totalRounds : 30,
	    roundsBetweenBreaks : 5,
	    breakLength : 180
	},

	initialize : function(){
	    if(this.get("track") == undefined){
	        throw "Can't create a game without a track";
	    }
	    var playerCars = [];
	    var scores = [];
	    for(var team = 0; team < this.get("numberOfTeams"); team++){
	        var cars = [];
		var teamscores = [];
	        for(var car = 0; car < this.get("carsPerTeam"); car++){
	            cars.push(new SumOfUs.Car({maxSpeed : this.get("playerDefaultMaxSpeed"),
	                                       acceleration : this.get("playerDefaultAcceleration")}));
		    teamscores.push(0);
	        }
	        playerCars.push(cars);
		scores.push(teamscores);
	    }
	    this.set("playerCars", playerCars);
	    this.set("scores",scores);
	    this.set("currentTurn", [0,0]);
	    this.set("status","not started");

	    if(this.get("checkpointOrder") == undefined){
	        this.set("checkpointOrder",["A","B"]);
	    }

	    this.set("timer",new SumOfUs.Timer());
	    this.set("breakTimer",new SumOfUs.Timer());
        },

	assignLocationToPlayerCar : function(teamNumber, carNumber, position, direction){
	    var car = this.get("playerCars")[teamNumber][carNumber];
	    car.moveTo(position, direction, 1);
	},

	start : function(){
	    var cars = this.get("playerCars");
	    for(var team = 0; team < this.get("numberOfTeams"); team++){
	        for(var car = 0; car < this.get("carsPerTeam"); car++){
		    if(cars[team][car].get("position") == undefined){
		        throw "Can't start when not all cars have a position";
		    }
		}
	    }
	    if(this.get("status") == "not started"){
	       this.set("currentTurn", [0,0]);
	       this.set("roundsCompleted", 0);
	    }

	    this.setupNextTurn();
            this.startBreakTimer();
	},

	setupNextTurn : function(){
	    var currentStatus = this.get("status");
	    if(currentStatus != "break" && currentStatus != "game over"){
		this.setupPlayerCarMove();
	    }
	},

	setupPlayerCarMove : function(){
	    var turn = this.get("currentTurn");
	    var car = this.get("playerCars")[turn[0]][turn[1]]
	    if(this.get("roundsCompleted") > 0){
	        car.increaseSpeed();
	    }
	    var potentialMoves = this.get("track").getReachableNodes(
	                                                         car.get("position"),
								 car.get("direction"),
								 car.get("speed") 
								    );
            this.set("potentialMoves",potentialMoves);
	    for each(var move in potentialMoves){
	       move.node.changeHighlight(true);
	    }
	    car.changeHighlight(true);
	    this.set("status","waiting for player car move");

	    if(turn[1] == 0){
	        this.startTimer();
	    }
	},

	checkIfMoveIsValid : function(node){
	    var turn = this.get("currentTurn");
	    var car = this.get("playerCars")[turn[0]][turn[1]]
	    var potentialMoves = this.get("potentialMoves");
	    var goodMove = false;
	    for each(var move in potentialMoves){
	        if(move.node == node){
 		    goodMove = true;
		    this.set("selectedMove", move);
 		    break;
	        }
	    }
	    if(!goodMove){
	        return;
            }
	    
	    for each(var move in potentialMoves){
	        if(move.node != node){
	            move.node.changeHighlight(false);
		}
	    }
	    this.set("status", "waiting for confirmation of car move");
	},

	handlePlayerCarMove : function(node){
	    var turn = this.get("currentTurn");
	    var car = this.get("playerCars")[turn[0]][turn[1]]
	    var move = this.get("selectedMove");
	    if(move.node == node){
                car.moveTo(move.node, move.direction, move.speed, move.passedCheckpoints);
		if(move.passedCheckpoints.length > 0){
		    this.recalculateScore(turn[0],turn[1]);
		}

		node.changeHighlight(false);
		car.changeHighlight(false);

		if(turn[1] == this.get("carsPerTeam")-1){
		    this.stopTimer();
		}
		this.advanceTurn();
		this.setupNextTurn();
            } else {
		for each(var potentialMove in this.get("potentialMoves")){
		   potentialMove.node.changeHighlight(true);
		}
		this.set("status", "waiting for player car move");
	    }
        },

	advanceTurn : function(){
	    var turn = this.get("currentTurn");
	    if(turn[1] < this.get("carsPerTeam")-1){
	        turn[1] += 1;
		this.set("currentTurn",turn);
	    } else if(turn[0] < this.get("numberOfTeams")-1){ 
	        turn[0] += 1;
		turn[1] = 0;
		this.set("currentTurn",turn);
	    } else {
	        this.set("currentTurn",[0,0]);
		this.completedARound();
	    }
	},

	completedARound : function(){
	    var rounds = this.get("roundsCompleted")+1;
	    if( rounds == this.get("totalRounds")){
	        this.set("status","game over");
		return;
	    } else if(rounds % this.get("roundsBetweenBreaks") == 0){
	        this.set("status","break");
	    }
	    this.set("roundsCompleted", rounds);
	    this.get("track").advanceNonPlayerCars();
	},

	playerClickedOnNode : function(node){
	    if(this.get("status") == "waiting for player car move"){
	        this.checkIfMoveIsValid(node);
	    } else if(this.get("status") == "waiting for confirmation of car move"){
	        this.handlePlayerCarMove(node);
	    }
	},

	recalculateScore : function(team, car){
	    var passedCheckpoints = this.get("playerCars")[team][car].get("passedCheckpoints");
	    var checkpointOrder = this.get("checkpointOrder");
	    var pointsPerCheckpoint = this.get("pointsPerCheckpoint");
	    var score = 0;
	    var atCheckpoint = 0;
	    for(var i = 0; i < passedCheckpoints.length; i++){
	        if(passedCheckpoints[i] == checkpointOrder[atCheckpoint]){
		    score += pointsPerCheckpoint;
		    atCheckpoint += 1;
		    atCheckpoint %= checkpointOrder.length;
		}
	    }
	    var scores = this.get("scores");
	    scores[team][car] = score;
	    this.set("scores",scores);
	},

	giveSpeedUpgradeTo : function(team,car){
	    this.get("playerCars")[team][car].upgradeSpeed();
	},

	giveAccelerationUpgradeTo : function(team,car){
	    this.get("playerCars")[team][car].upgradeAcceleration();
	},

	pause : function(){
	    var currentStatus = this.get("status");
	    if(currentStatus == "paused"){
	        return;
	    }
	    this.set("prePausedStatus",currentStatus);
	    this.set("status","paused");
	},

	resume : function(){
	    if(this.get("status") == "paused"){
	        this.set("status",this.get("prePausedStatus"));
	    }
	},

	addNPC : function(node){
	    this.get("track").addNonPlayerCar(node,0);
	},

	timeOut : function(){
	    var status = this.get("status");
	    var turn = this.get("currentTurn");
	    var cars = this.get("playerCars");
	    var car = cars[turn[0]][turn[1]]
	    if(status == "waiting for player car move"){
	        var potentialMoves = this.get("potentialMoves");
		for each(var move in potentialMoves){
		    move.node.changeHighlight(false);
		}
		car.changeHighlight(false);
	        while(turn[1] != this.get("carsPerTeam") -1){
		    cars[turn[0]][turn[1]].decreaseSpeedTo(0);
		    this.advanceTurn();
		    turn = this.get("currentTurn");
		}
		cars[turn[0]][turn[1]].decreaseSpeedTo(0);
		this.advanceTurn();
		this.setupNextTurn();
	    } else if( status == "waiting for confirmation of car move"){
		var move = this.get("selectedMove");
		move.node.changeHighlight(false);
		car.changeHighlight(false);
	        while(turn[1] != this.get("carsPerTeam") -1){
		    cars[turn[0]][turn[1]].decreaseSpeedTo(0);
		    this.advanceTurn();
		    turn = this.get("currentTurn");
		}
		cars[turn[0]][turn[1]].decreaseSpeedTo(0);
		this.advanceTurn();
		this.setupNextTurn();
	    }
	},

	startTimer : function(){
	    this.get("timer").start(this.get("secondsPerMove"),this.timeOut.bind(this));
	},

	stopTimer : function(){
	    this.get("timer").stop();
	},

	resumeTimer : function(){
	    this.get("timer").resume();
	},

	startBreakTimer : function(){
	    this.get("breakTimer").start(
	             (this.get("secondsPerMove")*this.get("numberOfTeams")*this.get("roundsBetweenBreaks")) +
		     this.get("breakLength"), this.breakEnd.bind(this));
	},

	breakEnd : function(){
	    if(this.get("status") == "game over"){
	        return;
	    }
	    this.set("status","ready to resume");
            this.startBreakTimer();
	    this.setupNextTurn();
	}

    });

    var ScoreView = Backbone.View.extend({
        initialize : function(){
            this.scoreBoxes = this.createView();
            this.model.bind("change", function(){
                this.render();
            }, this);
        },

        createView : function(){
            var x = this.options.x;
            var y = this.options.y;
            var height = this.options.height;
            var nrTeams = this.model.get("numberOfTeams");
            var boxSize = (height-30-5*(nrTeams-1))/nrTeams;
            this.scoreText = this.paper().text(x+40,y+10,"Score:");
            this.scoreText.transform("S3");
            
            var colorBoxes = [];
            var scoreBoxes = [];
	    var turnArrows = [];
            for(var i = 0; i < nrTeams; i++){
                var colorBox = this.paper().rect(x,y+30+i*(boxSize+5),boxSize,boxSize);
                colorBox.attr("stroke","black");
		var color = this.model.get("playerCars")[i][0].get("color");
                colorBox.attr("fill",color);
                colorBoxes.push(colorBox);

                var scoreBox = this.paper().text(x+boxSize/2,
                                                 y+30+i*(boxSize+5)+boxSize/2,
                                                  "0");
                scoreBox.transform("S3");
                scoreBoxes.push(scoreBox);

                var arrow = this.paper().path("M"+(x+boxSize+50)+","+(y+40+i*(boxSize+5))+"v20h-20v10l-20,-20 20,-20v10h20");
		arrow.attr("fill",color);
		arrow.hide();
		turnArrows.push(arrow);
            }
	    this.turnArrows = turnArrows;
            return scoreBoxes;
        },


        render : function(){
            var nrCars = this.model.get("carsPerTeam");
            var scores = this.model.get("scores");
            for(var i = 0; i < scores.length; i++){
               var teamscore = 0;
               for(var j = 0; j < nrCars; j++){
                   teamscore += scores[i][j];
               }
               this.scoreBoxes[i].attr("text",""+teamscore);
            }
	    var turn = this.model.get("currentTurn")[0];
	    this.turnArrows[turn].show();
	    this.turnArrows[(turn+3)%4].hide();
        },

        paper : function(){
            return this.options.paper;
        }
    });

    var RoundView = Backbone.View.extend({
        initialize : function(){
            this.text = this.createView();
            this.model.bind("change:roundsCompleted", function(){
                this.render();
            }, this);
        },

        createView : function(){
            var round = this.model.get("roundsCompleted");
            var text = this.paper().text(this.options.x, this.options.y, "Ronde: "+(round+1));
            text.transform("S3");
            return text;
        },

        render : function(){
            var round = this.model.get("roundsCompleted");
            this.text.attr("text", "Ronde: "+(round+1));
            return this;
        },

        paper : function(){
            return this.options.paper;
        }
    });

    var GoalView = Backbone.View.extend({
        initialize : function(){
	    this.createView();
	    this.model.bind("change", function(){
	        this.render();
	    }, this);
	},
	
	createView : function(){
	    this.options.pointer1.hide();
	    this.options.pointer2.hide();
	    this.render();
	},

	render : function(){
	    var turn = this.model.get("currentTurn");
	    var score = this.model.get("scores")[turn[0]][turn[1]] % this.options.modulus;
	    if(score < this.options.intervalStart || score > this.options.intervalEnd){
	        this.options.pointer1.show();
		this.options.pointer2.hide();
	    } else {
	        this.options.pointer1.hide();
		this.options.pointer2.show();
	    }
	},

	paper : function(){
	    return this.options.paper;
	}
    });

    var BreakView = Backbone.View.extend({
        initialize : function(){
	    this.createView();
	    this.model.bind("change", function(){
	        this.render();
	    }, this);
	    this.timer = this.model.get("breakTimer");
	    this.timer.bind("change", function(){
	        this.render();
	    }, this);
	},

	createView : function(){
	    this.rect = this.paper().rect( this.options.x, 
	                                   this.options.y, 
					   this.options.width, 
					   this.options.height,10);
	    this.rect.attr("stroke","black");
	    this.rect.attr("fill","red");

	    this.text = this.paper().text(this.options.x+this.options.width/2, 
	                                  this.options.y+this.options.height/2, "Start");
	    this.text.transform("S3");
	    this.rect.hide();
	    this.text.hide();
	},

	render : function(){
	    var currentStatus = this.model.get("status");
	    if(currentStatus == "game over"){
	        this.text.attr("text","Einde");
		this.rect.show();
		this.rect.toFront();
		this.text.show();
		this.text.toFront();
	    } else if(currentStatus == "break"){
	        this.text.attr("text",this.remainingTime());
		this.rect.show();
		this.rect.toFront();
		this.text.show();
		this.text.toFront();
	    } else {
	        this.rect.hide();
		this.text.hide();
	    }
	},

	remainingTime : function(){
	    var time = this.timer.get("duration")-this.timer.get("secondsElapsed");
	    var minutes = Math.floor(time/60);
	    var seconds = time % 60;
	    if(seconds < 10){
   	        return "Pauze\n "+minutes+":0"+seconds;
	    } else {
	        return "Pauze\n "+minutes+":"+seconds;
	    }
	},

	paper : function(){
	    return this.options.paper;
	}
    });



    SumOfUs.Game = Game;
    SumOfUs.ScoreView = ScoreView;
    SumOfUs.RoundView = RoundView;
    SumOfUs.GoalView = GoalView;
    SumOfUs.BreakView = BreakView;


})(_, Backbone, SumOfUs);
