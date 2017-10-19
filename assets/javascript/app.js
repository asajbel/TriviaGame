// ID of the Google Spreadsheet
var spreadsheetID = "1RznpZAVO9Kb2dYlsFCWE4gPrUJkfkKMvMqytoqHAM_s";
var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
var questions = [];
var index = 0;

var timer = {
	time: 30,
	running: false,
	intervalId: 0,

	reset: function(timeSet = 30, location="timer") {
		timer.time = timeSet;
		timer.stop();
		$("#" + location).text(timer.time); 
	},

	start: function(timeSet = 30, location = "timer") {
		if (!timer.running) {
			timer.time = timeSet;
			timer.intervalId = setInterval(timer.count, 1000, location);
			timer.running = true;
		}
	},

	stop: function() {
		clearInterval(timer.intervalId);
		timer.running = false;
	},

	count: function(loc) {
		timer.time--;
		$("#" + loc).text(timer.time);
		if (timer.time == 0) {
			endQuestion("time");
		}
	}
}

function endQuestion(end) {
	console.log(end);
	timer.stop();
	$(".question").hide();
	$(".answer").show();
	switch(end) {
		case "win":
			$("#correct").text("Correct!");
			$("#tell-answer").hide();
			break;
		case "lose":
			$("#correct").text("Wrong!");
			$("#tell-answer").show();
			break;
		case "time":
			$("#correct").text("Time Over!");
			$("#tell-answer").show();
			break;
		default:
	}
}

function writeQuestion(q) {
	$("#question").text(q.gsx$question.$t);

	$("#answer1").text(q.gsx$answer1.$t);
	$("#answer2").text(q.gsx$answer2.$t);
	$("#answer3").text(q.gsx$answer3.$t);
	$("#answer4").text(q.gsx$answer4.$t);

	var correctAnswer = "";
	switch (q.gsx$correct.$t) {
		case "1":
			correctAnswer = q.gsx$answer1.$t;
			break;
		case "2":
			correctAnswer = q.gsx$answer2.$t;
			break;
		case "3":
			correctAnswer = q.gsx$answer3.$t;
			break;
		case "4":
			correctAnswer = q.gsx$answer4.$t;
			break;
		default:
	}
	$("#correct-answer").text(correctAnswer);
	
	var imagePath = "assets/images/";
	$("#answer-img").attr("src", imagePath + q.gsx$image.$t);
	
	$("#answer-img").attr("alt", q.gsx$imagetext.$t);
	
	$("#altText").text(q.gsx$imagetext.$t);

}

$(document).ready(function() {
	var correctNumber = 0;
	var questionsReady = false;

	$.getJSON(url, function(data) {
		questions = data.feed.entry;
		console.log(questions);
		questionsReady = true;
	});

	$(".question").hide();
	$(".answer").hide();
	$(".end").hide();


	$("#start").on("click", function(event){
		if (questionsReady) {
			event.preventDefault();
			index = 0; 
			correctNumber = 0;
			writeQuestion(questions[index]);
			$(".start").hide();
			$(".question").show();
			timer.start();
		}
	});

	$("#continue").on("click", function(event){
		event.preventDefault();
		$(".answer").hide();
		index++;
		if (index < questions.length) {
			timer.reset();
			timer.start();
			$(".question").show();
			writeQuestion(questions[index]);
		} else {
			$("#correctNum").text(correctNumber);
			$("#incorrectNum").text(questions.length - correctNumber);
			$(".end").show();
		}
	});

	$("#restart").on("click", function(event) {
		event.preventDefault();
		$(".end").hide();
		$(".start").show();
	})

	$(".answer-btn").on("click", function(event){
		event.preventDefault();
		if(questions[index].gsx$correct.$t == $(this).attr("value")) {
			endQuestion("win");
			correctNumber++;
		} else {
			endQuestion("lose");
		}
	});

});