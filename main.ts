/**
 * Knopf B:
 * 
 *   == Ausschalten ertönender Alarm ==
 * 
 * - Schaltet einen ausgelösten Alarm aus
 * 
 * - Schaltet dabei alle Töne ab und setzt den Alarmstatus auf "Sleeping"
 */
/**
 * Kopf A+B: ( = "Leiser Alarm") => Kein Ton, wenn Alarm !
 * 
 * == Schaltet nur das Ertönen eines Sounds ab ==
 * 
 * - anhalten aller Soundeffekte
 * 
 * - Setzt "playSound" auf "false", damit keine Töne gespielt werden (siehe Dauerschleife)
 */
/**
 * Knopf A: 
 * 
 *    ==Scharf schalten / Entschärfen der Alarmanlage==
 * 
 * - Stoppt ertönende Soundeffekte
 * 
 * - Deaktiviert / Aktiviert alle Alarme für die Zukunft
 */
input.onButtonPressed(Button.A, function () {
    if (alarmAktiv == true) {
        playSound = false
        alarmAktiv = false
    } else {
        playSound = true
        alarmAktiv = true
    }
    alarmAusgeloest = 0
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    basic.pause(2000)
})
input.onButtonPressed(Button.AB, function () {
    if (playSound == true) {
        playSound = false
    } else {
        playSound = true
    }
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    basic.pause(2000)
})
input.onButtonPressed(Button.B, function () {
    alarmAusgeloest = 0
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    basic.pause(2000)
})
let value = 0
let playSound = false
let alarmAusgeloest = 0
let alarmAktiv = false
alarmAktiv = true
alarmAusgeloest = 0
playSound = true
bluetooth.startUartService()
/**
 * <- Sendet nur dann das Alarmsignal, wenn Alarm scharf gestellt ist (alarmAktiv)
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
            music.stopAllSounds()
        } else {
            bluetooth.uartWriteString("ja")
            serial.writeLine("ja")
            if (playSound == true) {
                basic.showLeds(`
                    # # # # #
                    . . . . #
                    . . . . #
                    # . . . #
                    . # # # .
                    `)
                music.play(music.tonePlayable(523, music.beat(BeatFraction.Half)), music.PlaybackMode.LoopingInBackground)
            } else {
                basic.showLeds(`
                    # # # # #
                    . . . . #
                    . . # . #
                    # . . . #
                    . # # # .
                    `)
                music.stopAllSounds()
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
    basic.pause(10)
})
