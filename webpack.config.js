/**
 * External dependencies
 */

const path = require( 'path' );
const webpack = require( 'webpack' );
const ResolveEntryModulesPlugin = require( 'resolve-entry-modules-webpack-plugin' );
const glob = require( 'glob' );

const config = {
	entry: './index.js',
	output: {
		filename: 'build/index.js',
		path: __dirname,
		library: 'phs',
		libraryTarget: 'umd',
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
	},
	plugins: [
		new ResolveEntryModulesPlugin(),
		new webpack.LoaderOptionsPlugin( {
			minimize: process.env.NODE_ENV === 'production',
			debug: process.env.NODE_ENV !== 'production',
		} ),
		new webpack.ProvidePlugin( {
			createSchemaElement: path.join( __dirname, 'lib', 'jsx-handler.js' ),
		} ),
		new webpack.ProvidePlugin( {
			FakeDOM: path.join( __dirname, 'lib', 'jsx-to-fake-dom.js' ),
		} ),
	],
	stats: {
		children: false,
	},
};

switch ( process.env.NODE_ENV ) {
	case 'production':
		// TODO this causes "Error: Invalid schema tag name: t"
		// config.plugins.push( new webpack.optimize.UglifyJsPlugin() );
		break;

	case 'test':
		config.externals = [ require( 'webpack-node-externals' )() ];
		config.output = {
			filename: 'build/test.js',
			path: __dirname,
		};
		config.entry = [ config.entry ];
		config.entry = config.entry.concat( glob.sync( './test/*.js' ) );
		break;

	default:
		config.devtool = 'source-map';
}

module.exports = config;
