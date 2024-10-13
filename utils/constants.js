const SELECTOR_NAME = 'selector'
const FUNCTION_NAME = 'function'
const DECLARATION_NAME = 'declaration'
const OTHER_NAME = 'other'
const DISPATCH_NAME = 'dispatch'

const standardHooks = [
  "useState",
  "useEffect",
  "useContext",
  "useReducer",
  "useCallback",
  "useMemo",
  "useRef",
  "useImperativeHandle",
  "useLayoutEffect",
  "useDebugValue"
];
/* 
  Xsolis order:
  1. Selectors
  2. Dispatch
  3. Actions
  4. States
  5. Hooks
  6. Custom hooks
  6. Variables
  7. Functions
*/

const sortingStyle = {
  default: [
    'selector',
    'dispatch',
    'useState',
    'standardHook',
    'otherHook',
    'declaration',
    'function',
    'useEffect'
  ],
  xsolis: [
    'selector',
    'useState',
    'useEffect',
    'standardHook',
    'otherHook',
    'declaration',
    'function'
  ]
}

module.exports = {
  SELECTOR_NAME,
  FUNCTION_NAME,
  DECLARATION_NAME,
  OTHER_NAME,
  DISPATCH_NAME,
  standardHooks,
  sortingStyle
}