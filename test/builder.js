/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { Schema, Element } from 'index';

describe( 'schema builder', () => {
	it( 'should propagate errors', () => {
		const schema = (
			<Schema>
				<Element name="p">
					<Element name="-invalid-" />
				</Element>
			</Schema>
		);
		expect( schema ).to.be.instanceOf( Error );
		expect( schema.message ).to.eql(
			"<Element> names must be one or more HTML tag names separated by '|'."
		);
	} );
} );
