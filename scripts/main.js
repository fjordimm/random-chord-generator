
function main() {
	const thing = document.getElementById("thing");
	thing.innerHTML = "Wowza";

	if (!window.isSecureContext)
	{
		alert("Window is not in a 'secure context'.");
	}
	else
	{
		navigator.permissions.query({ name: "midi", sysex: true }).then((result) => {
			if (result.state === "granted") {
				console.log("gRanted");
			} else if (result.state === "prompt") {
				console.log("pRompt");
			}
			
			console.log("dEnied");
		});

		navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
	}
}

let globalMidi = null; // global MIDIAccess object
function onMIDISuccess(midiAccess) {
  console.log("MIDI ready!");
  globalMidi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
}
function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

main();
