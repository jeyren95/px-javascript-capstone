(() => {
    var latestComicNum;
    var currentComicNum;
    const displayComicsSetter = document.querySelector("#num-displayed-comics")
    var numDisplayedComics = Number(displayComicsSetter.value)

    /******** API handlers  ********/
    // fetch latest comic
    const fetchLatestComic = () => 
        fetch("https://xkcd.now.sh/?comic=latest")
        .then((res) => res.json())
        .catch((err) => console.log(err))


    const checkComicNum = (num) => {
        if (num > latestComicNum) {
            return num - latestComicNum
        } else if (num < 1) {
            return latestComicNum + num
        } else {
            return num
        }
    }

    // fetch comic based on number
    const fetchComic = (num) => 
        fetch(`https://xkcd.now.sh/?comic=${checkComicNum(num)}`)
        .then((res) => res.json())
        .catch((err) => console.log(err))



    /**** Fetch and display all comics ****/
    const displayComics = (fetchedComics) => {
        for (i = 0; i < fetchedComics.length; i ++) {
            document.querySelector(".comics .row").innerHTML += 
            `<div id=${fetchedComics[i].num}>
                <h1>${fetchedComics[i].title}</h1>
                <h2>${fetchedComics[i].num}</h2>
                <img src=${fetchedComics[i].img} alt="" />
            </div>`
        }

        document.querySelector(".loading-sign").classList.add("hidden")
    }

    const fetchAllComics = () => {
        console.log("fetching...")
        document.querySelector(".loading-sign").classList.remove("hidden")
        document.querySelector(".comics .row").innerHTML = ""

        let startingComicNum = currentComicNum - Math.floor(numDisplayedComics/2)       
        let promises = []

        for (i = 0; i < numDisplayedComics; i++) {
            promises.push(fetchComic(startingComicNum))
            startingComicNum++
        }

        Promise.all(promises)
        .then((fetchedComics) => displayComics(fetchedComics))
    }


    /*** Next and previous buttons  ***/
    const nextButton = document.querySelector("#next")
    const prevButton = document.querySelector("#previous")

    nextButton.addEventListener("click", () => {
        currentComicNum += numDisplayedComics
        fetchAllComics()
    })

    prevButton.addEventListener("click", () => {
        currentComicNum -= numDisplayedComics 
        fetchAllComics()
    })


    /*** Set number of displayed comics ***/
    displayComicsSetter.addEventListener("change", (e) => {
        numDisplayedComics = e.target.value
        fetchAllComics()
    })


    /*** Select comic number to see ***/
    const comicNumInput = document.querySelector("#comic-num")
    const comicNumForm = document.querySelector("#comic-num-form")

    comicNumInput.addEventListener("change", (e) => {
        comicNumInput.value = Number(e.target.value)
    })

    comicNumForm.addEventListener("submit", (e) => {
        e.preventDefault()
        currentComicNum = comicNumInput.value
        
        if (currentComicNum > latestComicNum || currentComicNum < 1) {
            document.querySelector("#error-msg").classList.remove("hidden")
              
        } else {
            document.querySelector("#error-msg").classList.add("hidden")
            fetchAllComics()
        }
        comicNumInput.value = ""  
        comicNumInput.focus()  
    })



    fetchLatestComic()
    .then((data) => {
        latestComicNum = data.num
        currentComicNum = data.num
    })
    .then(() => fetchAllComics())

})()