const { getCurrentOrder, getMainComponent } = require("./utils");

/* 
  Xsolis order:
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
        const body = Array.from(node.body);
        const bodyItems = getMainComponent(body);
        if (!bodyItems) {
          return
        }
        const currentOrder = getCurrentOrder(bodyItems)
        if (currentOrder[0] === 'useState') {
          context.report({
            node,
            message: 'Use selectors before states',
            loc: {
              start: node.loc.start,
              end: node.loc.end
            }
          })
        }
      }
    };
  }
};