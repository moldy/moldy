module.exports = function () {
	if ( GLOBAL.server ) {
		GLOBAL.server.stop();
	}
}