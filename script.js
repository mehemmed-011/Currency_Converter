let key = "8ry8Wwjc2mTf1x4toRu3WO9LEMK1Mjrq";
// let apiUrl = "https://api.currencybeacon.com/v1/convert?api_key=";
let apiUrl = "http://localhost:3000/convert?api_key=";

let convertBtn1 = document.querySelectorAll(".cnv-btn1");
let convertBtn2 = document.querySelectorAll(".cnv-btn2");
let bankBtn = document.querySelectorAll(".bank-btn");

let input1 = document.querySelector(".input1");
let input2 = document.querySelector(".input2");

let convertText1 = document.querySelector(".convert-text-1");
let convertText2 = document.querySelector(".convert-text-2");

let buyAmount = document.querySelector(".buy-amount");
let sellAmount = document.querySelector(".sell-amount");

let wifiError = document.querySelector(".wifi-error");
window.addEventListener("offline", ()=>{
    wifiError.style.display = "block";
})

window.addEventListener("online", ()=>{
    wifiError.style.display = "none";
})

let fromVal = "RUB";
let toVal = "USD";
let bankName = "NEW";

let lastChangedInput = "input1";
let currentRate = 0;

const bankPercent = {
    ABC: { buy: 1.01, sell: 0.995 },
    NEW: { buy: 1.02, sell: 0.99 },
    AME: { buy: 1.015, sell: 0.985 },
    RED: { buy: 1.005, sell: 0.995 }
};

input1.addEventListener("input", ()=>{
    lastChangedInput = "input1";
    input1.value = input1.value.replace(/[^0-9.,]/gi, '');
    input1.value = input1.value.replace(",", ".");
    let numPart = input1.value.split(".");
    if(numPart.length > 2){
        input1.value = numPart[0] + "." + numPart.slice(1).join("");
    }
    
    if(numPart[1] && numPart[1].length > 4){
        input1.value = numPart[0] + "." + numPart[1][0] + numPart[1][1] + numPart[1][2]+ numPart[1][3];
    }

    if(input1.value[0] == "."){
        input1.value = "0" + input1.value;
    }

    if(Number(input1.value) > 10000){
        input1.value = 10000;
    }

    exchangeFromInput1();
})

input2.addEventListener("input", ()=>{
    lastChangedInput = "input2";
    input2.value = input2.value.replace(/[^0-9.,]/gi, '');
    input2.value = input2.value.replace(",", ".");
    let numPart = input2.value.split(".");
    if(numPart.length > 2){
        input2.value = numPart[0] + "." + numPart.slice(1).join("");
    }

    if(numPart[1] && numPart[1].length > 4){
        input2.value = numPart[0] + "." + numPart[1][0] + numPart[1][1] + numPart[1][2]+ numPart[1][3];
    }

    if(input2.value[0] == "."){
        input2.value = "0" + input2.value;
    }

    if(Number(input2.value) > 10000){
        input2.value = 10000;
    }

    exchangeFromInput2();
})

convertBtn1.forEach(btn1 => {
    btn1.addEventListener("click", () => {
        convertBtn1.forEach(b1 => b1.classList.remove("active-btn1"));
        btn1.classList.add("active-btn1");
        fromVal = btn1.textContent;
        
        if(lastChangedInput == "input1"){
            exchangeFromInput1();
        }

        else{
            exchangeFromInput2();
        }
    });
});

convertBtn2.forEach(btn2 => {
    btn2.addEventListener("click", () => {
        convertBtn2.forEach(b2 => b2.classList.remove("active-btn2"));
        btn2.classList.add("active-btn2");
        toVal = btn2.textContent;

        if(lastChangedInput == "input1"){
            exchangeFromInput1();
        }

        else{
            exchangeFromInput2();
        }
    });
});

bankBtn.forEach(btn3 => {
    btn3.addEventListener("click", () => {
        bankBtn.forEach(b3 => b3.classList.remove("active-btn3"));
        btn3.classList.add("active-btn3");
        bankName = btn3.textContent;

        updateBank();
    });
});

function exchangeFromInput1(){
    if(fromVal === toVal){
        currentRate = 1;
        input2.value = input1.value;

        convertText1.textContent = `1 ${fromVal} = 1 ${toVal}`;
        convertText2.textContent = `1 ${toVal} = 1 ${fromVal}`;

        updateBank();
        return;
    }

    fetch(`${apiUrl}${key}&from=${fromVal}&to=${toVal}&amount=${input1.value}`)
    .then(res => res.json())
    .then(data => {
        let val = Number(data.value);
        input2.value = val.toFixed(4);
        currentRate = val / (Number(input1.value) || 1);

        convertText1.textContent = `1 ${fromVal} = ${currentRate.toFixed(4)} ${toVal}`;
        convertText2.textContent = `1 ${toVal} = ${(1/currentRate).toFixed(4)} ${fromVal}`;

        localStorage.setItem(`${fromVal}_${toVal}`, currentRate);

        updateBank();
    })
    .catch(() => {
        let savedRate = localStorage.getItem(`${fromVal}_${toVal}`);
        if(savedRate){
            currentRate = Number(savedRate);

            input2.value = (Number(input1.value) * currentRate).toFixed(4);
            convertText1.textContent = `1 ${fromVal} = ${currentRate.toFixed(4)} ${toVal}`;
            convertText2.textContent = `1 ${toVal} = ${(1/currentRate).toFixed(4)} ${fromVal}`;

            updateBank();
        }
    })
}

function exchangeFromInput2(){
    if(fromVal === toVal){
        currentRate = 1;
        input1.value = input2.value;

        convertText1.textContent = `1 ${fromVal} = 1 ${toVal}`;
        convertText2.textContent = `1 ${toVal} = 1 ${fromVal}`;

        updateBank();
        return;
    }

    fetch(`${apiUrl}${key}&from=${toVal}&to=${fromVal}&amount=${input2.value}`)
    .then(res => res.json())
    .then(data => {
        let val = Number(data.value);
        input1.value = val.toFixed(4);
        let inverseRate = val / (Number(input2.value) || 1);
        currentRate = 1 / inverseRate;

        convertText1.textContent = `1 ${fromVal} = ${(1/currentRate).toFixed(4)} ${toVal}`;
        convertText2.textContent = `1 ${toVal} = ${currentRate.toFixed(4)} ${fromVal}`;

        localStorage.setItem(`${fromVal}_${toVal}`, 1/currentRate);

        updateBank();
    })
    .catch(() => {
        let savedRate = localStorage.getItem(`${fromVal}_${toVal}`);

        if(savedRate){
            currentRate = Number(savedRate);

            input1.value = (Number(input2.value) / currentRate).toFixed(4);
            convertText1.textContent = `1 ${fromVal} = ${(1/currentRate).toFixed(4)} ${toVal}`;
            convertText2.textContent = `1 ${toVal} = ${currentRate.toFixed(4)} ${fromVal}`;

            updateBank();
        }
    })
}


function updateBank(){
    let buyRate = bankPercent[bankName].buy;
    let sellRate = bankPercent[bankName].sell;

    if(fromVal === toVal){
        if(lastChangedInput == "input1"){
            buyAmount.textContent = Number(input1.value || 0).toFixed(4);
            sellAmount.textContent = Number(input1.value || 0).toFixed(4);
        }

        else{
            buyAmount.textContent = Number(input2.value || 0).toFixed(4);
            sellAmount.textContent = Number(input2.value || 0).toFixed(4);
        }

        return;
    }

    if(lastChangedInput == "input1"){
        let resultValue = Number(input2.value || 0);
        buyAmount.textContent = (resultValue * sellRate).toFixed(4);
        sellAmount.textContent = (resultValue * buyRate).toFixed(4);
    }

    else{
        let resultValue = Number(input1.value || 0);
        buyAmount.textContent = (resultValue * sellRate).toFixed(4);
        sellAmount.textContent = (resultValue * buyRate).toFixed(4);
    }
}

exchangeFromInput1();