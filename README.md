## `phs` (Parameterized HTML Schemas) [![Build status](https://img.shields.io/travis/nylen/phs/master.svg?style=flat)](https://travis-ci.org/nylen/phs) [![npm package](http://img.shields.io/npm/v/phs.svg?style=flat)](https://www.npmjs.org/package/phs)

This is a library that can be used to describe and validate chunks of HTML.  It
is inspired by
[RELAX NG](http://relaxng.org/),
but with a few very different goals.  `phs` schemas are designed to:

- Accept placeholders for parameters, so that schemas can also be used to
  serialize and deserialize chunks of data to/from HTML.
  _Not implemented yet._
- Be more concise and easier to author/read/understand than the full RELAX NG
  specification.
- Resemble the HTML they describe and be easily expressible in JSX notation.

**Note:** Currently this library contains the *bare minimum to be at all useful*.

## How to use

Currently it's recommended to use JSX with the
[`transform-jsx-flexible` Babel plugin](https://github.com/nylen/babel-plugin-transform-jsx-flexible).
If you're using React, for example, this allows you to continue using React
elements along with `phs` schemas within the same file.

Configure the plugin as follows in your `.babelrc`:

```js
"plugins": [
    ...
    [ "./lib/babel-plugin-transform-jsx-flexible", {
        tags: {
            Schema: 'createSchemaElement',
        }
    } ],
    ...
]
```

In your JSX code files:

```js
import { createSchemaElement, Schema, Element } from 'phs';

const schema = (
    <Schema>
        <Element name="p" />
    </Schema>
);

const fragment = /* DOM fragment or similar object returned by a parser */;

const result = schema.validateFragment( fragment );

console.log( result ); // either `true` or an `Error`
```

There are also a couple of validation functions other than `validateFragment`:

- `validateNodes( arrayOfNodes )`
- `validateNode( singleNode )`

## Schema elements

### `<Element name="tagName">`

Matches a single HTML element with the tag name `tagName`.  `tagName` can also
be a string like `'p|span'` to provide a choice between multiple tag names.

There is also a shorthand for `<Element>` that is designed to more closely
resemble the HTML it describes.  These two constructions are equivalent:

```js
const schema1 = (
    <Schema>
        <Element name="div" />;
    </Schema>
);

const schema2 = (
    <Schema>
        <div />
    </Schema>
);
```
