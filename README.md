# eslint-plugin-sort-component

`eslint-plugin-sort-component` is an ESLint plugin designed to sort expressions inside React components. This plugin helps maintain a consistent order of statements within your components, improving readability and maintainability.

The expected order of statements is as follows:

1. Selectors
2. Dispatchers
3. Built-in hooks (useState, useEffect, etc.)
4. Custom hooks (useCounter, etc.)
5. Declarations (Constants and variables)
6. Functions

## Installation

To install the plugin, run:

```sh
npm install -D eslint-plugin-sort-component
```

Ensure that you have ESLint installed as a peer dependency:
```sh
npm install -D eslint
```

## Usage

Add sort-component to the plugins section of your ESLint configuration file (e.g., eslint.config.js):
```js
// eslint.config.js
import sortComponent from 'eslint-plugin-sort-component'

//...settings
plugins: {
  //...plugins
  'sort-component': sortComponent
  }

```
Then, add the rule to the rules section:

```js
//...settings
rules: {
  //...rules
  'sort-component/sort-component': 'warn'
  }
```

## License
This project is licensed under the MIT License.

Made with ❤️ by [German Tellez](https://github.com/getellez) in Colombia 🇨🇴


