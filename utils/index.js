const {
  SELECTOR_TYPE,
  DISPATCH_TYPE,
  BUILTIN_HOOK_TYPE,
  CUSTOM_HOOK_TYPE,
  DECLARATION_TYPE,
  FUNCTION_TYPE,
  OTHER_TYPE,
  builtInHooks,
} = require("./constants")

const getMainComponent = (body) => {
  for (const element of body) {
    if (element.type === 'ReturnStatement' && element.argument?.type === 'JSXElement') {
      return body
    }
  }
}

const isSelectorHook = (name) => {
  return name?.toLowerCase().startsWith('use') && name?.toLowerCase().includes(SELECTOR_TYPE.toLowerCase())
}

const isDispatchHook = (name) => {
  return name?.toLowerCase().startsWith('use') && name?.toLowerCase().includes(DISPATCH_TYPE.toLowerCase())
}

const isCustomHook = (name) => {
  return name?.toLowerCase().startsWith('use') && !builtInHooks.includes(name)
}

const isBuiltInHook = (name) => {
  return builtInHooks.includes(name)
}

const getVariableDeclarationName = (bodyItem) => {
  const expressionNode = bodyItem.declarations[0].init
  const calleeName = expressionNode.callee?.name
  if (expressionNode.type === 'CallExpression') {
    if (isCustomHook(calleeName) && isSelectorHook(calleeName)) {
      return SELECTOR_TYPE
    } else if (isCustomHook(calleeName) && isDispatchHook(calleeName)) {
      return DISPATCH_TYPE
    } else if (isBuiltInHook(calleeName) && !isSelectorHook(calleeName)) {
      return BUILTIN_HOOK_TYPE
    } else if (isCustomHook(calleeName) && !isSelectorHook(calleeName)) {
      return CUSTOM_HOOK_TYPE
    } else if (expressionNode.callee.type === 'MemberExpression') {
      // A regular variable or constant declaration.
      // i.e const name = 'Jhon Doe'
      return DECLARATION_TYPE
    }
    return calleeName
  } else if (expressionNode.type === 'ArrowFunctionExpression') {
    return FUNCTION_TYPE
  } else if (expressionNode.type === 'FunctionExpression') {
    return FUNCTION_TYPE
  } else {
    return OTHER_TYPE
  }
}

const getExpressionStatementName = (bodyItem) => {
  const expressionNode = bodyItem.expression
  if (expressionNode.type === 'CallExpression') {
    if (isBuiltInHook(expressionNode.callee.name)) {
      return BUILTIN_HOOK_TYPE
    }
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
      currentOrder.push({ name: FUNCTION_TYPE, node: item })
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
          message: `${item.name} should be placed after ${previousExpectedElement}`,
          loc: {
            start: item.node.loc.start,
            end: item.node.loc.end
          }
        })
      } else {
        context.report({
          node: item.node,
          message: `${item.name} should be placed at the top of the component`,
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