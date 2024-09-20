
function onMIDISuccess(midiAccess) {
	whenMidiAvailable(midiAccess);
}
function onMIDIFailure(msg) {
	alert("Midi access was denied (see console for more details).");
	console.error(`Failed to get MIDI access - ${msg}`);
}

function main() {
	const thing = document.getElementById("thing");
	thing.innerHTML = "Wowza";

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

		navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

		
	}
}

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

// main();
