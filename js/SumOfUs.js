(function($, Raphael, SumOfUs, undefined){
    var requestAnimFrame = (function(){
	    return  window.requestAnimationFrame   ||
		    window.webkitRequestAnimationFrame ||
		    window.mozRequestAnimationFrame    ||
		    window.oRequestAnimationFrame      ||
		    window.msRequestAnimationFrame     ||
		    function( callback ){
			    window.setTimeout(callback, 1000 / 60);
		    };
    })();

    $(function(){
        var paper = Raphael("viewport", 1230, 770);
        paper.rect(0, 0, 1300, 830).attr({ fill : "#ffffff" });

	var demoTrack = new SumOfUs.Track({npcMaxSpeed : 4,npcDelayChance: 0.12});

	var roads = [];
	var crossings = [];
	roads.push(demoTrack.addSegment("road", {width : 4, length : 12, checkpoint : "A", npcTraffic : "twoway"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 3, checkpoint :"B"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 3, checkpoint :"B"}));
	for(var i = 0; i < 6; i++){
	    roads.push(demoTrack.addSegment("road", {width : 4, 
                                                     length : (i==0 | i==5)?3 : 5, 
                                                     npcTraffic : "twoway", 
                                                     checkpoint :"C"}));
	}
	for(var i = 0; i < 3; i++){
	    roads.push(demoTrack.addSegment("road", {width : 2, length : 3, checkpoint : "D"}));
	}
	for(var i = 0; i < 6; i++){
	    roads.push(demoTrack.addSegment("road", {width : 4, 
                                                     length : (i==0||i==5)?3:5, 
                                                     npcTraffic : "twoway",
                                                     checkpoint : "E"}));
	}
	roads.push(demoTrack.addSegment("road", {width : 4, length : 3, checkpoint : "F"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 3, checkpoint : "F"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 12, checkpoint : "G", npcTraffic : "twoway"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 5, npcTraffic : "twoway"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 5, npcTraffic : "twoway"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 5, npcTraffic : "twoway"}));
	roads.push(demoTrack.addSegment("road", {width : 4, length : 5, npcTraffic : "twoway"}));

	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 2, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 2, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 2, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 2, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 2, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 2, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));
	crossings.push(demoTrack.addSegment("crossing", {width : 4, height : 4, npcTraffic : "twoway"}));

	var roadCrossingConnections = [ { road : 0, rend : "one", crossing : 0, cend : "east" },
	                                { road : 0, rend : "two", crossing : 1, cend : "west" },
	                                { road : 1, rend : "one", crossing : 0, cend : "south" },
	                                { road : 1, rend : "two", crossing : 3, cend : "north" },
	                                { road : 2, rend : "one", crossing : 1, cend : "south" },
	                                { road : 2, rend : "two", crossing : 5, cend : "north" },
	                                { road : 3, rend : "two", crossing : 2, cend : "west" },
	                                { road : 4, rend : "one", crossing : 2, cend : "east" },
	                                { road : 4, rend : "two", crossing : 3, cend : "west" },
	                                { road : 5, rend : "one", crossing : 3, cend : "east" },
	                                { road : 5, rend : "two", crossing : 4, cend : "west" },
	                                { road : 6, rend : "one", crossing : 4, cend : "east" },
	                                { road : 6, rend : "two", crossing : 5, cend : "west" },
	                                { road : 7, rend : "one", crossing : 5, cend : "east" },
	                                { road : 7, rend : "two", crossing : 6, cend : "west" },
	                                { road : 8, rend : "one", crossing : 6, cend : "east" },
	                                { road : 9, rend : "one", crossing : 2, cend : "south" },
	                                { road : 9, rend : "two", crossing : 7, cend : "north" },
	                                { road : 10, rend : "one", crossing : 4, cend : "south" },
	                                { road : 10, rend : "two", crossing : 9, cend : "north" },
	                                { road : 11, rend : "one", crossing : 6, cend : "south" },
	                                { road : 11, rend : "two", crossing : 11, cend : "north" },
	                                { road : 12, rend : "two", crossing : 7, cend : "west" },
	                                { road : 13, rend : "one", crossing : 7, cend : "east" },
	                                { road : 13, rend : "two", crossing : 8, cend : "west" },
	                                { road : 14, rend : "one", crossing : 8, cend : "east" },
	                                { road : 14, rend : "two", crossing : 9, cend : "west" },
	                                { road : 15, rend : "one", crossing : 9, cend : "east" },
	                                { road : 15, rend : "two", crossing : 10, cend : "west" },
	                                { road : 16, rend : "one", crossing : 10, cend : "east" },
	                                { road : 16, rend : "two", crossing : 11, cend : "west" },
	                                { road : 17, rend : "one", crossing : 11, cend : "east" },
	                                { road : 18, rend : "one", crossing : 8, cend : "south" },
	                                { road : 18, rend : "two", crossing : 12, cend : "north" },
	                                { road : 19, rend : "one", crossing : 10, cend : "south" },
	                                { road : 19, rend : "two", crossing : 13, cend : "north" },
	                                { road : 20, rend : "one", crossing : 12, cend : "east" },
	                                { road : 20, rend : "two", crossing : 13, cend : "west" },
                                        { road : 21, rend : "two", crossing : 0, cend : "west"},
                                        { road : 22, rend : "one", crossing : 1, cend : "east"},
                                        { road : 23, rend : "two", crossing : 12, cend : "west"},
                                        { road : 24, rend : "one", crossing : 13, cend : "east"}];
	for each(var con in roadCrossingConnections){
	    demoTrack.connectSegments(roads[con.road].get("endPoints")[con.rend],
	                              crossings[con.crossing].get("endPoints")[con.cend]);
	}
	demoTrack.connectSegments(roads[3].get("endPoints").one,roads[8].get("endPoints").two);
	demoTrack.connectSegments(roads[12].get("endPoints").one,roads[17].get("endPoints").two);
        demoTrack.connectSegments(roads[21].get("endPoints").one,roads[22].get("endPoints").two);
        demoTrack.connectSegments(roads[23].get("endPoints").one,roads[24].get("endPoints").two);

	demoTrack.addNonPlayerCar(roads[3].get("nodes")[0][0]);
	demoTrack.addNonPlayerCar(roads[3].get("nodes")[2][1]);
	demoTrack.addNonPlayerCar(roads[3].get("nodes")[1][3]);
	demoTrack.addNonPlayerCar(crossings[2].get("nodes")[1][0]);
	demoTrack.addNonPlayerCar(crossings[2].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(roads[4].get("nodes")[1][1]);
	demoTrack.addNonPlayerCar(roads[4].get("nodes")[0][3]);
	demoTrack.addNonPlayerCar(roads[4].get("nodes")[4][3]);
	demoTrack.addNonPlayerCar(crossings[3].get("nodes")[1][0]);
	demoTrack.addNonPlayerCar(crossings[3].get("nodes")[3][0]);
	demoTrack.addNonPlayerCar(roads[5].get("nodes")[1][1]);
	demoTrack.addNonPlayerCar(roads[5].get("nodes")[2][2]);
	demoTrack.addNonPlayerCar(roads[5].get("nodes")[0][3]);
	demoTrack.addNonPlayerCar(crossings[4].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(crossings[4].get("nodes")[0][1]);
	demoTrack.addNonPlayerCar(roads[6].get("nodes")[2][1]);
	demoTrack.addNonPlayerCar(roads[6].get("nodes")[1][0]);
	demoTrack.addNonPlayerCar(roads[6].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(roads[6].get("nodes")[1][3]);
	demoTrack.addNonPlayerCar(crossings[5].get("nodes")[0][3]);
	demoTrack.addNonPlayerCar(crossings[5].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(crossings[5].get("nodes")[2][2]);
	demoTrack.addNonPlayerCar(crossings[5].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(roads[7].get("nodes")[4][1]);
	demoTrack.addNonPlayerCar(roads[7].get("nodes")[4][2]);
	demoTrack.addNonPlayerCar(crossings[6].get("nodes")[1][1]);
	demoTrack.addNonPlayerCar(crossings[6].get("nodes")[0][0]);
	demoTrack.addNonPlayerCar(crossings[6].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(roads[8].get("nodes")[1][1]);
	demoTrack.addNonPlayerCar(roads[8].get("nodes")[2][0]);

	demoTrack.addNonPlayerCar(roads[12].get("nodes")[2][0]);
	demoTrack.addNonPlayerCar(roads[12].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(roads[12].get("nodes")[2][3]);
	demoTrack.addNonPlayerCar(crossings[7].get("nodes")[2][0]);
	demoTrack.addNonPlayerCar(roads[13].get("nodes")[0][0]);
	demoTrack.addNonPlayerCar(roads[13].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(roads[13].get("nodes")[2][1]);
	demoTrack.addNonPlayerCar(roads[13].get("nodes")[2][3]);
	demoTrack.addNonPlayerCar(crossings[8].get("nodes")[0][0]);
	demoTrack.addNonPlayerCar(crossings[8].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(crossings[8].get("nodes")[2][3]);
	demoTrack.addNonPlayerCar(crossings[8].get("nodes")[3][0]);
	demoTrack.addNonPlayerCar(roads[14].get("nodes")[1][0]);
	demoTrack.addNonPlayerCar(roads[14].get("nodes")[2][1]);
	demoTrack.addNonPlayerCar(roads[14].get("nodes")[2][2]);
	demoTrack.addNonPlayerCar(roads[14].get("nodes")[2][3]);
	demoTrack.addNonPlayerCar(crossings[9].get("nodes")[1][0]);
	demoTrack.addNonPlayerCar(crossings[9].get("nodes")[2][1]);
	demoTrack.addNonPlayerCar(roads[15].get("nodes")[0][3]);
	demoTrack.addNonPlayerCar(roads[15].get("nodes")[2][2]);
	demoTrack.addNonPlayerCar(roads[15].get("nodes")[0][0]);
	demoTrack.addNonPlayerCar(crossings[10].get("nodes")[0][1]);
	demoTrack.addNonPlayerCar(crossings[10].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(crossings[10].get("nodes")[2][0]);
	demoTrack.addNonPlayerCar(crossings[10].get("nodes")[3][2]);
	demoTrack.addNonPlayerCar(roads[16].get("nodes")[1][0]);
	demoTrack.addNonPlayerCar(roads[16].get("nodes")[2][1]);
	demoTrack.addNonPlayerCar(roads[16].get("nodes")[1][3]);
	demoTrack.addNonPlayerCar(crossings[11].get("nodes")[0][0]);
	demoTrack.addNonPlayerCar(crossings[11].get("nodes")[1][0]);
	demoTrack.addNonPlayerCar(crossings[11].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(roads[17].get("nodes")[1][1]);
	demoTrack.addNonPlayerCar(roads[17].get("nodes")[2][2]);

	demoTrack.addNonPlayerCar(roads[21].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(roads[21].get("nodes")[0][2]);
	demoTrack.addNonPlayerCar(roads[21].get("nodes")[2][3]);
	demoTrack.addNonPlayerCar(crossings[0].get("nodes")[3][0]);
	demoTrack.addNonPlayerCar(crossings[0].get("nodes")[2][1]);
	demoTrack.addNonPlayerCar(crossings[0].get("nodes")[1][3]);
	demoTrack.addNonPlayerCar(roads[0].get("nodes")[0][0]);
	demoTrack.addNonPlayerCar(roads[0].get("nodes")[7][0]);
	demoTrack.addNonPlayerCar(roads[0].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(roads[0].get("nodes")[5][2]);
	demoTrack.addNonPlayerCar(roads[0].get("nodes")[11][2]);
	demoTrack.addNonPlayerCar(roads[0].get("nodes")[3][3]);
	demoTrack.addNonPlayerCar(roads[0].get("nodes")[10][3]);
	demoTrack.addNonPlayerCar(crossings[1].get("nodes")[3][0]);
	demoTrack.addNonPlayerCar(crossings[1].get("nodes")[2][2]);
	demoTrack.addNonPlayerCar(crossings[1].get("nodes")[0][2]);
	demoTrack.addNonPlayerCar(roads[22].get("nodes")[2][0]);
	demoTrack.addNonPlayerCar(roads[22].get("nodes")[3][2]);

	demoTrack.addNonPlayerCar(roads[23].get("nodes")[0][1]);
	demoTrack.addNonPlayerCar(roads[23].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(roads[23].get("nodes")[4][3]);
	demoTrack.addNonPlayerCar(crossings[12].get("nodes")[3][1]);
	demoTrack.addNonPlayerCar(crossings[12].get("nodes")[2][0]);
	demoTrack.addNonPlayerCar(crossings[12].get("nodes")[1][2]);
	demoTrack.addNonPlayerCar(crossings[12].get("nodes")[0][3]);
	demoTrack.addNonPlayerCar(roads[20].get("nodes")[7][0]);
	demoTrack.addNonPlayerCar(roads[20].get("nodes")[4][1]);
	demoTrack.addNonPlayerCar(roads[20].get("nodes")[9][2]);
	demoTrack.addNonPlayerCar(roads[20].get("nodes")[6][3]);
	demoTrack.addNonPlayerCar(crossings[13].get("nodes")[3][2]);
	demoTrack.addNonPlayerCar(crossings[13].get("nodes")[2][0]);
	demoTrack.addNonPlayerCar(crossings[13].get("nodes")[1][1]);
	demoTrack.addNonPlayerCar(crossings[13].get("nodes")[0][1]);
	demoTrack.addNonPlayerCar(roads[24].get("nodes")[2][0]);
	demoTrack.addNonPlayerCar(roads[24].get("nodes")[1][1]);
	demoTrack.addNonPlayerCar(roads[24].get("nodes")[1][2]);

	var demoGame = new SumOfUs.Game({
		track : demoTrack, 
		numberOfTeams : 4, 
		carsPerTeam : 2,
		secondsPerMove : 30,
		breakLength : 180,
                pointsPerCheckpoint : 1,
		roundsBetweenBreaks : 5,
                checkpointOrder:["C","D","E","F","G","F","E","D","C","B","A","B"]

	});


	var cars = demoGame.get("playerCars");

	/* Assign colors to cars */
	for (var i = 0; i < cars[0].length; i++)
		cars[0][i].set("color", "red");
	for (var i = 0; i < cars[1].length; i++)
		cars[1][i].set("color", "yellow");
	for (var i = 0; i < cars[2].length; i++)
		cars[2][i].set("color", "#65c3ff");
	for (var i = 0; i < cars[3].length; i++)
		cars[3][i].set("color", "#53ff5b");
        
	demoGame.assignLocationToPlayerCar(0,0,roads[1].get("nodes")[0][0],"one->two");
	demoGame.assignLocationToPlayerCar(0,1,roads[2].get("nodes")[0][1],"one->two");
	demoGame.assignLocationToPlayerCar(1,0,roads[1].get("nodes")[0][1],"one->two");
	demoGame.assignLocationToPlayerCar(1,1,roads[2].get("nodes")[0][0],"one->two");
	demoGame.assignLocationToPlayerCar(2,0,roads[1].get("nodes")[0][2],"one->two");
	demoGame.assignLocationToPlayerCar(2,1,roads[2].get("nodes")[0][3],"one->two");
	demoGame.assignLocationToPlayerCar(3,0,roads[1].get("nodes")[0][3],"one->two");
	demoGame.assignLocationToPlayerCar(3,1,roads[2].get("nodes")[0][2],"one->two");


        var crossingLocations = [ {begin : {x : 310, y : 10}, end : {x : 430, y : 130}},
                                  {begin : {x : 790, y : 10}, end : {x : 910, y : 130}},
                                  {begin : {x : 100, y : 220}, end : {x : 160, y : 340}},
                                  {begin : {x : 310, y : 220}, end : {x : 430, y : 340}},
                                  {begin : {x : 580, y : 220}, end : {x : 640, y : 340}},
                                  {begin : {x : 790, y : 220}, end : {x : 910, y : 340}},
                                  {begin : {x : 1060, y : 220}, end : {x : 1120, y : 340}},
                                  {begin : {x : 100, y : 430}, end : {x : 160, y : 550}},
                                  {begin : {x : 310, y : 430}, end : {x : 430, y : 550}},
                                  {begin : {x : 580, y : 430}, end : {x : 640, y : 550}},
                                  {begin : {x : 790, y : 430}, end : {x : 910, y : 550}},
                                  {begin : {x : 1060, y : 430}, end : {x : 1120, y : 550}},
                                  {begin : {x : 310, y : 640}, end : {x : 430, y : 760}},
                                  {begin : {x : 790, y : 640}, end : {x : 910, y : 760}}];

        for(var i = 0; i < crossings.length; i++){
            new SumOfUs.CrossingView({
	         model : crossings[i],
	 	 callback : demoGame.playerClickedOnNode.bind(demoGame),
	         paper : paper,
	  	 beginPoint : crossingLocations[i].begin,
		 endPoint : crossingLocations[i].end
	    });
        }

        var roadLocations = [ {begin : {x : 430, y : 10}, end : {x : 790, y : 130}, dir : "right"},
                              {begin : {x : 430, y : 130}, end : {x : 310, y : 220}, dir : "down"},
                              {begin : {x : 910, y : 130}, end : {x : 790, y : 220}, dir : "down"},
                              {begin : {x : 10, y : 220}, end : {x : 100, y : 340}, dir : "right"},
                              {begin : {x : 160, y : 220}, end : {x : 310, y : 340}, dir : "right"},
                              {begin : {x : 430, y : 220}, end : {x : 580, y : 340}, dir : "right"},
                              {begin : {x : 640, y : 220}, end : {x : 790, y : 340}, dir : "right"},
                              {begin : {x : 910, y : 220}, end : {x : 1060, y : 340}, dir : "right"},
                              {begin : {x : 1120, y : 220}, end : {x : 1210, y : 340}, dir : "right"},
                              {begin : {x : 160, y : 340}, end : {x : 100, y : 430}, dir : "down"},
                              {begin : {x : 640, y : 340}, end : {x : 580, y : 430}, dir : "down"},
                              {begin : {x : 1120, y : 340}, end : {x : 1060, y : 430}, dir : "down"},
                              {begin : {x : 10, y : 430}, end : {x : 100, y : 550}, dir : "right"},
                              {begin : {x : 160, y : 430}, end : {x : 310, y : 550}, dir : "right"},
                              {begin : {x : 430, y : 430}, end : {x : 580, y : 550}, dir : "right"},
                              {begin : {x : 640, y : 430}, end : {x : 790, y : 550}, dir : "right"},
                              {begin : {x : 910, y : 430}, end : {x : 1060, y : 550}, dir : "right"},
                              {begin : {x : 1120, y : 430}, end : {x : 1210, y : 550}, dir : "right"},
                              {begin : {x : 430, y : 550}, end : {x : 310, y : 640}, dir : "down"},
                              {begin : {x : 910, y : 550}, end : {x : 790, y : 640}, dir : "down"},
                              {begin : {x : 430, y : 640}, end : {x : 790, y : 760}, dir : "right"},
                              {begin : {x : 160, y : 10}, end : {x : 310, y : 130}, dir : "right"},
                              {begin : {x : 910, y : 10}, end : {x : 1060, y : 130}, dir : "right"},
                              {begin : {x : 160, y : 640}, end : {x : 310, y : 760}, dir : "right"},
                              {begin : {x : 910, y : 640}, end : {x : 1060, y : 760}, dir : "right"}]
 
        for(var i = 0; i < roads.length; i++){
            new SumOfUs.RoadView({
 	        model : roads[i],
		callback : demoGame.playerClickedOnNode.bind(demoGame),
		paper : paper,
		direction : roadLocations[i].dir,
		beginPoint : roadLocations[i].begin,
		endPoint : roadLocations[i].end
	    });
        }

	var randomPositions = [
		{x : 190 + parseInt(Math.random() * 25), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 250 + parseInt(Math.random() * 25), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 480 + parseInt(Math.random() * 25), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 550 + parseInt(Math.random() * 25), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 670 + parseInt(Math.random() * 25), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 740 + parseInt(Math.random() * 25), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 940 + parseInt(Math.random() * 25), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 1000 + parseInt(Math.random() * 55), 
		 y : 160 + parseInt(Math.random() * 25)},
		{x : 40 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 190 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 260 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 330 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 400 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 460 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 520 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 740 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 810 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 880 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 940 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 1000 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 1160 + parseInt(Math.random() * 25), 
		 y : 370 + parseInt(Math.random() * 25)},
		{x : 190 + parseInt(Math.random() * 25), 
		 y : 580 + parseInt(Math.random() * 25)},
		{x : 250 + parseInt(Math.random() * 25), 
		 y : 580 + parseInt(Math.random() * 25)},
		{x : 480 + parseInt(Math.random() * 25), 
		 y : 580 + parseInt(Math.random() * 25)},
		{x : 550 + parseInt(Math.random() * 25), 
		 y : 580 + parseInt(Math.random() * 25)},
		{x : 670 + parseInt(Math.random() * 25), 
		 y : 580 + parseInt(Math.random() * 25)},
		{x : 740 + parseInt(Math.random() * 25), 
		 y : 580 + parseInt(Math.random() * 25)},
		{x : 940 + parseInt(Math.random() * 25), 
		 y : 580 + parseInt(Math.random() * 25)},
		{x : 1000 + parseInt(Math.random() * 55), 
		 y : 580 + parseInt(Math.random() * 25)},
	];

	for (var i = 0; i < randomPositions.length; i++)
		new SumOfUs.TreeView({
			paper : paper,
			position : randomPositions[i],
			color : "lightgreen",
			ratio : 30,
		});

        for(var team = 0; team < 4; team++){
	    for(var car = 0; car < 2; car++){
	        new SumOfUs.CarView({ model : cars[team][car],
		                      paper : paper,
				      carWidth : 30,
				      carHeight : 17 });
	    }
	}

	var npcCars = demoTrack.get("nonPlayerCars");
	for each(var car in npcCars){
	    new SumOfUs.CarView({ model : car,
	                         paper : paper,
				 carWidth : 30,
				 carHeight : 17 });
	}


	var timerView = new SumOfUs.TimerView({
			     model: demoGame.get("timer"),
			     paper : paper, 
			     x : 1080, 
			     y : 20,
			     height : 15,
			     width : 100 });

        var roundView = new SumOfUs.RoundView({ model : demoGame,
                                                paper : paper,
                                                x : 1140,
                                                y : 70});
 
        var scoreView = new SumOfUs.ScoreView({ model : demoGame,
                                                paper : paper,
                                                x : 10,
                                                y : 10,
                                                height : 200});

        var lowerPointer = paper.path("M600,580h20,v30,h10,l-20,20 -20,-20h10v-20z");
        lowerPointer.attr({fill : "blue"});
        var upperPointer = paper.path("M600,190h20,v-30,h10,l-20,-20 -20,20h10v20z");
        upperPointer.attr({fill : "blue"});

	var goalView = new SumOfUs.GoalView({ model : demoGame,
	                                      paper : paper,
					      pointer1 : lowerPointer,
					      pointer2 : upperPointer,
					      modulus : 12,
					      intervalStart : 5,
					      intervalEnd : 10});
	
	var breakView = new SumOfUs.BreakView({ model : demoGame,
	                                        paper : paper,
						x : 515,
						y : 300,
						width : 200,
						height : 100});

	var upgradeView = new SumOfUs.UpgradeView({ model : demoGame,
	                                            paper : paper,
						    x : 1100,
						    y : 660,
						    height : 100});



	demoGame.start();
        window.game = demoGame;



	(function loop(){
		requestAnimFrame(loop);
	})();
    });
})(jQuery, Raphael, SumOfUs);
