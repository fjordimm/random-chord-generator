
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
		// navigator.permissions.query({ name: "midi", sysex: true }).then((result) => {
		// 	if (result.state === "granted") {
		// 		console.log("gRanted");
		// 	} else if (result.state === "prompt") {
		// 		console.log("pRompt");
		// 	}
			
		// 	console.log("dEnied");
		// });

		// navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
	}
}

const keyColorBlack = window.getComputedStyle(document.getElementById("key-Db0")).getPropertyValue("background-color");
const keyColorWhite = window.getComputedStyle(document.getElementById("key-C0")).getPropertyValue("background-color");
const keyColorHighlight = window.getComputedStyle(document.getElementById("key-highlight-color")).getPropertyValue("background-color");

const keyC0 = document.getElementById("key-C0");
const keyDb0 = document.getElementById("key-Db0");
const keyD0 = document.getElementById("key-D0");

function whenMidiAvailable(midiAccess) {
	if (midiAccess) {
		console.log("ahh");
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
		message += `0x${character.toString(16)} `;
	}
	console.log(message);
}

main();

// console.log(keyColorBlack);
// keyDb0.style.backgroundColor = keyColorHighlight;
// keyD0.style.backgroundColor = keyColorHighlight;
