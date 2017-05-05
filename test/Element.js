/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { Schema, Element } from 'index';
import { RawHTML } from 'lib/jsx-to-fake-dom';

describe( 'Element#constructor', () => {
	it( 'should require a name attribute (no attributes)', () => {
		const schema = (
			<Schema>
				<Element />
			</Schema>
		);
		expect( schema ).to.be.instanceOf( Error );
		expect( schema.message ).to.eql(
			"<Element> must have a 'name' attribute."
		);
	} );

	it( 'should require a name attribute (other attributes)', () => {
		const schema = (
			<Schema>
				<Element something="whatever" />
			</Schema>
		);
		expect( schema ).to.be.instanceOf( Error );
		expect( schema.message ).to.eql(
			"<Element> must have a 'name' attribute."
		);
	} );

	it( 'should reject invalid attributes', () => {
		const schema = (
			<Schema>
				<Element name="p" something="whatever" something2="else" />
			</Schema>
		);
		expect( schema ).to.be.instanceOf( Error );
		expect( schema.message ).to.eql(
			"Invalid <Element> attribute(s): something,something2"
		);
	} );

	it( 'should reject invalid element names', () => {
		[
			'p2',
			'p|p2',
			'p2|p',
			'',
			'p|',
			'|p',
		].forEach( badName => {
			const schema = (
				<Schema>
					<Element name={ badName } />
				</Schema>
			);
			expect( schema ).to.be.instanceOf( Error );
			expect( schema.message ).to.eql(
				"<Element> names must be one or more HTML tag names separated by '|'."
			);
		} );
	} );

	it( 'should accept a single element name', () => {
		const schema = (
			<Schema>
				<Element name="p" />
			</Schema>
		);
		const element = schema._children[ 0 ];

		expect( element ).not.to.be.instanceOf( Error );
		expect( element.__proto__.constructor.name ).to.eql( 'Element' );
		expect( element.nameChoices ).to.eql( [ 'p' ] );
	} );

	it( 'should accept multiple element names', () => {
		const schema = (
			<Schema>
				<Element name="p|div" />
			</Schema>
		);
		const element = schema._children[ 0 ];

		expect( element ).not.to.be.instanceOf( Error );
		expect( element.__proto__.constructor.name ).to.eql( 'Element' );
		expect( element.nameChoices ).to.eql( [ 'p', 'div' ] );
	} );
} );

describe( 'Element single node schema', () => {
	const singleNodeSchema = (
		<Schema>
			<Element name="p" />
		</Schema>
	);

	it( 'should validate a simple tag', () => {
		const result = singleNodeSchema.validateFragment(
			<RawHTML>
				<p />
			</RawHTML>
		);

		expect( result ).to.be.true();
	} );

	it( 'should fail to validate multiple tags', () => {
		const result = singleNodeSchema.validateFragment(
			<RawHTML>
				<p />
				<p />
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="p"> at [p,p]: Expected a single HTML element but found 2.'
		);
	} );

	it( 'should fail to validate a tag with a child', () => {
		const result = singleNodeSchema.validateFragment(
			<RawHTML>
				<p>text content</p>
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="p"> at [#text]: '
			+ 'Schema element has no children, but child HTML elements found.'
		);
	} );

	it( 'should fail to validate a tag with multiple children', () => {
		const result = singleNodeSchema.validateFragment(
			<RawHTML>
				<p>
					some text content
					<span>something fancy</span>
				</p>
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="p"> at [#text,span]: '
			+ 'Schema element has no children, but child HTML elements found.'
		);
	} );
} );

describe( 'Element multi node schema', () => {
	const multiNodeSchema = (
		<Schema>
			<Element name="p" />
			<Element name="div" />
		</Schema>
	);

	it( 'should fail to validate a single tag', () => {
		const result = multiNodeSchema.validateFragment(
			<RawHTML>
				<p />
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Schema> at [p]: (FIXME) 2 schema elements !== 1 child nodes'
		);
	} );

	it( 'should validate two tags', () => {
		const result = multiNodeSchema.validateFragment(
			<RawHTML>
				<p />
				<div />
			</RawHTML>
		);

		expect( result ).to.be.true();
	} );

	it( 'should fail to validate out-of-order tags', () => {
		const result = multiNodeSchema.validateFragment(
			<RawHTML>
				<div />
				<p />
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="p"> at <div>: tagName is not \'p\''
		);
	} );

	it( 'should fail to validate tags with children', () => {
		const result = multiNodeSchema.validateFragment(
			<RawHTML>
				<p>has text content</p>
				<div />
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="p"> at [#text]: '
			+ 'Schema element has no children, but child HTML elements found.'
		);
	} );

	it( 'should fail to validate three tags', () => {
		const result = multiNodeSchema.validateFragment(
			<RawHTML>
				<p />
				<div />
				<span />
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Schema> at [p,div,span]: '
			+ '(FIXME) 2 schema elements !== 3 child nodes'
		);
	} );
} );

describe( 'Element nested schema', () => {
	const nestedSchema = (
		<Schema>
			<Element name="p">
				<Element name="div">
					<Element name="span" />
				</Element>
			</Element>
		</Schema>
	);

	it( 'should validate correctly nested tags', () => {
		const result = nestedSchema.validateFragment(
			<RawHTML>
				<p>
					<div>
						<span />
					</div>
				</p>
			</RawHTML>
		);

		expect( result ).to.be.true();
	} );

	it( 'should fail to validate the wrong tag name', () => {
		const result = nestedSchema.validateFragment(
			<RawHTML>
				<p>
					<div>
						<strong />
					</div>
				</p>
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="span"> at <strong>: tagName is not \'span\''
		);
	} );

	it( 'should fail to validate a nested text element', () => {
		const result = nestedSchema.validateFragment(
			<RawHTML>
				<p>
					<div>text content is not a span</div>
				</p>
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="span"> at #text "text content…": '
			+ 'Expected an HTML element with a tagName but found a \'#text\'.'
		);
	} );

	it( 'should fail to validate if a child tag is missing', () => {
		const result = nestedSchema.validateFragment(
			<RawHTML>
				<p>
					<div />
				</p>
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="span"> at []: '
			+ 'Expected a single HTML element but found 0.'
		);
	} );

	it( 'should fail to validate with too many child tags', () => {
		const result = nestedSchema.validateFragment(
			<RawHTML>
				<p>
					<div>
						<span />
						<span />
					</div>
				</p>
			</RawHTML>
		);

		expect( result ).to.be.instanceOf( Error );
		expect( result.message ).to.eql(
			'<Element name="span"> at [span,span]: '
			+ 'Expected a single HTML element but found 2.'
		);
	} );
} );
