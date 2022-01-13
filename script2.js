let list = [];
let sortedResult = [];
let timeoutBuffer;
let clusterRepeats = false; //cursed atm
let numResultsPerRow = 8;
let addCommas = false;

document.querySelector("#csv").style.display = "none";

const disableSubmit = event => {
    addNumber();
    event.preventDefault();
}
const form = document.getElementById("numberIn")
form.addEventListener("submit",disableSubmit,true);

document.getElementById("numRow").addEventListener("change",(event) => {
    numResultsPerRow = parseInt(event.target.value);
    updateListDisplay();
});

document.getElementById("commas").addEventListener("change", (event)=> {
    addCommas = document.getElementById("commas").checked;
});

const addNumber = () => {
    const input = document.getElementById("number");
    list.push(input.value);
    input.value = "";
    updateListDisplay();
}

const delLastItem = () => {
    if(list.length > 0){
        list.pop();
    }
    updateListDisplay();
}

const resetListPrompt = () => {
    const reset = document.getElementById("reset");
    reset.innerHTML = "Are you sure?";
    reset.style.backgroundColor = "#f77b72";
    reset.onclick = refreshList;
    timeoutBuffer = setTimeout(refreshListButton, 1500);
}

const refreshListButton = () => {
    const reset = document.getElementById("reset");
    reset.innerHTML = "Reset List";
    reset.style.backgroundColor = "#ebbf52";
    reset.onclick = resetListPrompt;
    clearTimeout(timeoutBuffer);
}

const refreshList = () => {
    list=[];
    refreshListButton();
    updateListDisplay();
    document.querySelector("#csv").style.display = "none";
    displayOutput();
}

const updateListDisplay = () => {
    const display = document.getElementById("preview-output");
    let output = "";
    var counter = 1;
    if(!clusterRepeats){
        for(let i = 0; i<list.length; i++){
            output += list[i] + " ";
            if((i+1)%numResultsPerRow == 0){
                output += "<br>";
            }
        }
        display.innerHTML = output;
    }/* else {
        for(let i = 0; i<list.length; i++){
            if(list[i] == list[i-1]){
                if(list[i] != list[i-2]){
                    counter = 1;
                    var n = 0;
                    while(list[i] == list[i+n]){
                        counter++;
                    }
                } else {
                    break;
                }
                output += `[${counter}]`;
            } else {
                output += list[i];
            }
            if((i+1)%numResultsPerRow == 0){
                output += "\n";
            }
        }
    }*/
}

const displayOutput = () => {
    const output = document.getElementById("final-output");
    const copy = list;
    let outputStr = "";
    copy.sort((a,b)=>a-b);
    sortedResult = copy;
    for(let i=0; i<copy.length; i++){
        outputStr += (copy[i] + ((addCommas && i != copy.length-1) ? ", " : " "));
        if((i+1)%numResultsPerRow == 0){
            console.log("adding new line");
            outputStr += "<br>";
        }
    }
    output.innerHTML = outputStr;
    document.querySelector("#csv").style.display = "block";
}

const download = () => {
    let csvContent = "data:text/csv;charset=utf-8," + "Data\n" + sortedResult.join("\n");
    let encodedURI = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href",encodedURI);
    link.setAttribute("download","data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}