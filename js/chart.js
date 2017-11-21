function chart(option) {
    var XmaxPoint = 0;
    var XminPoint = 0;
    var YmaxPoint = 0;
    var YminPoint = 0;
    var Xmax = 0;
    var Ymax = 0;
    var maxTicks = 10;
    for (var i=0;i <option.series.length; i++) {
        for (var a=0;a<option.series[i].data.length; a++) {

            if (option.series[i].data[a]['x'] < XminPoint) {
                XminPoint = option.series[i].data[a]['x'];
            }

            if (option.series[i].data[a]['x'] > XmaxPoint) {
                XmaxPoint = option.series[i].data[a]['x'];
            }

            if (option.series[i].data[a]['y'] < YminPoint) {
                YminPoint = option.series[i].data[a]['y'];
            }

            if (option.series[i].data[a]['y'] > YmaxPoint) {
                YmaxPoint = option.series[i].data[a]['y'];
            }
        }
    }
    Xmax = XmaxPoint;
    Ymax = YmaxPoint;
    XmaxPoint = Math.round(XmaxPoint);
    XminPoint = Math.round(XminPoint);
    YmaxPoint = Math.round(YmaxPoint);
    YminPoint = Math.round(YminPoint);

    var Xtickrange = niceNum(XmaxPoint - XminPoint, false);
    var XtickSpacing = niceNum((XmaxPoint - XminPoint)/(maxTicks - 1), false);
    XminPoint = Math.floor(XminPoint / XtickSpacing) * XtickSpacing;
    XmaxPoint = Math.ceil(XmaxPoint / XtickSpacing) * XtickSpacing;

    var Ytickrange = niceNum(YmaxPoint - YminPoint, false);
    var YtickSpacing = niceNum((YmaxPoint - YminPoint)/(maxTicks - 1), false);

    YminPoint = Math.floor(YminPoint / YtickSpacing) * YtickSpacing;
    YmaxPoint = Math.ceil(YmaxPoint / YtickSpacing) * YtickSpacing;

    var c = document.getElementById(option.render.renderTo);
    var height = parseInt(c.getAttribute("height"));
    var width  = parseInt(c.getAttribute("width"));

    var ctx=c.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    var x = 40, y = 10,cwidth = width - 65,cheight = height - 53;
    if (option.xAxis.title.text != null) {

    }
    if (option.yAxis.title.text != null) {
        x = 60;
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#a1a1a1";
    ctx.strokeRect(x, y, cwidth, cheight);
    ctx.fillRect(x, y, cwidth, cheight);

    for (var i = 0; i <= YmaxPoint / YtickSpacing; i++) {
        var line = YmaxPoint / YtickSpacing;

        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline="middle";
        ctx.fillStyle = '#a1a1a1';
        ctx.fillText(nFormatter(YmaxPoint - YtickSpacing*i), x, (cheight/line)*i + y);
        if(i != 0) {
            ctx.beginPath();
            ctx.moveTo(x, (cheight/line)*i + y);
            ctx.lineTo(cwidth + x, (cheight/line)*i + y);
            ctx.strokeStyle = '#e6e6e6';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    for (var i = 1; i <= XmaxPoint / XtickSpacing; i++) {
        var line = XmaxPoint / XtickSpacing;

        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#a1a1a1';
        ctx.textBaseline = 'bottom';
        var number = Math.round((XtickSpacing*i)*10)/10;
        ctx.fillText(number,(cwidth/line)*i + x, y + cheight +15);

        ctx.beginPath();
        ctx.moveTo((cwidth/line)*i + x, y);
        ctx.lineTo((cwidth/line)*i + x, y + cheight);
        ctx.strokeStyle = '#e6e6e6';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    for (var i=0;i <option.series.length; i++) {
        ctx.beginPath();
        ctx.moveTo(x,y + cheight);

        for (var a=0;a < option.series[i].data.length; a++) {
            var tempx = (cwidth*option.series[i].data[a]['x'])/XmaxPoint+x;
            //alert(option.series[i].data[a]['y']);

            var tempy = (cheight*option.series[i].data[a]['y'])/YmaxPoint;
            tempy = (cheight - tempy) + y;
            ctx.lineTo(tempx, tempy);
        }
        ctx.lineTo(x + (Xmax*cwidth)/XmaxPoint,y + cheight);
        ctx.fillStyle = option.series[i].color;
        ctx.fill();
    }
    // copyright
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#CECECE';
    ctx.fillText("© Ghost0817",x +10, cheight);

    // get text x asix
    if (option.xAxis.title.text != null) {
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#404040';
        ctx.fillText(option.xAxis.title.text,width / 2, height - 10);
    }
    // get text y asix
    if (option.yAxis.title.text != null) {
        ctx.rotate( (Math.PI / 180) * 90);
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#404040';
        ctx.fillText(option.yAxis.title.text,height / 2, -5);
    }
    ctx.rotate( (Math.PI / 180) * 270);
};

function niceNum(range, round) {
    var exponent; /** exponent of range */
    var fraction; /** fractional part of range */
    var niceFraction; /** nice, rounded fraction */

    var log10Range = Math.log(range) / Math.log(10);
    exponent = Math.floor(log10Range);
    fraction = range / Math.pow(10, exponent);

    if (round) {
        if (fraction < 1.5)
            niceFraction = 1;
        else if (fraction < 3)
            niceFraction = 2;
        else if (fraction < 7)
            niceFraction = 5;
        else
            niceFraction = 10;
    } else {
        if (fraction <= 1)
            niceFraction = 1;
        else if (fraction <= 2)
            niceFraction = 2;
        else if (fraction <= 5)
            niceFraction = 5;
        else
            niceFraction = 10;
    }
    return niceFraction * Math.pow(10, exponent);
}
function formatMoney(num){
    var p = num.toFixed(2).split(".");
    return (p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1]).replace('.00','');
}

function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.split(separator);
    if (arrayOfStrings.length == 1)
        arrayOfStrings[1] = '00₮';
    return arrayOfStrings;
}
//Энэ урт хэмжээний тоог байгасгаж үсгээр орлуулж байгаа хэсэг
function nFormatter(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}