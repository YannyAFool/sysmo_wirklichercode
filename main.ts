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
input.onButtonPressed(Button.A, function () {
    alarmAusgeloest = 0
    music.stopAllSounds()
    if (alarmAktiv == true) {
        alarmAktiv = false
        playSound = false
    } else {
        alarmAktiv = true
        playSound = true
    }
})
input.onButtonPressed(Button.AB, function () {
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    if (playSound == true) {
        playSound = false
    } else {
        playSound = true
    }
})
input.onButtonPressed(Button.B, function () {
    alarmAusgeloest = 0
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    playSound = false
})
let value = 0
let playSound = false
let alarmAusgeloest = 0
let alarmAktiv = false
alarmAktiv = true
alarmAusgeloest = 0
playSound = false
bluetooth.startUartService()
/**
 * <- Sendet nur dann das Alarmsignal, wenn Alarm scharf gestellt ist (alarmAktiv)
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
            if (playSound == true) {
                basic.showLeds(`
                    # # # # #
                    . . . . #
                    . . . . #
                    # . . . #
                    . # # # .
                    `)
                music.play(music.tonePlayable(262, music.beat(BeatFraction.Half)), music.PlaybackMode.LoopingInBackground)
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
    basic.pause(100)
})
