let animeData = {
}, userInput = {
    current: 0,
    currentRaw: "",
    points: 0
}
function getData() {
    fetch("./data.json")
        .then((res) => res.json())
        .then((data) => {
            animeData.data = data;
            localStorage.setItem("data", JSON.stringify(animeData));
        })
}
function updateDom() {
    $("#currentQues").text(userInput.current + 1)
    $(".choiceBtn").each((ind, ele) => {
        $(ele).text(animeData.data[userInput.current].choices[ind])
    })
    $("audio").attr("src", "audio/" + animeData.data[userInput.current].file)
    $("#playBtn").click(() => {
        if ($("#playBtn").text().includes("Play")) {
             $("audio").play();
            $("#playBtn").text("Stop Audio");
        } else {
            $("audio").pause();
            $("#playBtn").text("Play Audio");
        }

    })

}
$(document).ready(() => {
    if (localStorage.getItem("data") === null) {
        getData();
        localStorage.setItem("user", JSON.stringify(userInput));
    } else {
        animeData = JSON.parse(localStorage.getItem("data"));
        userInput = JSON.parse(localStorage.getItem("user"))
    }
    updateDom()
    $("#startBtn").click((e) => {
        $("#gameMenu").addClass("hidden")
        $("#gameArea").removeClass("hidden")
    })
})