const { DECLARATION_NAME, SELECTOR_NAME, DISPATCH_NAME, FUNCTION_NAME, OTHER_NAME, standardHooks } = require("./constants")

const getMainComponent = (body) => {
  for (const element of body) {
    if (element.type === 'ReturnStatement' && element.argument?.type === 'JSXElement') {
      return body
    }
  }
}

const isSelectorHook = (name) => {
  return name.toLowerCase().startsWith('use') && name.toLowerCase().includes(SELECTOR_NAME)
}

const isDispatchHook = (name) => {
  return name.toLowerCase().startsWith('use') && name.toLowerCase().includes(DISPATCH_NAME)
}

const isCustomHook = (name) => {
  return name.toLowerCase().startsWith('use') && !standardHooks.includes(name)
}

const getVariableDeclarationName = (bodyItem) => {
  const expressionNode = bodyItem.declarations[0].init
  const calleeName = expressionNode.callee?.name
  if (expressionNode.type === 'CallExpression') {
    if (expressionNode.callee.type === 'MemberExpression') {
      // A regular variable or constant declaration.
      // i.e const name = 'Jhon Doe'
      return DECLARATION_NAME
    } else if (isCustomHook(calleeName) && isSelectorHook(calleeName)) {
      return SELECTOR_NAME
    } else if (isCustomHook(calleeName) && isDispatchHook(calleeName)) {
      return DISPATCH_NAME
    } else if (isCustomHook(calleeName) && !isSelectorHook(calleeName)) {
      return CUSTOM_HOOK_NAME
    }
    return calleeName
  } else if (expressionNode.type === 'ArrowFunctionExpression') {
    return FUNCTION_NAME
  } else if (expressionNode.type === 'FunctionExpression') {
    return FUNCTION_NAME
  } else {
    return OTHER_NAME
  }
}

const getExpressionStatementName = (bodyItem) => {
  const expressionNode = bodyItem.expression
  if (expressionNode.type === 'CallExpression') {
    return expressionNode.callee.name
  }
}

const getCurrentOrder = (bodyItems) => {
  const currentOrder = []
  for (const item of bodyItems) {
    if (item.type === 'VariableDeclaration') {
      const name = getVariableDeclarationName(item)
      currentOrder.push({ name, node: item })
    } else if (item.type === 'ExpressionStatement') {
      const name = getExpressionStatementName(item)
      currentOrder.push({ name, node: item })
    } else if (item.type === 'FunctionDeclaration') {
      currentOrder.push({ name: FUNCTION_NAME, node: item })
    }
  }
  return currentOrder
}

const getMatchedExpectedOrder = (currentOrderNames, expectedOrder) => {
  /* 
    Create an array with the final expected order including duplicated expressions
    i.e ['selector','useState', 'useState', 'useEffect', 'useEffect', 'function'] 
  */
  const matchedExpectedOrder = []
  for (const expected of expectedOrder) {
    while (currentOrderNames.includes(expected)) {
      matchedExpectedOrder.push(expected)
      currentOrderNames.splice(currentOrderNames.indexOf(expected), 1)
    }
  }
  return matchedExpectedOrder
}

const compareOrderAndReportSuggestions = (context, currentOrder, expectedOrder) => {
  const currentOrderNames = currentOrder.map(item => item.name)
  const matchedExpectedOrder = getMatchedExpectedOrder(currentOrderNames, expectedOrder)

  currentOrder.forEach((item, index) => {
    const expectedPosition = matchedExpectedOrder.indexOf(item.name)
    if (currentOrder[expectedPosition]?.name !== item.name) {
      const previousExpectedElement = matchedExpectedOrder[expectedPosition - 1]
      if (previousExpectedElement) {
        context.report({
          node: item.node,
          message: `'${item.name}' should be placed after '${previousExpectedElement}'`,
          loc: {
            start: item.node.loc.start,
            end: item.node.loc.end
          }
        })
      } else {
        context.report({
          node: item.node,
          message: `'${item.name}' should be placed at the top of the component`,
          loc: {
            start: item.node.loc.start,
            end: item.node.loc.end
          }
        })
      }
    }

  })

}

module.exports = {
  getMainComponent,
  getCurrentOrder,
  compareOrderAndReportSuggestions
}