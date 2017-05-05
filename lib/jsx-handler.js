/**
 * Internal dependencies
 */
import * as schema from 'schema';

export default function createSchemaElement( type, attrs, ...children ) {
	if ( typeof type === 'string' ) {
		// This is a simple shorthand for an HTML tag
		return createSchemaElement(
			schema.Element,
			{
				name: type,
				...attrs,
			},
			children
		);
	}

	if ( typeof type !== 'function' ) {
		throw new Error(
			'Schema tags must be callable.'
		);
	}

	if ( schema[ type.name ] !== type ) {
		throw new Error(
			'Invalid schema tag name: ' + type.name
		);
	}

	if ( type.__proto__.name !== 'SchemaTag' ) {
		throw new Error(
			'Schema tag does not inherit from SchemaTag: ' + type.name
		);
	}

	for ( const child of children ) {
		if ( child instanceof Error ) {
			return child;
		}
	}

	let element;
	try {
		element = new schema[ type.name ]( attrs, children );
	} catch ( err ) {
		return err;
	}
	return element;
}
