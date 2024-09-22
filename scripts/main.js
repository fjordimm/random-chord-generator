
function onMIDISuccess(midiAccess) {
	whenMidiAvailable(midiAccess);
}

function onMIDIFailure(msg) {
	alert("Midi access was denied (see console for more details).");
	console.error(`Failed to get MIDI access - ${msg}`);
}

function main() {
	if (!window.isSecureContext)
	{
		alert("Window is not in a 'secure context'.");
	}
	else
	{
		navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
	}
}

function whenMidiAvailable(midiAccess) {
	if (midiAccess) {
		midiAccess.inputs.forEach((entry) => {
			entry.onmidimessage = onMidiMsg;
		});
	} else {
		alert("MIDIAccess object was not initialized.");
	}
}

function onMidiMsg(event) {
	let message = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
	for (const character of event.data) {
		message += `${character.toString()} `;
	}
	console.log(message);

	let downOrUp = null;
	if (event.data[0] == 144) { downOrUp = "down"; }
	if (event.data[0] == 128) { downOrUp = "up"; }
	let keyCode = event.data[1];
	let velocity = event.data[2];

	onMidiKeyPress(downOrUp, keyCode, velocity);
}

const keyColorBlack = window.getComputedStyle(document.getElementsByClassName("key-top")[0]).getPropertyValue("background-color");
const keyColorWhite = window.getComputedStyle(document.getElementsByClassName("key-bottom")[0]).getPropertyValue("background-color");
const keyColorHighlight = window.getComputedStyle(document.getElementsByClassName("key-highlight-color")[0]).getPropertyValue("background-color");
const keyColorCorrect = window.getComputedStyle(document.getElementsByClassName("key-correct-color")[0]).getPropertyValue("background-color");
const keyColorIncorrect = window.getComputedStyle(document.getElementsByClassName("key-incorrect-color")[0]).getPropertyValue("background-color");

const pianoTopElem = document.getElementById("piano-top-elem");
const pianoBottomElem = document.getElementById("piano-bottom-elem");

const numOctaves = 4;
const keyElemArray = [];
{
	for (let octave = 0; octave < numOctaves; octave++) {
		keyElemArray[12 * octave +  0] = pianoBottomElem.children[7 * octave + 0];
		keyElemArray[12 * octave +  1] = pianoTopElem.children[12 * octave + 1];
		keyElemArray[12 * octave +  2] = pianoBottomElem.children[7 * octave + 1];
		keyElemArray[12 * octave +  3] = pianoTopElem.children[12 * octave + 3];
		keyElemArray[12 * octave +  4] = pianoBottomElem.children[7 * octave + 2];
		keyElemArray[12 * octave +  5] = pianoBottomElem.children[7 * octave + 3];
		keyElemArray[12 * octave +  6] = pianoTopElem.children[12 * octave + 6];
		keyElemArray[12 * octave +  7] = pianoBottomElem.children[7 * octave + 4];
		keyElemArray[12 * octave +  8] = pianoTopElem.children[12 * octave + 8];
		keyElemArray[12 * octave +  9] = pianoBottomElem.children[7 * octave + 5];
		keyElemArray[12 * octave + 10] = pianoTopElem.children[12 * octave + 10];
		keyElemArray[12 * octave + 11] = pianoBottomElem.children[7 * octave + 6];
	}
}

const keydownArray = [];
for (let i = 0; i <= 127; i++) {
	keydownArray[i] = false;
}

function onMidiKeyPress(downOrUp, keyCode, velocity) {
	if (downOrUp === "down") {
		keydownArray[keyCode] = true;

		let keyElem = codeToKeyElem(keyCode);
		if (!keyElem) {
			console.warn(`The key code ${keyCode} does not correspond to an existing html element.`);
		} else {
			keyElem.style.backgroundColor = keyColorCorrect;
		}
	} else if (downOrUp === "up") {
		keydownArray[keyCode] = false;

		let keyElem = codeToKeyElem(keyCode);
		if (!keyElem) {
			console.warn(`The key code ${keyCode} does not correspond to an existing html element.`);
		} else {
			keyElem.style.backgroundColor = isBlackNote(keyCodeToNote(keyCode)) ? keyColorBlack : keyColorWhite;
		}
	}
}

const startingC = 24;

function codeToKeyElem(keyCode) {
	const index = keyCode - startingC;
	if (index < 0 || index >= keyElemArray.length) {
		return null;
	} else {
		return keyElemArray[keyCode - startingC];
	}
}

function keyCodeToNote(keyCode) {
	return modNote(keyCode - startingC);
}

function modNote(note) {
	return note % 12;
}

function isBlackNote(note) {
	const realNote = modNote(note);

	return realNote === 1
	    || realNote === 3
	    || realNote === 6
	    || realNote === 8
	    || realNote === 10;
}

const chordTextarea = document.getElementById("chord-textarea");

function generateRandomChord() {
	chordTextarea.innerHTML = "woize";
}

main();
