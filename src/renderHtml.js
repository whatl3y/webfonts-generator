var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var handlebars = require('handlebars')
var sass = require('node-sass')

var renderCss = require('./renderCss')

handlebars.registerHelper('removePeriods', function (selector) {
	return selector.replace(/\./, '');
});

var renderHtml = function(options) {
	var source = fs.readFileSync(options.htmlTemplate, 'utf8')
	var template = handlebars.compile(source)

	var htmlFontsPath = path.relative(options.htmlDest, options.dest)
	// Styles embedded in the html file should use default CSS template and
	// have path to fonts that is relative to html file location.
	// TODO determine if CSS provided in options is SCSS or CSS, and update
	// accordingly
	// var styles = renderCss(_.extend({}, options, {
	// 	cssFontPath: htmlFontsPath
	// }))
	var sassString = renderCss(_.extend({}, options, {
		cssFontPath: htmlFontsPath
	}))
	var styles = sass.renderSync({ data: sassString })

	var ctx = _.extend({
		names: options.names,
		fontName: options.fontName,
		styles: styles
	}, options.templateOptions)
	return template(ctx)
}

module.exports = renderHtml
