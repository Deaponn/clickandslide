let board = {
    root: (window.location.href).substring(0, (window.location.href).lastIndexOf("/")),
    boardSize: 0,
    initialize: function (image, imageSize, boardSize) {
        document.getElementById("board").innerHTML = ""
        var sequence = 0
        this.boardSize = boardSize
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                var div = document.createElement("div")
                div.style.height = imageSize / boardSize + "px"
                div.style.width = imageSize / boardSize + "px"
                div.style.backgroundImage = "url(" + this.root + image + ")"
                div.style.backgroundPositionX = (-j) * (imageSize / boardSize) + "px"
                div.style.backgroundPositionY = (-i) * (imageSize / boardSize) + "px"
                div.style.gridRowStart = i + 1
                div.style.gridColumnStart = j + 1
                div.id = "picture" + sequence
                div.onmouseup = function () {
                    for (var i = 0; i < board.boardSize * board.boardSize; i++) {
                        if (board["cell" + i].occupiedWith == this.id) {
                            var direction = board["cell" + i].checkForSpace()
                            board["cell" + i].move(direction, this.id)
                            board.cell0.checkForWin()
                            break
                        }
                    }
                }
                this["cell" + sequence] = {
                    sequence: sequence,
                    occupied: true,
                    occupiedWith: div.id,
                    row: i + 1,
                    column: j + 1,
                    checkForSpace: function () {
                        if (this.row > 1) {
                            if (!board["cell" + (this.sequence - board.boardSize)].occupied) { return 0 }
                        }
                        if (this.column < board.boardSize) {
                            if (!board["cell" + (this.sequence + 1)].occupied) { return 1 }
                        }
                        if (this.row < board.boardSize) {
                            if (!board["cell" + (this.sequence + board.boardSize)].occupied) { return 2 }
                        }
                        if (this.column > 1) {
                            if (!board["cell" + (this.sequence - 1)].occupied) { return 3 }
                        }
                        else {
                            return 4
                        }
                    },
                    move: function (direction, picture) {
                        if (direction == 0) {
                            document.getElementById(picture).style.gridRowStart = this.row - 1
                            board["cell" + (this.sequence - board.boardSize)].occupied = true
                            board["cell" + (this.sequence - board.boardSize)].occupiedWith = picture
                            this.occupied = false
                            this.occupiedWith = "none"
                        }
                        if (direction == 1) {
                            document.getElementById(picture).style.gridColumnStart = this.column + 1
                            board["cell" + (this.sequence + 1)].occupied = true
                            board["cell" + (this.sequence + 1)].occupiedWith = picture
                            this.occupied = false
                            this.occupiedWith = "none"
                        }
                        if (direction == 2) {
                            document.getElementById(picture).style.gridRowStart = this.row + 1
                            board["cell" + (this.sequence + board.boardSize)].occupied = true
                            board["cell" + (this.sequence + board.boardSize)].occupiedWith = picture
                            this.occupied = false
                            this.occupiedWith = "none"
                        }
                        if (direction == 3) {
                            document.getElementById(picture).style.gridColumnStart = this.column - 1
                            board["cell" + (this.sequence - 1)].occupied = true
                            board["cell" + (this.sequence - 1)].occupiedWith = picture
                            this.occupied = false
                            this.occupiedWith = "none"
                        }
                    },
                    checkForWin: function () {
                        if (this.sequence < board.boardSize * board.boardSize - 1) {
                            if (("picture" + this.sequence) == this.occupiedWith) {
                                board["cell" + (this.sequence + 1)].checkForWin()
                            }
                        }
                        else {
                            board.onWin()
                        }
                    }
                }
                if (sequence < this.boardSize * this.boardSize - 1) {
                    sequence += 1
                }
                else {
                    var div = document.createElement("div")
                    div.style.height = imageSize / boardSize + "px"
                    div.style.width = imageSize / boardSize + "px"
                    div.id = "picture" + sequence
                }
                document.getElementById("board").appendChild(div)
            }
        }
        this["cell" + (this.boardSize * this.boardSize - 1)].occupied = false
    },
    shuffle: function (row, column, sequence, shuffles) {
        if (shuffles >= 0) {
            var directions = []
            if (row > 1) {
                directions.push(0)
            }
            if (column < this.boardSize) {
                directions.push(1)
            }
            if (row < this.boardSize) {
                directions.push(2)
            }
            if (column > 1) {
                directions.push(3)
            }
            direction = directions[Math.floor(Math.random() * directions.length)]
            if (direction == 0) {
                this["cell" + (sequence - this.boardSize)].move(2, this["cell" + (sequence - this.boardSize)].occupiedWith)
                setTimeout(this.shuffle.bind(this), 10, row - 1, column, sequence - this.boardSize, shuffles - 1)
            }
            if (direction == 1) {
                this["cell" + (sequence + 1)].move(3, this["cell" + (sequence + 1)].occupiedWith)
                setTimeout(this.shuffle.bind(this), 10, row, column + 1, sequence + 1, shuffles - 1)
            }
            if (direction == 2) {
                this["cell" + (sequence + this.boardSize)].move(0, this["cell" + (sequence + this.boardSize)].occupiedWith)
                setTimeout(this.shuffle.bind(this), 10, row + 1, column, sequence + this.boardSize, shuffles - 1)
            }
            if (direction == 3) {
                this["cell" + (sequence - 1)].move(1, this["cell" + (sequence - 1)].occupiedWith)
                setTimeout(this.shuffle.bind(this), 10, row, column - 1, sequence - 1, shuffles - 1)
            }
        }
        else {
            clock.start()
        }
    },
    createButtons() {
        for (var i = 3; i < 7; i++) {
            var button = document.createElement("button")
            button.setAttribute("class", "buttons")
            button.innerHTML = i + "x" + i
            button.dataset.dimension = i
            button.onmousedown = function () {
                clock.stop()
                clock.setup()
                board.initialize(banner.picture, banner.pictureSize, parseInt(this.dataset.dimension))
            }
            button.onmouseup = function () {
                board.shuffle(board.boardSize, board.boardSize, board.boardSize * board.boardSize - 1, parseInt(this.dataset.dimension) * 30)
            }
            document.getElementById("buttons").appendChild(button)
        }
    },
    onWin: function () {
        clock.stop()
        overlay.winScreen(clock.stopTime)
    }
}
let banner = {
    picture: "/pictures/gradient.gif",
    pictureSize: 600,
    picturesArray: [
        ["/pictures/tree.jpg", 600],
        ["/pictures/gradient.gif", 600],
        ["/pictures/anchor.png", 600],
        ["/pictures/jhin.jpg", 600]
    ],
    currentPicture: 1,
    create: function () {
        var banner = document.createElement("div")
        banner.id = "banner"
        banner.style.height = "360px"
        banner.style.width = "360px"
        banner.style.overflow = "hidden"
        var image = document.createElement("img")
        image.src = board.root + "/pictures/slider.gif"
        banner.appendChild(image)
        var right = document.createElement("img")
        right.src = board.root + "/pictures/arrow.png"
        right.style.height = "120px"
        right.style.marginLeft = "50px"
        right.onclick = () => {
            this.currentPicture += 1
            if (this.currentPicture == this.picturesArray.length) { this.currentPicture = 0 }
            this.picture = this.picturesArray[this.currentPicture][0]
            this.pictureSize = this.picturesArray[this.currentPicture][1]
            this.slideRight(360, 10)
        }
        var left = document.createElement("img")
        left.src = board.root + "/pictures/arrow.png"
        left.style.height = "120px"
        left.style.marginRight = "50px"
        left.style.rotate = "180deg"
        left.onclick = () => {
            this.currentPicture -= 1
            if (this.currentPicture == -1) { this.currentPicture = this.picturesArray.length - 1 }
            this.picture = this.picturesArray[this.currentPicture][0]
            this.pictureSize = this.picturesArray[this.currentPicture][1]
            this.slideLeft(360, 10)
        }
        document.getElementById("bannerDiv").appendChild(left)
        document.getElementById("bannerDiv").appendChild(banner)
        document.getElementById("bannerDiv").appendChild(right)

        setTimeout(function () { document.getElementById("banner").scrollLeft = 360 }, 100)
    },
    slideRight: function (remaining, speed) {
        if (document.getElementById("banner").scrollLeft < 1440) {
            if (remaining > 0) {
                document.getElementById("banner").scrollLeft += speed
                return setTimeout(this.slideRight.bind(this), 10, remaining - speed, speed)
            }
        }
        else {
            document.getElementById("banner").scrollLeft = 0
            if (remaining > 0) {
                document.getElementById("banner").scrollLeft += speed
                return setTimeout(this.slideRight.bind(this), 10, remaining - speed, speed)
            }
        }
    },
    slideLeft: function (remaining, speed) {
        if (document.getElementById("banner").scrollLeft != 0) {
            if (remaining > 0) {
                document.getElementById("banner").scrollLeft -= speed
                return setTimeout(this.slideLeft.bind(this), 10, remaining - speed, speed)
            }
        }
        else {
            document.getElementById("banner").scrollLeft = 1440
            if (remaining > 0) {
                document.getElementById("banner").scrollLeft -= speed
                return setTimeout(this.slideLeft.bind(this), 10, remaining - speed, speed)
            }
        }
    }
}
let clock = {
    startTime: new Date(),
    stopTime: 0,
    timer: "",
    setup: function () {
        document.getElementById("clock").innerHTML = ""
        for (var i = 0; i < 12; i++) {
            if (i == 2 || i == 5) {
                var img = document.createElement("img")
                img.src = board.root + "/pictures/colon.gif"
            }
            else if (i == 8) {
                var img = document.createElement("img")
                img.src = board.root + "/pictures/dot.gif"
            }
            else {
                var img = document.createElement("img")
                img.src = board.root + "/pictures/c0.gif"
            }
            img.id = "clock" + i
            document.getElementById("clock").appendChild(img)
        }
    },
    start: function () {
        this.startTime = new Date()
        this.timer = setInterval(this.refresh.bind(this), 10)
    },
    stop: function () {
        clearInterval(this.timer)
    },
    refresh: function () {
        var time = new Date()
        var elapsed = time - this.startTime
        var miliseconds = elapsed % 1000
        var seconds = Math.floor(elapsed / 1000) % 60
        var minutes = Math.floor(elapsed / 60000) % 60
        var hours = Math.floor(elapsed / 3600000) % 60
        if (hours < 10) { var timeString = "0" + hours } else { var timeString = toString(hours) }
        if (minutes < 10) { timeString += ":0" + minutes } else { timeString += ":" + minutes }
        if (seconds < 10) { timeString += ":0" + seconds } else { timeString += ":" + seconds }
        if (miliseconds < 10) { timeString += ".00" + miliseconds }
        else if (miliseconds < 100 && miliseconds >= 10) { timeString += ".0" + miliseconds }
        else { timeString += "." + miliseconds }
        for (var i = 0; i < 12; i++) {
            if (timeString[i] != ":" && timeString[i] != ".") { document.getElementById("clock" + i).src = board.root + "/pictures/c" + timeString[i] + ".gif" }
        }
        this.stopTime = timeString
    }
}
let overlay = {
    time: 0,
    winScreen: function (timeString) {
        document.getElementById("overlay").innerHTML = ""
        document.getElementById("overlay").style.display = "block"
        var text = document.createElement("div")
        text.id = "text"
        text.innerHTML = "Wygrana! Twoj czas to:"
        var time = document.createElement("div")
        time.id = "time"
        time.innerHTML = timeString
        var input = document.createElement("input")
        input.id = "input"
        input.type = "text"
        input.placeholder = "Wprowadz nazwe"
        var warning = document.createElement("div")
        warning.id = "warning"
        warning.innerHTML = "Istnieje juz lepszy wynik z takim nickiem, nadpisac?"
        warning.style.display = "none"
        var button = document.createElement("button")
        button.id = "hide"
        var overwrite = true
        button.onclick = () => {
            if (this.leaderboards.checkForPresence(document.getElementById("input").value, board.boardSize, timeString) == overwrite) {
                this.hide()
                document.cookie = board.boardSize + document.getElementById("input").value + " = " + timeString + "; Secure"
                clock.setup()
                board.shuffle(board.boardSize, board.boardSize, board.boardSize * board.boardSize - 1, 100)
            }
            else {
                document.getElementById("hide").innerHTML = "Nadpisz"
                document.getElementById("warning").style.display = "block"
                overwrite = false
            }
        }
        button.innerHTML = "Zagraj ponownie"
        document.getElementById("overlay").appendChild(text)
        document.getElementById("overlay").appendChild(time)
        document.getElementById("overlay").appendChild(input)
        document.getElementById("overlay").appendChild(button)
        document.getElementById("overlay").appendChild(warning)
    },
    leaderboards: {
        show: function (mode) {
            document.getElementById("overlay").innerHTML = ""
            document.getElementById("overlay").style.display = "block"
            var scoreString = document.cookie.split("; ")
            var selected = []
            for (var i = 0; i < scoreString.length; i++) {
                if (scoreString[i][0] == mode) {
                    selected.push(scoreString[i].split("="))
                }
            }
            for (var i = selected.length; i >= 0; i--) {
                for (var j = 0; j < i - 1; j++) {
                    if (this.compareTimes(selected[j][1], selected[j + 1][1])) {
                        continue
                    }
                    else {
                        var placeholder = selected[j]
                        selected[j] = selected[j + 1]
                        selected[j + 1] = placeholder
                    }
                }
            }
            if (selected.length <= 10) { var scoreBoardLength = selected.length } else { var scoreBoardLength = 10 }
            for (var i = 0; i < scoreBoardLength; i++) {
                var nick = document.createElement("div")
                nick.setAttribute("class", "scoreBoard")
                nick.style.transform = "translate(200px, " + i * 60 + "px)"
                nick.innerHTML = i + 1 + ". " + this.trimMode(selected[i][0])
                var time = document.createElement("div")
                time.setAttribute("class", "scoreBoard")
                time.style.transform = "translate(700px, " + i * 60 + "px)"
                time.innerHTML = selected[i][1]
                document.getElementById("overlay").appendChild(nick)
                document.getElementById("overlay").appendChild(time)
            }
            this.createButtons(mode)
        },
        createButtons: function (currentMode) {
            var close = document.createElement("img")
            close.src = board.root + "/pictures/return.png"
            close.setAttribute("class", "scoreBoardButtons")
            close.style.top = "30px"
            close.onclick = function () { overlay.hide() }
            document.getElementById("overlay").appendChild(close)
            for (var i = 3; i < 7; i++) {
                var modeScores = document.createElement("img")
                modeScores.src = board.root + "/pictures/category" + i + ".png"
                modeScores.setAttribute("class", "scoreBoardButtons")
                modeScores.style.top = 140 * (i - 2) + 20 + "px"
                modeScores.dataset.type = i
                if (i == currentMode) { modeScores.id = "scoreBoardSelected" }
                document.getElementById("overlay").appendChild(modeScores)
                modeScores.onclick = function () {
                    overlay.leaderboards.show(this.dataset.type)
                }
            }
        },
        button: function () {
            var button = document.createElement("img")
            button.id = "leaderboards"
            button.src = board.root + "/pictures/leaderboard.png"
            button.onclick = function () {
                overlay.leaderboards.show(3)
                this.style.display = "none"
            }
            document.body.appendChild(button)
        },
        checkForPresence: function (toCheck, mode, score) {
            var scoreArray = document.cookie.split("; ")
            var possibility = true
            scoreArray.forEach(function (value) {
                placeholder = value.split("=")
                if (mode + toCheck == placeholder[0] && overlay.leaderboards.compareTimes(placeholder[1], score)) {
                    possibility = false
                }
            })
            return possibility
        },
        compareTimes: function (time1, time2) { // returns true if time1 is smaller
            var output = true
            for (var i = 0; i < 12; i++) {
                if (i != 2 && i != 5 && i != 8) {
                    if (parseInt(time1[i]) < parseInt(time2[i])) { return true }
                    else if (parseInt(time1[i]) == parseInt(time2[i])) { continue }
                    else { return false }
                }
            }
            return output
        },
        trimMode: function (nick) {
            var output = ""
            for (var i = 1; i < nick.length; i++) { output += nick[i] }
            return output
        }
    },
    hide: function () {
        document.getElementById("overlay").style.display = "none"
        document.getElementById("leaderboards").style.display = "block"
    }
}
console.log("commit! na pewno odpowiedni :P")
banner.create()
overlay.leaderboards.button()
board.createButtons()