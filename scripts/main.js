
const midiKeydownArray = [];
for (let i = 0; i <= 127; i++) { midiKeydownArray[i] = false; }
let midiPedalIsDown = false;

let currentChordNotes = [];

const pianoElem = document.getElementById("piano");
const pedalCheckbox = document.getElementById("pedal-checkbox");

const sliderMajor = document.querySelector("#slider-major");
const sliderMinor = document.querySelector("#slider-minor");
const sliderDiminished = document.querySelector("#slider-diminished");
const sliderMajor7 = document.querySelector("#slider-major7");
const sliderDominant7 = document.querySelector("#slider-dominant7");
const sliderMinor7 = document.querySelector("#slider-minor7");
const sliderHalfDiminished7 = document.querySelector("#slider-half-diminished7");
const sliderDiminished7 = document.querySelector("#slider-diminished7");
const chordTextarea = document.getElementById("chord-textarea");

function main()
{
    if (!window.isSecureContext)
    {
        alert("Window is not in a 'secure context'.");
    }
    else
    {
        // navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

        for (let i = 0; i < 12; i++)
        {
            keyElem = document.getElementById(`key_${i}`);

            keyElem.addEventListener("mousedown", () =>
            { whenNoteDown(i); });

            document.addEventListener("mouseup", () =>
            { whenNoteUp(i); });
        }

        generateRandomChord();
    }
}

function onMIDISuccess(midiAccess)
{
    whenMidiAvailable(midiAccess);
}

function onMIDIFailure(msg)
{
    alert("Midi access was denied (see console for more details).");
    console.error(`Failed to get MIDI access - ${msg}`);
}

function whenMidiAvailable(midiAccess)
{
    if (midiAccess)
    {
        midiAccess.inputs.forEach((entry) =>
        {
            entry.onmidimessage = onMidiMsg;
        });
    } else
    {
        alert("MIDIAccess object was not initialized.");
    }
}

function onMidiMsg(event)
{
    let message = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
    for (const character of event.data)
    {
        message += `${character.toString()} `;
    }
    // console.log(message);

    let action = null;
    if (event.data[0] == 144) { action = "down"; }
    if (event.data[0] == 128) { action = "up"; }
    if (event.data[0] == 176) { action = "pedal"; }
    let keyCode = event.data[1];
    let velocity = event.data[2];

    onMidiKeyPress(action, keyCode, velocity);
}

function onMidiKeyPress(action, keyCode, velocity)
{
    if (action === "down")
    {
        midiKeydownArray[keyCode] = true;

        let keyElem = codeToKeyElem(keyCode);
        if (!keyElem)
        {
            console.warn(`The key code ${keyCode} does not correspond to an existing html element.`);
        } else
        {
            const isCorrect = currentChordNotes.includes((keyCode - startingC) % 12);
            keyElem.style.backgroundColor = isCorrect ? keyColorCorrect : keyColorIncorrect;
        }
    } else if (action === "up")
    {
        midiKeydownArray[keyCode] = false;

        let keyElem = codeToKeyElem(keyCode);
        if (!keyElem)
        {
            console.warn(`The key code ${keyCode} does not correspond to an existing html element.`);
        } else
        {
            keyElem.style.backgroundColor = isBlackNote(keyCodeToNote(keyCode)) ? keyColorBlack : keyColorWhite;
        }
    } else if (action === "pedal")
    {
        if (keyCode === 64)
        {
            midiPedalIsDown = velocity !== 0;

            if (midiPedalIsDown)
            {
                if (pedalCheckbox.checked)
                {
                    generateRandomChord();
                }
            }
        }
    }
}

function whenNoteDown(note)
{
    if (currentChordNotes.includes(note))
    {
        document.getElementById(`key_${note}`).classList.add("correct");
    } else
    {
        document.getElementById(`key_${note}`).classList.add("incorrect");
    }
}

function whenNoteUp(note)
{
    document.getElementById(`key_${note}`).classList.remove("correct");
    document.getElementById(`key_${note}`).classList.remove("incorrect");
}

function generateRandomChord()
{
    const root = Math.floor(Math.random() * 12);
    const noteName = noteValToName(root, (Math.floor(Math.random() * 2) === 0) ? false : true);

    const suffixAndIntervals = getSuffixAndIntervals();
    const suffix = suffixAndIntervals[0];
    const intervals = suffixAndIntervals[1];

    chordTextarea.innerHTML = noteName + " " + suffix;

    currentChordNotes = [];
    for (const interval of intervals)
    {
        currentChordNotes.push((root + interval) % 12);
    }
}

function noteValToName(val, sharpInsteadOfFlat = false)
{
    switch (val)
    {
        case 0:
            return "C";
        case 1:
            return sharpInsteadOfFlat ? "C#" : "Db";
        case 2:
            return "D";
        case 3:
            return sharpInsteadOfFlat ? "D#" : "Eb";
        case 4:
            return "E";
        case 5:
            return "F";
        case 6:
            return sharpInsteadOfFlat ? "F#" : "Gb";
        case 7:
            return "G";
        case 8:
            return sharpInsteadOfFlat ? "G#" : "Ab";
        case 9:
            return "A";
        case 10:
            return sharpInsteadOfFlat ? "A#" : "Bb";
        case 11:
            return "B";
        default:
            return "(ErrorNote)";
    }
}

function getSuffixAndIntervals()
{
    const weightMajor = parseInt(sliderMajor.value);
    const weightMinor = parseInt(sliderMinor.value);
    const weightDiminished = parseInt(sliderDiminished.value);
    const weightMajor7 = parseInt(sliderMajor7.value);
    const weightDominant7 = parseInt(sliderDominant7.value);
    const weightMinor7 = parseInt(sliderMinor7.value);
    const weightHalfDiminished7 = parseInt(sliderHalfDiminished7.value);
    const weightDiminished7 = parseInt(sliderDiminished7.value);
    let randVal = Math.random() * (weightMajor + weightMinor + weightDiminished + weightMajor7 + weightDominant7 + weightMinor7 + weightHalfDiminished7 + weightDiminished7);
    {
        randVal -= weightMajor;
        if (randVal < 0)
        {
            return ["", [0, 4, 7]];
        }

        randVal -= weightMinor;
        if (randVal < 0)
        {
            return ["m", [0, 3, 7]];
        }

        randVal -= weightDiminished;
        if (randVal < 0)
        {
            return ["dim", [0, 3, 6]];
        }

        randVal -= weightMajor7;
        if (randVal < 0)
        {
            return ["M7", [0, 4, 7, 11]];
        }

        randVal -= weightDominant7;
        if (randVal < 0)
        {
            return ["7", [0, 4, 7, 10]];
        }

        randVal -= weightMinor7;
        if (randVal < 0)
        {
            return ["m7", [0, 3, 7, 10]];
        }

        randVal -= weightHalfDiminished7;
        if (randVal < 0)
        {
            return ["hdim7", [0, 3, 6, 10]];
        }

        randVal -= weightDiminished7;
        if (randVal < 0)
        {
            return ["dim7", [0, 3, 6, 9]];
        }
    }

    return "(ErrorSuffix)";
}

main();
