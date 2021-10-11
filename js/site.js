var schedule = [];

function getValues() {
    // get values from Input
    let loanAmount = parseFloat(document.getElementById("inputLoanAmount").value.replace(/[^0-9\.]/ig, ''));
    let term = parseFloat(document.getElementById("inputLoanTerm").value);
    let interestRate = document.getElementById('inputInterestRate').value;
    // clears the array
    document.getElementById("paymentsTableBody").innerHTML = "";
    schedule = [];

    disableUserinputs();

    //validate inputs were given and are numbers or reset form and alert user
    if (isNaN(loanAmount) || isNaN(term) || isNaN(interestRate)) {
        document.getElementById("inputForm").reset();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You can only enter numbers!',
            footer: 'You have coused an Error!!'
        })
    }

    let calculatedRate = calcRate(interestRate);

    let payment = calculatePayment(loanAmount, calculatedRate, term);
    //payment = parseFloat(payment);

    calcPaymentSchedule(loanAmount, calculatedRate, term, payment);

    displayPayments(loanAmount);

}

function calcRate(interestRate) {
    let rate = interestRate / 1200;
    return rate;
}

function calculatePayment(loanAmount, calculatedRate, term) {

    let montlyPayment = 0;
    let months = term * 12;
    a = loanAmount * calculatedRate;
    b = a / (1 - Math.pow((1 + calculatedRate), -months));
    montlyPayment = parseFloat(b.toFixed(2));
    return montlyPayment;
}

function calcInterest(rate, balance) {
    let totalInterest = Math.round(((balance * rate) + Number.EPSILON) * 100) / 100;
    return totalInterest;
}

function calcPaymentSchedule(loanAmount, calculatedRate, term, payment) {

    let numberOfPayments = term * 12;
    let balance = loanAmount;
    let totalI = 0;
    let newPrincipal = 0;
    let interestPay = 0;


    for (let i = 0; i < numberOfPayments; i++) {

        interestPay = calcInterest(calculatedRate, balance)
        totalI = Math.round(((totalI += interestPay) + Number.EPSILON) * 100) / 100;
        newPrincipal = Math.round(((payment - interestPay) + Number.EPSILON) * 100) / 100;
        balance = Math.round(((balance - newPrincipal) + Number.EPSILON) * 100) / 100;


        if (i == numberOfPayments - 1) {
            if (balance > 0) {
                payment += balance;
                payment = parseFloat(payment.toFixed(2));
                balance = 0;

            } else {

                payment = balance;
                balance = 0;
            }
        }



        let paymentRow = {
            month: i + 1,
            monthlyPayment: parseFloat(payment.toFixed(2)),
            principal: parseFloat(newPrincipal.toFixed(2)),
            interestPayment: parseFloat(interestPay.toFixed(2)),
            totalInterest: parseFloat(totalI.toFixed(2)),
            remainingBalance: parseFloat(balance.toFixed(2))

        }

        schedule.push(paymentRow)
    }

    return schedule;
}

function displayPayments(loanAmount) {



    let table = document.getElementById("paymentsTable");
    let template = document.getElementById("paymentsTableTemplate");
    let tableBody = document.getElementById("paymentsTableBody");



    schedule.forEach((i) => {
        let row = document.importNode(template.content, true);
        let cols = row.querySelectorAll("td");
        let colth = row.querySelector("th");
        colth.textContent = i.month;
        cols[0].textContent = `${createNumberString(i.monthlyPayment)}`;
        cols[1].textContent = `${createNumberString(i.principal)}`;
        cols[2].textContent = `${createNumberString(i.interestPayment)}`;
        cols[3].textContent = `${createNumberString(i.totalInterest)}`;
        cols[4].textContent = `${createNumberString(i.remainingBalance)}`;


        tableBody.appendChild(row);
    })

    let totalInterest = schedule[schedule.length - 1].totalInterest;

    document.getElementById("paymentAmount").innerHTML =
        schedule[schedule.length - 1].monthlyPayment;
    document.getElementById("loanAmount").innerHTML = `${createNumberString(loanAmount)}`;

    document.getElementById("totint").innerHTML = `${createNumberString(totalInterest)}`;
    let loantotal = loanAmount + totalInterest;
    document.getElementById("total").innerHTML = `${createNumberString(loantotal)}`;


}

function resetForm() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // clear form
            document.getElementById("inputForm").reset();
            document.getElementById("paymentsTableBody").innerHTML = "";
            schedule = [];
            enableUserinputs();
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })

}

function createNumberString(number) {
    let str = `$ ${number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    return str;
}

function disableUserinputs() {
    document.getElementById("inputLoanAmount").setAttribute("disabled", "");
    document.getElementById("inputLoanTerm").setAttribute("disabled", "");
    document.getElementById("inputInterestRate").setAttribute("disabled", "");
    document.getElementById("btnSubmit").setAttribute("disabled", "");
}

function enableUserinputs() {
    document.getElementById("inputLoanAmount").removeAttribute("disabled");
    document.getElementById("inputLoanTerm").removeAttribute("disabled");
    document.getElementById("inputInterestRate").removeAttribute("disabled");
    document.getElementById("btnSubmit").removeAttribute("disabled");
}