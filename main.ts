input.onButtonPressed(Button.A, function () {
    alarmAusgeloest = 0
    music.stopAllSounds()
    if (alarmAktiv == true) {
        alarmAktiv = false
    } else {
        alarmAktiv = true
    }
})
input.onButtonPressed(Button.B, function () {
    alarmAusgeloest = 0
    music.stopAllSounds()
    if (alarmPlaying == true) {
        alarmPlaying = false
        music.stopMelody(MelodyStopOptions.All)
    }
})
let value = 0
let alarmPlaying = false
let alarmAusgeloest = 0
let alarmAktiv = false
alarmAktiv = true
alarmAusgeloest = 0
alarmPlaying = false
bluetooth.startUartService()
/**
 * <- Sendet nur Bluetooth, wenn Alarm scharf gestellt ist
 */
basic.forever(function () {
    value = pins.analogReadPin(AnalogPin.P1)
    if (value != 0) {
        alarmAusgeloest = 1
    }
    if (alarmAktiv == true) {
        if (alarmAusgeloest == 0) {
            bluetooth.uartWriteString("nein")
            serial.writeLine("nein")
            basic.showLeds(`
                # . . . #
                # # . . #
                # . # . #
                # . . # #
                # . . . #
                `)
        } else {
            bluetooth.uartWriteString("ja")
            serial.writeLine("ja")
            basic.showLeds(`
                # # # # #
                . . . . #
                . . . . #
                # . . . #
                . # # # .
                `)
            if (alarmPlaying != true) {
                music.play(music.tonePlayable(262, music.beat(BeatFraction.Half)), music.PlaybackMode.LoopingInBackground)
                alarmPlaying = true
            }
        }
    } else {
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
        bluetooth.uartWriteString("unscharf")
        serial.writeLine("unscharf")
    }
    basic.pause(100)
})
