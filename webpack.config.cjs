// webpack.config.cjs
const path = require("path");

module.exports = (env) => ({
	mode: env.mode,
	entry: {
		main: ['./assets/js/main.js'],
		page: ['./assets/js/page/page.js'],
		preview: ['./assets/js/page/preview.js']
	},
	output: {
		path: path.resolve(__dirname, 'assets/dist'),
		filename: '[name].js',
	},
	devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	}
});
