const SELECTOR_NAME = 'selector'
const FUNCTION_NAME = 'function'
const DECLARATION_NAME = 'variable'
const UNKNOWN_NAME = 'unknown'

const getMainComponent = (body) => {
  for (const element of body) {
    if (element.type === 'ReturnStatement' && element.argument?.type === 'JSXElement') {
      return body
    }
  }
}

const getVariableDeclarationName = (bodyItem) => {
  const expressionNode = bodyItem.declarations[0].init
  if (expressionNode.type === 'CallExpression') {
    if (expressionNode.callee.type === 'MemberExpression') {
      // A regular variable or constant declaration.
      // i.e const name = 'Jhon Doe'
      return DECLARATION_NAME
    } else if (expressionNode.callee.name.toLowerCase().includes('selector')) {
      return SELECTOR_NAME
    }
    return expressionNode.callee.name
  } else if (expressionNode.type === 'ArrowFunctionExpression') {
    return FUNCTION_NAME
  } else if (expressionNode.type === 'FunctionExpression') {
    return FUNCTION_NAME
  } else {
    return UNKNOWN_NAME
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
  // Find current order
  for (const item of bodyItems) {
    if (item.type === 'VariableDeclaration') {
      const name = getVariableDeclarationName(item)
      currentOrder.push(name)
    } else if (item.type === 'ExpressionStatement') {
      const name = getExpressionStatementName(item)
      currentOrder.push(name)
    } else if (item.type === 'FunctionDeclaration') {
      currentOrder.push('function')
    }
  }
  return currentOrder
}

module.exports = {
  getMainComponent,
  getCurrentOrder
}