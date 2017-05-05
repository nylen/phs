/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { RawHTML } from 'lib/jsx-to-fake-dom';

describe( 'RawHTML JSX handler', () => {
	it( 'should create a DOM-like object', () => {
		const fakeDom = (
			<RawHTML>
				<p class="y">
					test <strong> stuff </strong>ok
					<span />
					{ true ? ( () => ( <div class="x">abc</div> ) )() : null }
				</p>
			</RawHTML>
		);

		expect( fakeDom ).to.eql( {
			nodeName: '#document-fragment',
			childNodes: [ {
				nodeName: 'p',
				tagName: 'p',
				attrs: [ {
					name: 'class',
					value: 'y',
				} ],
				childNodes: [ {
					nodeName: '#text',
					value: 'test ',
				}, {
					nodeName: 'strong',
					tagName: 'strong',
					attrs: [],
					childNodes: [ {
						nodeName: '#text',
						value: ' stuff ',
					} ],
				}, {
					nodeName: '#text',
					value: 'ok',
				}, {
					nodeName: 'span',
					tagName: 'span',
					attrs: [],
					childNodes: [],
				}, {
					nodeName: 'div',
					tagName: 'div',
					attrs: [ {
						name: 'class',
						value: 'x',
					} ],
					childNodes: [ {
						nodeName: '#text',
						value: 'abc',
					} ],
				} ],
			} ],
		} );
	} );
} );
