/**
 * External dependencies
 */
import { omit, includes } from 'lodash';

/**
 * Internal dependencies
 */
import SchemaTag from './SchemaTag';

export default class Element extends SchemaTag {
	constructor( attrs, children ) {
		super( attrs, children );

		if ( ! attrs || typeof attrs.name !== 'string' ) {
			throw new Error(
				"<Element> must have a 'name' attribute."
			);
		}

		const badAttrs = Object.keys( omit( attrs, 'name' ) );
		if ( badAttrs.length ) {
			throw new Error(
				'Invalid <Element> attribute(s): ' + badAttrs.join( ',' )
			);
		}

		const nameChoices = attrs.name.split( '|' );
		for ( const nameChoice of nameChoices ) {
			if ( ! /^[a-z]+$/.test( nameChoice ) ) {
				throw new Error(
					"<Element> names must be one or more HTML tag names separated by '|'."
				);
			}
		}

		this.nameChoices = nameChoices;
	}

	_validateNodes( nodes ) {
		if ( nodes.length !== 1 ) {
			return this.getError(
				nodes,
				'Expected a single HTML element but found %d.',
				nodes.length
			);
		}

		const node = nodes[ 0 ];
		if ( ! node.tagName ) {
			return this.getError(
				node,
				'Expected an HTML element with a tagName but found a \'%s\'.',
				node.nodeName
			);
		}

		const tagName = node.tagName.toLowerCase();
		if ( ! includes( this.nameChoices, tagName ) ) {
			return this.getError(
				node,
				this.nameChoices.length === 1
					? "tagName is not '%s'"
					: "tagName does not match one of '%s'",
				this.nameChoices.join( "', '" )
			);
		}

		return true;
	}
}
