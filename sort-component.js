const { getCurrentOrder, getMainComponent, compareOrderAndReportSuggestions } = require("./utils");
const { sortingStyle } = require("./utils/constants");

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
        const expectedOrder = sortingStyle.default
        const currentOrder = getCurrentOrder(bodyItems)
        compareOrderAndReportSuggestions(context, currentOrder, expectedOrder)
      }
    };
  }
};