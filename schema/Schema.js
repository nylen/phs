/**
 * Internal dependencies
 */
import SchemaTag from './SchemaTag';

export default class Schema extends SchemaTag {
	constructor( attrs, children ) {
		super( attrs, children );

		if ( attrs ) {
			throw new Error(
				'<Schema> must not have attributes.'
			);
		}

		if ( ! children.length ) {
			throw new Error(
				'<Schema> must have children.'
			);
		}
	}

	_validateNodes( /* nodes */ ) {
		return true;
	}

	validateFragment( fragment ) {
		return this._validateNodesAgainstChildren( fragment.childNodes );
	}

	validateNodes( nodes ) {
		return this._validateNodesAgainstChildren( nodes );
	}

	validateNode( node ) {
		return this.validateNodes( [ node ] );
	}
}
