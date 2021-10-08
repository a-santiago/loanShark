
//Displays a message to the User
function getString() {
    let userString = document.getElementById("userstring").value;

    let revString = reverseString(userString)

    displayString(revString);

}

function reverseString(userString) {
    let startValue = userString.length - 1;
    let endValue = 0;

    let revString = "";

    for (let index = startValue; index <= endValue; index--){
        revString = + userString[index];
    };
    return revString
    
}

function displayString(revString) {
    let output = document.getElementById("results");

    output.innerHTML = revString;
}