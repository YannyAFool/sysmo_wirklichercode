/**
 * (NICHT MEHR UNTERSTÜTZT !)
 * 
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
        alarmAktiv = false
    } else {
        alarmAktiv = true
    }
    alarmAusgeloest = false
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    basic.pause(2000)
})
/**
 * Knopf B:
 * 
 *   == Ausschalten ertönender Alarm ==
 * 
 * - Schaltet einen ausgelösten Alarm aus
 * 
 * - Schaltet dabei alle Töne ab und setzt den Alarmstatus auf "Sleeping"
 */
input.onButtonPressed(Button.B, function () {
    alarmAusgeloest = false
    music.stopAllSounds()
    music.stopMelody(MelodyStopOptions.All)
    basic.pause(2000)
})
let value = 0
let alarmAusgeloest = false
let alarmAktiv = false
alarmAktiv = true
alarmAusgeloest = false
bluetooth.startUartService()
/**
 * <- Sendet nur dann das Alarmsignal, wenn Alarm scharf gestellt ist (alarmAktiv)
 */
basic.forever(function () {
    value = pins.analogReadPin(AnalogPin.P1)
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
