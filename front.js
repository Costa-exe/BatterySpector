function retrive() {
    const req = new XMLHttpRequest();
    req.open("GET", "../../tmp/battery.json", true);
    req.send();
    req.onload = () => {
        const result = JSON.parse(req.responseText);
        if (result.hasBattery === false) {
            document.getElementById("warning").style.display = "block";
            document.getElementById("content").style.display = "none";
        } else {
            document.getElementById("warning").style.display = "none";
            document.getElementById("content").style.display = "block";
            // header batteria + %
            let batteryImg = document.getElementById("battery");
            let percentage = document.getElementById("percent");
            if (result.isCharging === true) {
                batteryImg.src = "./imgs/inCharge.svg";
                percentage.innerHTML = `Charging`;
            } else {
                percentage.innerHTML = `${result.percent} %`;
                if (result.percent > 75) {
                    batteryImg.src = "./imgs/batteria100.svg";
                } else if (result.percent > 50) {
                    batteryImg.src = "./imgs/batteria75.svg";
                } else if (result.percent > 25) {
                    batteryImg.src = "./imgs/batteria50.svg";
                } else if (result.percent > 15) {
                    batteryImg.src = "./imgs/batteria25.svg";
                } else {
                    batteryImg.src = "./imgs/batteria0.svg";
                }
            }
            // info
            let remaining = ((result.maxCapacity*100)/result.designedCapacity).toFixed(2);
            document.getElementById("desCap").innerHTML = `${result.designedCapacity} mWh`;
            document.getElementById("maxCap").innerHTML = `${result.maxCapacity} mWh`;
            document.getElementById("curCap").innerHTML = `${result.currentCapacity} mWh`;
            document.getElementById("voltage").innerHTML = `${result.voltage} V`;
            document.getElementById("rech").innerHTML = `${remaining} %`;
        }
    }
}

function mainLoander () {
    retrive();
    setInterval(() => {
        retrive();
    }, 1000);
}

window.onload = mainLoander;