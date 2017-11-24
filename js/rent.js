window.onload = chart_init;

function chart_init() {
    calculator();
};

function rentAmountValidation() {
    if(430 > parseFloat(document.getElementById("rentAmount").value.replace('$', ''))) {
        document.getElementById("rentAmount").value = '$430';
    }
    if(parseFloat(document.getElementById("rentAmount").value.replace('$', '')) > 150000000 ) {
        document.getElementById("rentAmount").value = '$50000000';
    }
};

function rateValidation() {
    // for Rate
    if(isNaN(document.getElementById("interestRate").value.replace('%', ''))) {
        document.getElementById("interestRate").value = '0.01 %';
    }
    if(parseFloat(document.getElementById("interestRate").value.replace('%', '')) <= 0) {
        document.getElementById("interestRate").value = '0.01 %';
    }
    if(parseFloat(document.getElementById("interestRate").value.replace('%', '')) > 5.52 ) {
        document.getElementById("interestRate").value = '5.52 %';
    }
};

function loanTermValidation() {

    if(1 > parseInt(document.getElementById("loanTerm").value.replace('years', ''))) {
        document.getElementById("loanTerm").value = '1 years';
    }
    if(parseInt(document.getElementById("loanTerm").value.replace('years', '')) > 30 ) {
        document.getElementById("loanTerm").value = '30 years';
    }
};

function calculator() {

    /*  */
    var amount    = parseFloat(document.getElementById("rentAmount").value.replace('$', ''));
    //var rate      = parseFloat(document.getElementById("interestRate").value.replace('%', '')) / 100;
    var rate      = (parseFloat(document.getElementById("interestRate").value.replace('%', '')) / 100 / 365);
    var time      = parseFloat(document.getElementById("loanTerm").value.replace(' years', '')) * 12;
    var mounth    = 365/12;
    var repayment = 0;
    var repayment_sum = 0;
    var calcTotal = repayment * time;
    var calcAm    = amount;
    var data1     = new Array();
    var data2     = new Array();
    var totalInterest = 0;

    for (var i = 1;i <= time;i++) {
        if (i != 1) {
            repayment = 1 / ( rate * mounth + 1 ) * repayment;
        } else {
            repayment = 1 / ( rate * mounth + 1 );
        }
        repayment_sum += repayment;
    }
    repayment = amount / repayment_sum;

    /**
     *
     * Link: https://www.thebalance.com/loan-payment-calculations-315564
     *
     * n = year * 12
     * i = rate / 12 / 100
     * d = ({[(1+.005)^360] - 1} / [.005(1+.005)^360])
     * P = A / d
     *
     *
     */


    /**
     *
     * Link: http://teachertech.rice.edu/Participants/bchristo/lessons/carpaymt.html
     *
     * n = year * 12
     * i = rate / 100
     *
     *        A ( i / 12 )
     * --------------------------
     *                     -n
     *  (1 - ( 1 + i / 12 )   )
     *
     */

    // for (var i = 0;i <= time;i++) {
    //     if (i != 0) {
    //         //calcAm = amount / ( ( Math.pow((1 + rate), i) - 1) / (rate * Math.pow((1 + rate), i) ) );
    //         //calcAm = (amount * (rate / 12)) / ( 1 - Math.pow( (1 + rate/12), (i * -1)) );
    //         calcAm = calcAm - (repayment-(calcAm * rate));
    //         console.log(calcAm);
    //     }
    //     data1.push({'x' : (i/12), 'y' : calcAm});
    // }
    for (var i = 0;i <= time;i++) {
        if (i != 0) {
            calcAm = calcAm - (repayment-(calcAm * rate * mounth));
        }
        data1.push({'x' : (i), 'y' : calcAm});
    }


    calcAm    = amount;
    for (var i = 0;i <= time;i++) {
        totalInterest = totalInterest + (calcAm * rate * mounth);
        calcAm = calcAm - (repayment-(calcAm * rate * mounth));
    }
    calcTotal = totalInterest + amount;
    calcAm    = amount;
    document.getElementById('calculator_rent_overlay_golomt-main-result-amount').innerHTML = '$'+ formatMoney(repayment);

    //өрхий оролого бодож байгаа хэсэг энийг хаавал нийт хүүгийн төлөлт гарна.
    totalInterest = ( repayment * 100 ) / 45;

    for (var i = 0;i <= time;i++) {
        var money = 0;
        if (i != 0) {
            money = calcTotal - repayment;
            calcTotal = calcTotal - repayment;
            calcAm = calcAm - (repayment-(calcAm * rate * mounth));
        }
        else
            money = calcTotal;
        data2.push({'x' : i, 'y' : money});
    }

    new chart({
        render:{
            renderTo : 'graphic_contant',
            lang : 'en'
        },
        xAxis:{
            title: { text:'Years elapsed' }
        },
        yAxis:{
            title: { text: undefined }
        },
        series:[
            {
                color: '#000000',
                data: data2
            },{
                color: '#ED0000',
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