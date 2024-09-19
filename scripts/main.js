
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
				// Access granted.
				// alert("gRanted");
				console.log("gRanted");
			} else if (result.state === "prompt") {
				// Using API will prompt for permission
				// alert("pRompt");
				console.log("pRompt");
			}

			// alert("dEnied");
			console.log("dEnied");
			// Permission was denied by user prompt or permission policy
		});
	}
}

main();
