const jsKeywords = [
  // Basic keywords and operators
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "break",
  "continue",
  "class",
  "extends",
  "new",
  "this",
  "super",
  "import",
  "export",
  "default",
  "null",
  "undefined",
  "true",
  "false",
  "try",
  "catch",
  "finally",
  "throw",
  "async",
  "await",
  "yield",
  "delete",
  "instanceof",
  "typeof",
  "switch",
  "case",
  "do",
  "in",
  "of",
  "void",
  "with",

  // Common methods and properties
  "map",
  "filter",
  "reduce",
  "forEach",
  "find",
  "includes",
  "indexOf",
  "push",
  "pop",
  "shift",
  "unshift",
  "slice",
  "splice",
  "concat",
  "join",
  "split",
  "length",
  "toString",
  "valueOf",
  "keys",
  "values",
  "entries",

  // Built-in objects and constructors
  "Array",
  "Object",
  "String",
  "Number",
  "Boolean",
  "Date",
  "Math",
  "RegExp",
  "Promise",
  "Set",
  "Map",
  "WeakMap",
  "WeakSet",
  "Symbol",
  "Error",

  // Common DOM terms
  "document",
  "window",
  "element",
  "addEventListener",
  "querySelector",
  "getElementById",
  "createElement",
  "appendChild",
  "removeChild",

  // ES6+ features
  "spread",
  "rest",
  "destructuring",
  "arrow",
  "template",
  "literal",
  "static",
  "get",
  "set",
  "implements",
  "interface",
  "package",
  "private",
  "protected",
  "public",

  // Common Math methods
  "floor",
  "ceil",
  "round",
  "random",
  "max",
  "min",
  "abs",
  "sqrt",

  // Promise-related
  "then",
  "catch",
  "finally",
  "resolve",
  "reject",
  "all",
  "race",

  // Loop-related
  "while",
  "for",
  "do",
  "break",
  "continue",
  "each",
  "every",
  "some",

  // Operators as words
  "typeof",
  "instanceof",
  "in",
  "of",
  "not",
  "and",
  "or",
  "equals",

  // Type-related
  "number",
  "string",
  "boolean",
  "object",
  "symbol",
  "bigint",
  "function",
];

export function generateJSWords(length: number): string {
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * jsKeywords.length);
    result += jsKeywords[randomIndex];

    if (i < length - 1) {
      result += " ";
    }
  }

  return result;
}
