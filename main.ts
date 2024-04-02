/**
 * Knopf A: 
 * 
 *    ==Scharf schalten / Entschärfen der Alarmanlage==
 * 
 * - Stoppt ertönende Soundeffekte
 * 
 * - Deaktiviert / Aktiviert alle Alarme für die Zukunft
 */
/**
 * Knopf B:
 * 
 *   == Ausschalten ertönender Alarm ==
 * 
 * - Schaltet einen ausgelösten Alarm aus
 * 
 * - Schaltet dabei alle Töne ab und setzt den Alarmstatus auf "Sleeping"
 */
function Pausiere (Zeit: number) {
    images.createBigImage(`
        . . # . # . # . # .
        . # . # . # . # . #
        # . # . # . # . # .
        . # . # . # . # . #
        . . # . # . # . # .
        `).scrollImage(1, 500)
    basic.pause(Zeit)
    safePause = false
}
input.onButtonPressed(Button.A, function () {
    if (alarmAktiv == true) {
        alarmAktiv = false
    } else {
        alarmAktiv = true
    }
    alarmAusgeloest = false
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    basic.showLeds(`
        . # # # .
        # . . . .
        # . . . .
        # . . . .
        . # # # .
        `)
    basic.pause(500)
    safePause = true
})
input.onButtonPressed(Button.B, function () {
    alarmAusgeloest = false
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    basic.showLeds(`
        # # # # .
        # . . # .
        # # # # .
        # . # . .
        # . . # .
        `)
    basic.pause(500)
    safePause = true
})
let value = 0
let safePause = false
let alarmAusgeloest = false
let alarmAktiv = false
alarmAktiv = false
alarmAusgeloest = false
bluetooth.startUartService()
Pausiere(3000)
/**
 * <- Sendet nur dann das Alarmsignal, wenn Alarm scharf gestellt ist (alarmAktiv)
 */
basic.forever(function () {
    if (safePause == true) {
        Pausiere(3000)
    }
    value = pins.analogReadPin(AnalogPin.P1)
    serial.writeLine("" + (value))
    if (value != 0) {
        alarmAusgeloest = true
    }
    if (alarmAktiv == true) {
        if (alarmAusgeloest == false) {
            bluetooth.uartWriteString("nein")
            serial.writeLine("nein")
            basic.showLeds(`
                # . . . #
                # # . . #
                # . # . #
                # . . # #
                # . . . #
                `)
            music.stopAllSounds()
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
            music.play(music.tonePlayable(523, music.beat(BeatFraction.Half)), music.PlaybackMode.LoopingInBackground)
        }
    } else {
        music.stopAllSounds()
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
})
control.inBackground(function () {
	
})
