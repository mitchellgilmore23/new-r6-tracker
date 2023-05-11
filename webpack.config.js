const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
module.exports = {
	mode: 'production',
	entry: {
		'index': './src/js/index.js'
	},
	output: {
		clean : true,
		path: path.resolve(__dirname, 'dist/js'),
		filename: '[name]-[fullhash].js',
		},
	plugins : [
	new HtmlWebpackPlugin({
		title : 'R6 Tracker',
		filename : path.resolve(__dirname, 'dist/html/home.html'),
		template : path.resolve(__dirname, 'src/html/home.html'),
		cache: false
	}),
	new webpack.ProvidePlugin({
		$ : 'jquery',
		bootstrap : 'bootstrap',
		rankImg : ['./Rank-Img','default'],
	})
	],
};
