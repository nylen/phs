/**
 * External dependencies
 */
import { format } from 'util';

/**
 * All schema tags must inherit from this class and define the following
 * methods:
 *
 *  - constructor( attrs, children ): checks tag arguments and performs any
 *                                    needed initialization logic.
 *  - _validateNodes( nodes ): validates against an array of DOM-node-like
 *                             objects, WITHOUT validating their children.
 *
 * The following methods may also be overridden:
 *
 *  - toString(): returns a short string representation of the schema tag.
 */

export default class SchemaTag {
	constructor( attrs, children ) {
		this._attrs    = attrs || {};
		this._children = children || [];
	}

	_validateNodesAgainstChildren( nodes ) {
		// Degenerate case: 0 HTML elements; 0 schema children
		if ( ! nodes.length && ! this._children.length ) {
			return true;
		}

		// Degenerate case: 1+ HTML elements; 0 schema children
		if ( nodes.length && ! this._children.length ) {
			return this.getError(
				nodes,
				'Schema element has no children, but child HTML elements found.'
			);
		}

		// Degenerate case: 1 schema child
		if ( this._children.length === 1 ) {
			const child = this._children[ 0 ];
			let result = child._validateNodes( nodes );
			if ( result instanceof Error ) {
				return result;
			}
			for ( let i = 0; i < nodes.length; i++ ) {
				result = child._validateNodesAgainstChildren( nodes[ i ].childNodes );
				if ( result instanceof Error ) {
					return result;
				}
			}
			return true;
		}

		// Otherwise, expect 1 HTML element per schema child.
		// TODO: full backtracking implementation

		if ( this._children.length !== nodes.length ) {
			return this.getError(
				nodes,
				'(FIXME) %d schema elements !== %d child nodes',
				this._children.length,
				nodes.length
			);
		}

		for ( let i = 0; i < this._children.length; i++ ) {
			const child = this._children[ i ];
			let result = child._validateNodes( [ nodes[ i ] ] );
			if ( result instanceof Error ) {
				return result;
			}
			result = child._validateNodesAgainstChildren( nodes[ i ].childNodes );
			if ( result instanceof Error ) {
				return result;
			}
		}

		return true;
	}

	_validateNodes( /* nodes */ ) {
		throw new Error(
			'_validateNodes( nodes ) must be implemented by each schema tag.'
		);
	}

	toString() {
		let attrString = '';
		for ( const name in this._attrs ) {
			attrString += ' ' + name + '="' + this._attrs[ name ] + '"';
		}
		return '<' + this.__proto__.constructor.name + attrString + '>';
	}

	getError( nodeOrNodes, message, ...params ) {
		const nodeString = Array.isArray( nodeOrNodes )
			? nodesToString( nodeOrNodes )
			: nodeToString( nodeOrNodes );
		const err = new Error( format(
			this.toString() + ' at ' + nodeString + ': ' + message,
			...params
		) );
		err.schemaTag = this;
		if ( Array.isArray( nodeOrNodes ) ) {
			err.nodes = nodeOrNodes;
		} else {
			err.node = nodeOrNodes;
		}
		return err;
	}
}

export function nodesToString( nodes ) {
	return '['
		+ nodes.map( node => node.tagName || node.nodeName ).join( ',' )
		+ ']';
}

export function nodeToString( node ) {
	if ( node.nodeName === '#text' ) {
		let value = JSON.stringify( node.value );
		if ( value.length > 15 ) {
			value = value.substring( 0, 13 ) + '…"';
		}
		return '#text ' + value;
	}

	if ( node.tagName ) {
		const attrString = ( node.attrs || [] ).reduce( ( memo, attr ) => {
			return memo + ' ' + attr.name + '=' + JSON.stringify( attr.value );
		}, '' );
		return '<' + node.tagName + attrString + '>';
	}

	return '(' + node.nodeName + ')';
}
