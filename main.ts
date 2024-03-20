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
    if (alarmAusgeloest == 0) {
        bluetooth.uartWriteString("nein")
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    } else {
        if (alarmAktiv == true) {
            basic.showLeds(`
                . . # . .
                . . # . .
                . . # . .
                . . . . .
                . . # . .
                `)
            bluetooth.uartWriteString("ja")
            if (alarmPlaying != true) {
                music.play(music.tonePlayable(262, music.beat(BeatFraction.Half)), music.PlaybackMode.LoopingInBackground)
                alarmPlaying = true
            }
        }
    }
    basic.pause(100)
})
