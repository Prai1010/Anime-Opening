let animeData = {};
let userInput = {
  current: 0,
  currentRaw: "",
  points: 0
};

let timerInterval;
const TIME_LIMIT = 10;

function getData() {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      animeData.data = data;
      localStorage.setItem("data", JSON.stringify(animeData));
    });
}

function startTimer() {
  let timeLeft = TIME_LIMIT;
  $("#timer").text(`Time: ${timeLeft}`);

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    $("#timer").text(`Time: ${timeLeft}`);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endAudioPlayback();
    }
  }, 1000);
}

function endAudioPlayback() {
  const audioEl = document.querySelector("audio");
  audioEl.pause();
  audioEl.currentTime = 0;
  $("#playBtn").prop("disabled", true).text("Time Up");
}

function updateScore() {
  $("#score").text(`Score: ${userInput.points} / ${userInput.current}`);
}

function updateDom() {
  $("#currentQues").text(userInput.current + 1);
  $(".choiceBtn").each((ind, ele) => {
    $(ele)
      .text(animeData.data[userInput.current].choices[ind])
      .removeAttr("disabled");
  });

  $("audio").attr("src", "audio/" + animeData.data[userInput.current].file);
  $("#playBtn").prop("disabled", false).text("Play Audio");
  $("#message").text("");
  $("#nextBtn").hide();
  updateScore();
  $("#timer").text(`Time: ${TIME_LIMIT}`);
}

$(document).ready(() => {
  if (localStorage.getItem("data") === null) {
    getData();
    localStorage.setItem("user", JSON.stringify(userInput));
  } else {
    animeData = JSON.parse(localStorage.getItem("data"));
    userInput = JSON.parse(localStorage.getItem("user"));
  }

  updateDom();

  $("#startBtn").click(() => {
    $("#gameMenu").addClass("hidden");
    $("#gameArea").removeClass("hidden");
  });

  $("#playBtn").click(() => {
    const audioEl = document.querySelector("audio");
    if ($("#playBtn").text().includes("Play")) {
      audioEl.play();
      $("#playBtn").text("Stop Audio");
      startTimer();
    } else {
      audioEl.pause();
      $("#playBtn").text("Play Audio");
      clearInterval(timerInterval);
    }
  });

  $(".choiceBtn").click(function () {
    clearInterval(timerInterval);
    const selected = $(this).text();
    const correct = animeData.data[userInput.current].answer;

    if (selected === correct) {
      $("#message")
        .text("✅ Correct!")
        .removeClass("text-red-400")
        .addClass("text-green-400");
      userInput.points++;
    } else {
      $("#message")
        .text(`❌ Wrong! Correct answer: ${correct}`)
        .removeClass("text-green-400")
        .addClass("text-red-400");
    }

    $(".choiceBtn").attr("disabled", true);
    $("#nextBtn").show();
    updateScore();
    localStorage.setItem("user", JSON.stringify(userInput));
  });

  $("#nextBtn").click(() => {
    userInput.current++;

    if (userInput.current >= animeData.data.length) {
      $("#gameArea").html(`
        <h2 class="text-2xl font-bold text-red-500">Game Over</h2>
        <p class="text-lg mt-2">Final Score: ${userInput.points} / ${animeData.data.length}</p>
        <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white shadow">
          Restart Game
        </button>
      `);
      localStorage.removeItem("user");
      return;
    }

    updateDom();
  });
});
