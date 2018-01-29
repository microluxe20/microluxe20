var through = require('through2');

// Transform markdown document by parsing and including data tables.
module.exports = through.obj(function transform(data, e, cb) {
	// Scan for HTML comments starting with '!data'.
	// Parse the directive: !data <file> [key]
	// Load the appropriate YAML file.
	// Get the table YAML document matching the key, or the first if no key.
	// Convert it into markdown, optionally combining multiple columns.
	// Insert into page, replacing the comment.
	// Done!
});
