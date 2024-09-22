
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

const keyC0 = document.getElementById("key-C0");
const keyDb0 = document.getElementById("key-Db0");
const keyD0 = document.getElementById("key-D0");
const keyEb0 = document.getElementById("key-Eb0");
const keyE0 = document.getElementById("key-E0");
const keyF0 = document.getElementById("key-F0");
const keyGb0 = document.getElementById("key-Gb0");
const keyG0 = document.getElementById("key-G0");
const keyAb0 = document.getElementById("key-Ab0");
const keyA0 = document.getElementById("key-A0");
const keyBb0 = document.getElementById("key-Bb0");
const keyB0 = document.getElementById("key-B0");
const keyC1 = document.getElementById("key-C1");
const keyDb1 = document.getElementById("key-Db1");
const keyD1 = document.getElementById("key-D1");
const keyEb1 = document.getElementById("key-Eb1");
const keyE1 = document.getElementById("key-E1");
const keyF1 = document.getElementById("key-F1");
const keyGb1 = document.getElementById("key-Gb1");
const keyG1 = document.getElementById("key-G1");
const keyAb1 = document.getElementById("key-Ab1");
const keyA1 = document.getElementById("key-A1");
const keyBb1 = document.getElementById("key-Bb1");
const keyB1 = document.getElementById("key-B1");

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
	switch (keyCode) {
		case startingC + 0:
			return keyC0;
		case startingC + 1:
			return keyDb0;
		case startingC + 2:
			return keyD0;
		case startingC + 3:
			return keyEb0;
		case startingC + 4:
			return keyE0;
		case startingC + 5:
			return keyF0;
		case startingC + 6:
			return keyGb0;
		case startingC + 7:
			return keyG0;
		case startingC + 8:
			return keyAb0;
		case startingC + 9:
			return keyA0;
		case startingC + 10:
			return keyBb0;
		case startingC + 11:
			return keyB0;
		case startingC + 12:
			return keyC1;
		case startingC + 13:
			return keyDb1;
		case startingC + 14:
			return keyD1;
		case startingC + 15:
			return keyEb1;
		case startingC + 16:
			return keyE1;
		case startingC + 17:
			return keyF1;
		case startingC + 18:
			return keyGb1;
		case startingC + 19:
			return keyG1;
		case startingC + 20:
			return keyAb1;
		case startingC + 21:
			return keyA1;
		case startingC + 22:
			return keyBb1;
		case startingC + 23:
			return keyB1;
		default:
			return null;
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

main();
