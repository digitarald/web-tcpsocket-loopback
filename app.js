'use strict';

// WebIDE didn't free port on refresh which throws an "out of memory".
// See bug 1057538
const PORT = 8000 + Math.round(Math.random() * 8000);

// Server: Listen a socket
function serve() {
	debug('serve', PORT);
	let server = navigator.mozTCPSocket.listen(PORT);
	server.onconnect = (serverSocket) => {
		debug('serverSocket::onconnect');
		serverSocket.ondata = (event) => {
			debug('serverSocket::ondata', event.data);
			// Send the same data back
			let payload = event.data;
			serverSocket.send(payload);
			// Close serverSocket, HTTP style
			serverSocket.close();
		};

	};
	server.onerror = (event) => {
		debug('server::onerror', event.data);
	};

	send();
}

// Client: Open a socket
function send() {
	debug('send');
	let clientSocket = navigator.mozTCPSocket.open('127.0.0.1', PORT);

	// Connection established
	clientSocket.onopen = () => {
		debug('clientSocket::onopen');
		// Send payload
		clientSocket.send('Hello World');
	};
	clientSocket.ondata = (event) => {
		debug('clientSocket::ondata', event.data);
	};
	clientSocket.onerror = (err) => {
		debug('clientSocket::onerror', err);
	};
	clientSocket.onclose = () => {
		debug('clientSocket::onclose');
	};
}

serve();

// Just fancy logs
function debug(label, value) {
	let now = performance.now().toFixed(2);
	console.log(label, value, +now);
	let line = document.createElement('li');
	if (value != null) {
		label += ': ' + value;
	}
	line.textContent = label;
	document.querySelector('ol').insertBefore(line, document.querySelector('li'));
}
