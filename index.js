(() => {
    const comics = Array.from(document.querySelectorAll(".comic"))
    var latestComicNum;

    const nextButton = document.querySelector("#next")
    const previousButton = document.querySelector("#previous")

    const form = document.querySelector("form")
    const input = document.querySelector("#comic-number")

    const select = document.querySelector("#number-of-displayed-comics")
    var numberOfDisplayedComics = Number(select.getAttribute("value"))


    /******** API handlers  ********/
    // handle fetching latest comic
    const getLatestComic = () => 
        fetch("https://xkcd.now.sh/?comic=latest")
        .then((res) => {
            return res.json()
        })
        .catch((err) => console.log(err))


    // handle fetching comic based on number
    // check comic number first, if it exceeds the latest comic number, or if it is less than 0
    const getComic = (num) => 
        fetch(`https://xkcd.now.sh/?comic=${checkComicNum(num)}`)
        .then((res) => {
            return res.json()
        })
        .catch((err) => console.log(err))


    // check comic number
        // if number > latest comic number 
        // if number < 1 
            // adjust accordingly
    const checkComicNum = (num) => {
        if (num > latestComicNum) {
            return num - latestComicNum
        } else if (num < 1) {
            return latestComicNum + num
        } else {
            return num
        }
    }

    // set comic details
        // title
        // id
        // img 
    const setComic = (data, comic) => {
        console.log(`setting ${data.num}`)
        comic.setAttribute("id", data.num)
        comic.children[0].innerHTML = data.title
        comic.children[1].innerHTML = data.num
        comic.children[2].setAttribute("src", data.img)
    }


    // load comics
    const loadComics = (num) => {
        let promises = []

        for (let k = num - 2; k < num - 2 + comics.length; k++) {
            promises.push(getComic(k))
        }

        Promise.all(promises)
        .then((returnedComics) => {
            returnedComics.forEach((comic) => {
                let index = returnedComics.indexOf(comic)
                setComic(comic, comics[index])
            })
        })

    }



    // add event listener to next button
        // on click, display the next 1/3/5 comics
    nextButton.addEventListener("click", () => {    
        desiredComicNum = Number(comics[2].getAttribute("id")) + numberOfDisplayedComics
        loadComics(desiredComicNum)
    })

    // add event listener to previous button
        // on click, display the previous 1/3/5 comics
    previousButton.addEventListener("click", () => {
        desiredComicNum = Number(comics[2].getAttribute("id")) - numberOfDisplayedComics
        loadComics(desiredComicNum)
    })

    
    // add event listener to the input 
        // on change, set the input value to what was typed/selected
    input.addEventListener("change", (event) => {
        const inputNumber = event.target.value
        input.setAttribute("value", inputNumber)    
    })

    
    // add event listener to the form
        // on submission
            // prevent default so browser doesn't refresh
            // get the value of the input (which was what the user selected/typed)
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const inputNumber = Number(input.getAttribute("value"))

        // if user enters invalid number
            // send an error
        // else
            // load the comics using that chosen comic number
        if (inputNumber < 1 || inputNumber > latestComicNum) {
            alert("Sorry please pick a valid number")
        } else {
            loadComics(inputNumber) 
        }  
    })


    // handle selecting number of comics to display
    // if selected number of comics to display is 1
        // add "hidden" class for comics at index 0, 1, 3, 4
        // remove "hidden" class for comic at index 2
    // else if selected number of comics to display is 3
        // add "hidden" class for comics at index 0, 4
        // remove "hidden" class for comics at index 1, 2, 3
    // else if selected number of comics to display is 5
        // remove "hidden" class for all comics
    const renderDisplay = () => {
        if (numberOfDisplayedComics === 1) {
            comics.forEach((comic) => {
                if (comics.indexOf(comic) === 2) {
                    comic.classList.remove("hidden")
                } else {
                    comic.classList.add("hidden")
                }
            })
        } else if (numberOfDisplayedComics === 3) {
            comics.forEach((comic) => {
                if (comics.indexOf(comic) === 0 || comics.indexOf(comic) === 4) {
                    comic.classList.add("hidden")
                } else {
                    comic.classList.remove("hidden")
                }
            })
        } else if (numberOfDisplayedComics === 5) {
            comics.forEach((comic) => {
                comic.classList.remove("hidden")
            })
        }
    }

    // add event listener to select element
        // the selected number of comics to display is the value of the selected option
    select.addEventListener("change", (event) => {
        numberOfDisplayedComics = Number(event.target.value)
        renderDisplay()
    })



    // on load of page
        // get the latest comic
        // set the latest comic variable as the json response of the promise 
        // get the rest of the comics before and after it
    getLatestComic()
    .then((data) => latestComicNum = data.num)
    .then((latestComicNum) => loadComics(latestComicNum))
})()