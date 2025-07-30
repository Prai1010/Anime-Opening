let animeData = {};
let userInput = {
  current: 0,
  currentRaw: "",
  points: 0,
};

let timerInterval;
const TIME_LIMIT = 10;

// 🔀 Shuffle utility
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getData() {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      shuffleArray(data); // Shuffle questions
      animeData.data = data;
      updateDom(); // Only update DOM after data is loaded
    })
    .catch((err) => {
      $("#gameWrapper").html(
        `<p class="text-red-400">Failed to load data. Make sure <code>data.json</code> exists.</p>`
      );
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
  const question = animeData.data[userInput.current];

  // Reset audio
  const audioEl = document.querySelector("audio");
  audioEl.pause();
  audioEl.currentTime = 0;

  $("#currentQues").text("Question: "+(userInput.current + 1));
  $(".choiceBtn").each((ind, ele) => {
    $(ele).text(question.choices[ind]).removeAttr("disabled");
  });

  $("audio").attr("src", "audio/" + question.file);
  $("#playBtn").prop("disabled", false).text("Play Audio");
  $("#message").text("");

  $("#nextBtn").addClass("hidden opacity-0").removeClass("opacity-100");
  updateScore();
  $("#timer").text(`Time: ${TIME_LIMIT}`);
}

$(document).ready(() => {
  getData();

  $("#startBtn").click(() => {
    $("#gameMenu").addClass("hidden");
    $("#gameWrapper").removeClass("hidden"); // Fix visibility
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

    $("#nextBtn").removeClass("hidden opacity-0").addClass("opacity-100");
    updateScore();
  });

  $("#nextBtn").click(() => {
    $("#nextBtn").addClass("neon-out");

    setTimeout(() => {
      userInput.current++;

      if (userInput.current >= animeData.data.length) {
        $("#gameWrapper").html(`
          <h2 class="text-2xl font-bold text-pink-500">Game Over</h2>
          <p class="text-lg mt-4">Final Score: ${userInput.points} / ${animeData.data.length}</p>
          <button onclick="location.reload()" class="mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl text-white font-bold shadow-lg btn-glow">
            Restart Game
          </button>
        `);
        $("#message").text("")
        return;
      }

      $("#nextBtn")
        .removeClass("neon-out opacity-100")
        .addClass("hidden opacity-0");
      updateDom();
    }, 400);
  });
});
