(() => {
    let latestComicNum;
    let currentComicNum;
    const displayComicsSetter = document.querySelector("#num-displayed-comics")
    let numDisplayedComics = Number(displayComicsSetter.value)
    let controller;

    /******** API handlers  ********/
    // fetch latest comic
    const fetchLatestComic = () => 
        fetch("https://xkcd.now.sh/?comic=latest")
        .then((res) => res.json())
        .catch((err) => console.log(err))


    const checkComicNum = (num) => {
        if (num > latestComicNum) {
            return num % latestComicNum
        } else if (num < 1) {
            return latestComicNum + num
        } else {
            return num
        }
    }

    // fetch comic based on number
    const fetchComic = async (num) => {     
        let updatedNum = await checkComicNum(num)

        return fetch(`https://xkcd.now.sh/?comic=${updatedNum}`, {signal: controller.signal})
        .then((res) => res.json())
        .catch((err) => console.log(err))
    }

    /**** Fetch and display all comics ****/
    const displayComics = (fetchedComics) => {
        document.querySelector(".loading-sign").classList.add("hidden")

        fetchedComics.forEach((comic) => {
            if (comic) {
                document.querySelector(".comics").innerHTML += 
                `<div id=${comic.num} class="comic">
                    <h3>${comic.num}. ${comic.title}</h3>
                    <img src=${comic.img} alt="" />
                </div>`
            }

        })  
    }

    const fetchAllComics = () => {
        document.querySelector(".loading-sign").classList.remove("hidden")
        document.querySelector(".comics").innerHTML = ""

        controller = new AbortController()
        let startingComicNum = currentComicNum - Math.floor(numDisplayedComics/2)       
        let promises = []

        for (i = 0; i < numDisplayedComics; i++) {
            promises.push(fetchComic(startingComicNum))
            startingComicNum++
        }

        return Promise.all(promises) 
    }


    /*** Next and previous buttons  ***/
    const nextButton = document.querySelector("#next")
    const prevButton = document.querySelector("#previous")

    nextButton.addEventListener("click", () => {
        controller.abort()
        currentComicNum += numDisplayedComics
        fetchAllComics()
        .then((fetchedComics) => displayComics(fetchedComics))
    })

    prevButton.addEventListener("click", () => {
        controller.abort()
        currentComicNum -= numDisplayedComics
        fetchAllComics()
        .then((fetchedComics) => displayComics(fetchedComics))
    })

    /*** Random button ***/
    const randomButton = document.querySelector("#random")

    randomButton.addEventListener("click", () => {
        controller.abort()
        currentComicNum = Math.ceil(Math.random() * latestComicNum)
        console.log(currentComicNum)
        fetchAllComics()
        .then((fetchedComics) => displayComics(fetchedComics))
    })


    /*** Set number of displayed comics ***/
    displayComicsSetter.addEventListener("change", (e) => {
        numDisplayedComics = Number(e.target.value)
        fetchAllComics()
        .then((fetchedComics) => displayComics(fetchedComics))
    })


    /*** Select comic number to see ***/
    const comicNumInput = document.querySelector("#comic-num")
    const comicNumForm = document.querySelector("#comic-num-form")

    comicNumForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let inputtedComicNum = Number(comicNumInput.value)

        if (inputtedComicNum > latestComicNum || inputtedComicNum < 1) {
            document.querySelector("#comic-num-form .field").classList.add("error") 
            document.querySelector("#error-msg").classList.remove("hidden")
        } else {
            currentComicNum = inputtedComicNum
          
            document.querySelector("#comic-num-form .field").classList.remove("error")
            document.querySelector("#error-msg").classList.add("hidden")
            fetchAllComics()
            .then((fetchedComics) => displayComics(fetchedComics))      
        }

        comicNumInput.value = ""  
        comicNumInput.focus()  
    })


    /*** On load  ***/
    fetchLatestComic()
    .then((data) => {
        latestComicNum = data.num
        currentComicNum = data.num
    })
    .then(fetchAllComics)
    .then((fetchedComics) => displayComics(fetchedComics))
})()