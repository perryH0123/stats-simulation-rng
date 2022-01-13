let numSets = 1;
let setLength = 10;
let genMin = 1;
let genMax = 20;
let useCompareFcn = false;
let minThreshold = 3;
let delimiter = " ";
let compareFcnStr = "";
let generated = false; //to refresh document elements
let flaggedSets = 0;
let passedValidation = false;
let validationComplaints = "";

//2d array
let renderedOutput = [];

const updateParameters = () => {
    validationComplaints = "";
    passedValidation = false;
    numSets = document.querySelector("#sets").value;
    setLength = document.querySelector("#setLength").value;
    genMin = document.querySelector("#lowerBound").value;
    genMax = document.querySelector("#upperBound").value;

    useCompareFcn = (document.querySelector("#comparisonFunction").value.length > 2);
    console.log(useCompareFcn);
    minThreshold = document.querySelector("#numOfOccurances").value;
    let delimiterStr = document.querySelector("#delimiter").value;
    delimiter = (delimiterStr.length > 0) ? delimiterStr : " ";
    if(useCompareFcn){
        compareFcnStr = document.querySelector("#comparisonFunction").value;
    }
    validateInputs(numSets, setLength, genMin, genMax, minThreshold);
    renderedOutput = [];
    flaggedSets = 0;
}

const validateInputs = (numSets, setLength, genMin, genMax, minThreshold) => {
    let complaints = [];
    if(numSets < 1 || numSets > 100){
        complaints.push("Number of sets is not in the allowed range (1-100)");
    }
    if(setLength<1 || setLength>100){
        complaints.push("Set length is not in the allowed range (1-100)");
    }
    if(genMax < genMin){
        complaints.push("Generation maximum cannot be less than generation minimum");
    }
    if(minThreshold < 1 && useCompareFcn){
        complaints.push("Minimum threshold must be greater than zero if using an expression.")
    }
    if(complaints.length < 1){
        passedValidation=true;
    } else {
        console.log(complaints);
        let msg = "VALIDATION ERRORS\r\n------------\r\n"
        for(let i = 1; i<=complaints.length; i++){
            msg += `${i}. ${complaints[i-1]}\r\n`
        }
        alert(msg);
        console.log(msg);
    }
}

const generateNums = () => {
    updateParameters();
    if(passedValidation){
        for(let i = 0; i<numSets; i++){
            let detected = 0;
            renderedOutput.push([]);
            for(let j = 0; j<setLength; j++){
                let num = Math.floor(Math.random()*parseInt(genMax))+parseInt(genMin);
                console.log(num);
                let textOutput = "";
                if(useCompareFcn){
                    if(compareFcn(num)){
                        detected++;
                        textOutput = `(${num.toString()})`;
                    } else {
                        textOutput = num.toString();
                    }
                } else {
                    textOutput = num.toString();
                }
                renderedOutput[i][j] = textOutput;
            }
            if(detected >= minThreshold){
                flaggedSets++;
                renderedOutput[i].push(" ###");
            }
        }
        output();
    }
}

const compareFcn = x => {
    try {
        let fun;
        eval( "fun = (" + document.querySelector("#comparisonFunction").value + ")");
        console.log(fun);
        return fun;
    } catch {
        alert("Invalid compare function!");
        compareFcnStr = "";
        useCompareFcn = false;
    }
    return false;
}

const output = () => {
    const output = document.querySelector("#final-output");
    let generated = 
    `<h2>Generation Parameters</h2>
    <p><strong>Number of sets: </strong> ${numSets}</p>
    <p><strong>Set length: </strong> ${setLength}</p>
    <p><strong>Generation minimum: </strong> ${genMin}</p>
    <p><strong>Generation maximum: </strong> ${genMax}</p>
    `;
    if(useCompareFcn){
        generated += 
        `<h2>Advanced</h2>
        <p><strong>Expression: </strong> ${compareFcnStr}</p>
        <p><strong>Number of times flagged: </strong> ${flaggedSets}</p>
        <p><strong>Simulation probability: </strong> ${flaggedSets/numSets}</p>
        `;
    }
    generated += "====================<br>";
    renderedOutput.forEach((element, index) => {
        let trial = element.slice(0, -1).join(delimiter)+' '+ element.slice(-1);
        generated += `TRIAL: ${index+1}<br>${trial}<br><br>`;
    });
    output.innerHTML = generated;
}

let submit = document.querySelector("#submit");
submit.addEventListener("click",e => e.preventDefault());