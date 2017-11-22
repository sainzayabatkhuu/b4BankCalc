window.onload = chart_init;

function chart_init() {
    validation();
    calculator();
};

function validation(){
    if(!isNaN(document.getElementById("propertyPrice").value.replace('$', '')) && 100000 > parseInt(document.getElementById("propertyPrice").value.replace('$', '')) && parseInt(document.getElementById("propertyPrice").value.replace('$', '')) > 150000000 ) {
        document.getElementById("propertyPrice").value = '$375000';
    }
    if(!isNaN(document.getElementById("deposit").value.replace('$', '')) && 100000 > parseInt(document.getElementById("deposit").value.replace('$', '')) && parseInt(document.getElementById("deposit").value.replace('$', '')) > 150000000 ) {
        document.getElementById("deposit").value = '$75000';
    }
    if(!isNaN(document.getElementById("loanAmount").value.replace('$', '')) && 100000 > parseInt(document.getElementById("loanAmount").value.replace('$', '')) && parseInt(document.getElementById("loanAmount").value.replace('$', '')) > 150000000 ) {
        document.getElementById("loanAmount").value = '$300000';
    }
    if(!isNaN(document.getElementById("interestRate").value.replace('%', '')) && 1 > parseInt(document.getElementById("interestRate").value.replace('%', '')) && parseInt(document.getElementById("interestRate").value.replace('%', '')) > 5.52 ) {
        document.getElementById("interestRate").value = '5.52%';
    }

    if(!isNaN(document.getElementById("loanTerm").value.replace(' years', '')) && 1 > parseInt(document.getElementById("loanTerm").value.replace(' years', '')) && parseInt(document.getElementById("loanTerm").value.replace(' years', '')) > 30 ) {
        document.getElementById("loanTerm").value = '30 years';
    }
};

function calculator() {

    /*  */
    var propertyPrice    = parseFloat(document.getElementById("propertyPrice").value.replace('$', ''));
    var deposit    = parseFloat(document.getElementById("deposit").value.replace('$', ''));
    var amount    = parseFloat(document.getElementById("loanAmount").value.replace('$', ''));
    var rate      = parseFloat(document.getElementById("interestRate").value.replace('%', '')) / 100;
    var time      = parseFloat(document.getElementById("loanTerm").value.replace(' years', '')) * 12;
    var repayment = Math.pow(1 + rate,time);
    repayment     = 1 - 1/repayment;
    repayment     = repayment/rate;
    repayment     = amount/repayment;
    var calcTotal = repayment * time;
    var calcAm    = amount;
    var data1     = new Array();
    var data2     = new Array();
    var totalInterest = 0;

    for (var i = 0;i <= time;i++) {
        if (i != 0) {
            calcAm = calcAm - (repayment-(calcAm * rate));
        }
        data1.push({'x' : (i/12), 'y' : calcAm});
    }

    calcAm    = amount;
    for (var i = 0;i <= time;i++) {
        totalInterest = totalInterest + (calcAm * rate );
        calcAm = calcAm - (repayment-(calcAm * rate));
    }
    calcTotal = totalInterest + amount;
    //document.getElementById('calculator_rent_overlay_golomt-main-result-amount').innerHTML = '$'+ formatMoney(calcTotal);
    calcAm    = amount;

    for (var i = 0; i <= time; i++) {
        var money = 0;
        if (i != 0) {
            money = calcTotal - repayment;
            calcTotal = calcTotal - repayment;
            calcAm = calcAm - (repayment-(calcAm * rate));
        }
        else
            money = calcTotal;
        data2.push({'x' : i/12, 'y' : money});
    }
    new chart({
        render:{
            renderTo : 'graphic_contant'
        },
        xAxis:{
            title: { text:'Years elapsed' }
        },
        yAxis:{
            title: { text: undefined }
        },
        series:[
            {
                color: '#BFBFBF',
                data: data2
            },{
                color: '#CB0E29',
                data: data1
            }
        ],
        calc:{
            loan_amount : amount,
            loan_rate : rate,
            loan_time : time
        }
    });
};