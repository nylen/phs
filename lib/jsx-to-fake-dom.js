export function RawHTML() {}

export function createFakeDOMTree( type, config, ...children ) {
	const el = {};

	if ( type === RawHTML ) {
		el.nodeName = '#document-fragment';
	} else {
		el.tagName = el.nodeName = type;
		const attrs = config || {};
		el.attrs = Object.keys( attrs ).map( name => ( {
			name,
			value: attrs[ name ],
		} ) );
	}

	el.childNodes = children.map( child => {
		if ( typeof child === 'string' ) {
			return {
				nodeName: '#text',
				value: child,
			};
		}
		return child;
	} );

	return el;
}
