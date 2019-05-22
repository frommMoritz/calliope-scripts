let lastIn = 0
let imLoop = 0
let totalRecv = 0
let debug = 0
let random = 0
let Ampelstatus = 0
function trigger()  {
    Ampelstatus += 1
    totalRecv += 1
    if (Ampelstatus > 7) {
        Ampelstatus = 0
    }
    render()
}
function rotAn()  {
    pins.digitalWritePin(DigitalPin.P0, 1)
    basic.setLedColor(Colors.Red)
}
function ampelAus()  {
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 0)
    pins.digitalWritePin(DigitalPin.P2, 0)
}
function loopTrigger()  {
    if (!(imLoop)) {
        imLoop = 1
        for (let i = 0; i < 2; i++) {
            masterTrigger()
            basic.pause(1500)
            masterTrigger()
            basic.pause(500)
            masterTrigger()
            basic.pause(5000)
            masterTrigger()
            basic.pause(2000)
        }
        imLoop = 0
    }
}
function debugView()  {
    basic.showNumber(Ampelstatus)
    basic.showNumber(totalRecv)
}
function broadcast()  {
    random = Math.random(100001) + 1
    for (let i = 0; i < 10; i++) {
        radio.sendNumber(random)
        basic.pause(50)
    }
}
function render()  {
    ampelAus()
    if (Ampelstatus == 0) {
        rotAn()
    } else if (Ampelstatus == 1) {
        gelbAn()
    } else if (Ampelstatus == 2) {
        grünAn()
    } else if (Ampelstatus == 3) {
        gelbAn()
    } else {
        rotAn()
    }
}
function masterTrigger()  {
    trigger()
    broadcast()
    basic.pause(100)
}
function rotGelb()  {
    rotAn()
    gelbAn()
    basic.setLedColor(Colors.Orange)
}
input.onButtonPressed(Button.A, () => {
    loopTrigger()
})
function gelbAn()  {
    pins.digitalWritePin(DigitalPin.P1, 1)
    basic.setLedColor(Colors.Yellow)
}
input.onPinPressed(TouchPin.P3, () => {
    loopTrigger()
})
input.onButtonPressed(Button.B, () => {
    debugView()
})
function grünAn()  {
    pins.digitalWritePin(DigitalPin.P2, 1)
    basic.setLedColor(Colors.Green)
}
input.onButtonPressed(Button.AB, () => {
    trigger()
})
radio.onDataPacketReceived( ({ receivedNumber: _in }) =>  {
    if (_in != lastIn) {
        lastIn = _in
        trigger()
    }
})
debug = 0
radio.setGroup(19)
radio.setTransmitPower(7)
lastIn = -100
render()
