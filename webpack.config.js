const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

module.exports = {
	entry: "./script.js",
	mode: process.env.NODE_ENV !== "production" ? "production" : "development",
	plugins:[
		new HtmlWebpackPlugin({
			template: "./index.html",
		}),
		/*new CopyPlugin({
			patterns: [
				{ from: "images", to: "images" },				
				{ from: "manifest.webmanifest", to: "./" },
				{ from: "images.json", to: "./" },
			]
		}),
		new ServiceWorkerWebpackPlugin({
			entry: path.join(__dirname, "./sw.js"),
		}),*/
	],	
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
};
