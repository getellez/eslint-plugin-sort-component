const SELECTOR_TYPE = 'Selector'
const DISPATCH_TYPE = 'Dispatch'
const BUILTIN_HOOK_TYPE = 'Built-in hooks'
const CUSTOM_HOOK_TYPE = 'Custom hooks'
const DECLARATION_TYPE = 'Declarations'
const FUNCTION_TYPE = 'Functions'
const OTHER_TYPE = 'other'


const builtInHooks = [
  "useState",
  "useEffect",
  "useContext",
  "useReducer",
  "useCallback",
  "useMemo",
  "useRef",
  "useImperativeHandle",
  "useLayoutEffect",
  "useInsertionEffect",
  "useTransition",
  "useDebugValue",
  "useDeferredValue",
  "useId",
  "useSyncExternalStore",
  "useActionState",
];

const sortingStyle = {
  default: [
    SELECTOR_TYPE,
    DISPATCH_TYPE,
    BUILTIN_HOOK_TYPE,
    CUSTOM_HOOK_TYPE,
    DECLARATION_TYPE,
    FUNCTION_TYPE
  ]
}

module.exports = {
  SELECTOR_TYPE,
  DISPATCH_TYPE,
  BUILTIN_HOOK_TYPE,
  CUSTOM_HOOK_TYPE,
  DECLARATION_TYPE,
  FUNCTION_TYPE,
  OTHER_TYPE,
  builtInHooks,
  sortingStyle
}