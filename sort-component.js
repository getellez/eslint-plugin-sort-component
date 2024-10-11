const getMainComponent = (body) => {
  for (const element of body) {
    if (element.type === 'ReturnStatement' && element.argument?.type === 'JSXElement') {
      return body
    }
  }
}

/* 
  Suggested order:

  1. Selectors
  2. Dispatch
  3. Actions
  4. States
  5. Hooks
  6. Variables
  7. Functions
*/

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Sort the statements in a component",
    },
    fixable: "code",
    hasSuggestions: true,
    schema: []
  },
  create(context) {
    return {
      BlockStatement(node) {
        const body = node.body;
        if (Array.isArray(body)) {
          const bodyElements = getMainComponent(body);
          if (!bodyElements) {
            return
          }
          const firstElement = bodyElements[0];
          if (firstElement.type === 'VariableDeclaration' && firstElement.declarations[0].init.callee.name === 'useState') {
            context.report({
              node: firstElement,
              message: 'State should be declared after all the hooks',
              loc: {
                start: firstElement.loc.start,
                end: firstElement.loc.end
              }
            });
          }

        }

      }
    };
  }
};