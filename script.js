let startNumber = 25;

let lightNumber = startNumber;

let sketch = document.querySelector(".sketch");
let resetWindow = document.querySelector(".resetWindow");
let resetButton = document.querySelector("#reset");
let closeButton = document.querySelector("#close");
let resizeButton = document.querySelector("#resize");
let resizeInput = document.querySelector(".newNumber");
let colorPick = document.querySelector("#colorPick");
let randomizeButton = document.querySelector("#randomize");
let screenSaveButton = document.querySelector("#screenSave");
let screenShotButton = document.querySelector("#screenShot");
let allLights = document.querySelector('.light');
let controlsWindow = document.querySelector('#controls');
let lightsList;

const defaultBackgroundColor = "black";
let defaultLightColor = "red";
const rainbowColors = ["#ff0000","#ff0f00","#ff1f00","#ff2e00","#ff3d00","#ff4d00","#ff5c00","#ff6b00","#ff7a00","#ff8a00","#ff9900","#ffa800","#ffb800","#ffc700","#ffd600","#ffe500","#fff500","#faff00","#ebff00","#dbff00","#ccff00","#bdff00","#adff00","#9eff00","#8fff00","#80ff00","#70ff00","#61ff00","#52ff00","#42ff00","#33ff00","#24ff00","#14ff00","#05ff00","#00f50a","#00e619","#00d629","#00c738","#00b847","#00a857","#009966","#008a75","#007a85","#006b94","#005ca3","#004db3","#003dc2","#002ed1","#001fe0","#000ff0"];
// const rainbowColors = [
//     "#e81416", "#ffa500", "#faeb36", "#79c314", "#487de7", "#4b369d", "#70369d"
// ]
let rainbowIndex = 0;
let rainbowDirection = 1;
console.log(rainbowColors.length)
const randomColor = () => {
    let red = Math.random() * 255;
    let green = Math.random() * 255;
    let blue = Math.random() * 255;

    return {color: `rgb(${red}, ${green}, ${blue})`, opacity: 1}
}

const removeIndex = (array, index) => {
    let i = 0;
    let cpy = [];
    if (index < 0)
        return [];
    if (isNaN(index))
        return [];
    while (i < array.length) {
        if (i !== index){
            cpy.push(array[i])
        }
        i++
    }
    return cpy;
}

const randomColorOpacity = () => {
    let red = Math.random() * 255;
    let green = Math.random() * 255;
    let blue = Math.random() * 255;
    let alpha = Math.random();

    return {color: `rgb(${red}, ${green}, ${blue})`, opacity: alpha}
}

const reset = () => {
    resetWindow.style.visibility = "visible";
    resizeInput.focus();
}

const close = () => {
    resetWindow.style.visibility = "hidden";
}

const resize = () => {
    let newLightNumber = parseInt(document.querySelector(".newNumber").value);
    if (newLightNumber && newLightNumber <= 100) {
        lightNumber = newLightNumber;
        drawLights(lightNumber);
    } else {
        document.querySelector(".newNumber").value = "ERROR : invalid number";
    }
    
}

const checkResize = () => {
    resizeInput.setAttribute("placeholder", `${lightNumber}`);
    resizeInput.setAttribute("value", `${lightNumber}`);
    if (resizeInput.value == lightNumber) {
        resizeButton.textContent = "Reset";
    } else {
        resizeButton.textContent = "Resize";
    }
}

const isPenDown = () => {
    let redPen = document.querySelector("#redPen");
    let randomPen = document.querySelector("#randomPen");
    let randomOpacityPen = document.querySelector("#randomOpacityPen");
    let rainbowPen = document.querySelector("#rainbowPen");
    if (redPen.checked) {
        return {color: defaultLightColor, opacity: 1};
    } else if (randomPen.checked) {
        return randomColor();
    } else if (randomOpacityPen.checked) {
        return randomColorOpacity();
    } else if (rainbowPen.checked) {
        let color = rainbowColors[rainbowIndex];
        rainbowIndex += rainbowDirection;
        if (rainbowIndex == rainbowColors.length - 1 || rainbowIndex == 0) {
            rainbowDirection *= -1
        }
        return {color: color, opacity: 1};
    } else {
        return 0
    }
}

const isEraserDown = () => {
    let eraser = document.querySelector("#eraserDown");
    return eraser.checked;
}

const colorize = (element) => {
    if (document.querySelector('#noPen').checked) {
        return
    }
    let penState = isPenDown();
    if (penState != 0){
        element.setAttribute("class", "light lightOn");
        element.style.backgroundColor = penState.color;
        element.style.opacity = penState.opacity;
        element.style.boxShadow = `inset 3px 3px 15px rgba(200, 200, 200, 0.5), 0 0 1vh ${penState.color}`;
        
    } else if (isEraserDown()) {
        element.style.boxShadow = `inset 0 0 1vh white`;
        element.setAttribute("class", "light");
        element.style.opacity = 1;
        element.style.backgroundColor = defaultBackgroundColor;
    }

}

const listen = (element) => {
    element.addEventListener("mouseover", () => {
        colorize(element);
    })
}

const randomize = () => {
    let lights = document.querySelectorAll(".light");
    let lightsList = [0]
    let i = 0;
    lights.forEach(light => {
        i++;
        lightsList.push(i);
    });
    i = 0;
    while (i <= lights.length) {
        let randomNumber = Math.floor(Math.random() * lightsList.length)
        let currentLight = lights[lightsList[randomNumber]];
        if (currentLight) {
            colorize(currentLight);
        }
        lightsList = removeIndex(lightsList, randomNumber);
        i++;
    }
}
let screenSaving = 0;
let screenSaveInterval;
const screenSaver = () => {
    let lights = document.querySelectorAll(".light");
    if (screenSaving === 0) {
        screenSaving = 1;
        screenSaveButton.textContent = "Stop Screen Saver Mode";
        sketch.setAttribute("class", "sketch fullscreen");
        screenSaveInterval = setInterval(() => {
            if (screenSaving === 1) {
                let randomNumber = Math.floor(Math.random() * lights.length)
                colorize(lights[randomNumber]);
            } else {
                screenSaveButton.textContent = "Start Screen Saver Mode"
                sketch.setAttribute("class", "sketch");
                return ;
            }
        }, 100)
    } else {
        sketch.setAttribute("class", "sketch");
        screenSaveButton.textContent = "Start Screen Saver Mode"
        screenSaving = 0;
        clearInterval(screenSaveInterval)
    }
}

let lightPosition = [0, 0]
const highlight = (light, state) => {
    if (state === 0) {
        if (light.style.backgroundColor == "black") {
            light.style.boxShadow = "inset 0 0 1vh white";
        } else {
            light.style.boxShadow = `inset 3px 3px 15px rgba(200, 200, 200, 0.5), 0 0 1vh ${light.style.backgroundColor ? light.style.backgroundColor : "white"}`;
        }
    } else if (state === 1) {
        light.style.boxShadow = `0 0 3px white`;
    }
}

const navigate = (x, y) => {
    let newX = lightPosition[0] + x;
    let newY = lightPosition[1] + y;
    if (newX >= lightNumber) {
        newX = 0;
    }
    if (newX < 0) {
        newX = lightNumber - 1;
    }
    if (newY >= lightNumber) {
        newY = 0;
    }
    if (newY < 0) {
        newY = lightNumber - 1;
    }
    let newLight = lightsList[(newX * lightNumber) + newY];
    let oldLight = lightsList[(lightPosition[0] * lightNumber) + lightPosition[1]];
    highlight(oldLight, 0);
    colorize(oldLight)
    colorize(newLight);
    highlight(newLight, 1);
    lightPosition = [newX, newY];
}

const drawLights = (number) => {
    let currentLights = document.querySelectorAll(".light");
    currentLights.forEach(light => {
        light.remove();
    });
    let i = 0;
    let startSize = (60/number) ;
    while (i < number) {
        let j = 0
        while (j < number) {
            let light = document.createElement("div");
            light.setAttribute("class", "light");
            light.setAttribute("id", `${i.toString() + j.toString()}`);
            light.style.width = `${startSize}vh`;
            // light.style.border = "1px black solid";
            light.style.height = `${startSize}vh`;
            light.style.backgroundColor = "black";
            listen(light);
            sketch.appendChild(light);
            j++;
        }
        i++;
    }
    checkResize();
    lightsList = document.querySelectorAll('.light');
    lightPosition = [0,0];
}

const screenShot = () => {
    // sketch.setAttribute("class", "sketch fullscreen");
    controlsWindow.style.opacity = '0';
    domtoimage
    .toPng(document.querySelector('#wrapper'), { quality: 1 })
    .then(function (dataUrl) {
        let now = new Date(Date.now());
        let dateText = `${now.getDate() < 10 ? "0" + now.getDate().toString() : now.getDate()}/${now.getMonth() + 1 < 10 ? "0" + parseInt(now.getMonth() + 1).toString() : now.getMonth() + 1}/${now.getFullYear()} at ${now.getHours() < 10 ? "0" + now.getHours().toString() : now.getHours()}h${now.getMinutes() < 10 ? "0" + now.getMinutes().toString() : now.getMinutes().toString()}_${now.getSeconds() < 10 ? "0" + now.getSeconds().toString() : now.getSeconds().toString()}`;
        let fileName = `Etch-a-Sketch Screenshot ${dateText}.png`;
        var link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        link.remove();
        // sketch.setAttribute("class", "sketch");
        controlsWindow.style.opacity = '1';
    });
}

drawLights(lightNumber);

closeButton.addEventListener("click", ()=> {
    close();
});
resetButton.addEventListener("click", ()=> {
    reset();
});
resizeButton.addEventListener("click", ()=> {
    resize();
});
randomizeButton.addEventListener("click", () => {
    randomize();
})
screenSaveButton.addEventListener("click", () => {
    screenSaver();
})
screenShotButton.addEventListener("click", () => {
    screenShot();
})
resizeInput.addEventListener("input", () => {
    checkResize();
});
colorPick.addEventListener("input", () => {
    defaultLightColor = colorPick.value;
})
document.addEventListener("keydown", (keyEvent) => {
    if (keyEvent.code == "ArrowUp") {
        navigate(-1, 0);
    } else if (keyEvent.code == "ArrowDown") {
        navigate(1, 0);
    } else if (keyEvent.code == "ArrowLeft") {
        navigate(0, -1);
    } else if (keyEvent.code == "ArrowRight") {
        navigate(0, 1);
    } else if (keyEvent.code == "Escape") {
        highlight(lightsList[(lightPosition[0] * lightNumber) + lightPosition[1]], 0)
    }
})