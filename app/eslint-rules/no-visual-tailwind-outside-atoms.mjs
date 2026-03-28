/**
 * ESLint rule: no-visual-tailwind-outside-atoms
 *
 * Flags visual/presentational Tailwind CSS classes when used in `className`
 * on native HTML elements outside of src/lib/components/.
 *
 * Classes on custom React components (PascalCase / namespaced like Accordion.Root)
 * are allowed because those are atoms receiving visual overrides via className.
 */

const VISUAL_PATTERNS = [
  // Text colors + sizing (allow alignment/wrapping keywords)
  /^text-(?!left$|right$|center$|start$|end$|justify$|wrap$|nowrap$|ellipsis$|balance$|pretty$)/,
  // Font family, weight, size
  /^font-/,
  // Letter-spacing / line-height
  /^(?:tracking|leading)-/,
  // Text decoration
  /^(?:underline|line-through|no-underline|overline)$/,
  /^decoration-/,
  // Text transform
  /^(?:uppercase|lowercase|capitalize|normal-case)$/,
  // Font style
  /^(?:italic|not-italic)$/,
  // Background
  /^bg-/,
  // Gradient color stops
  /^(?:from|to|via)-/,
  // Border colors — allows structural widths/directions/styles
  //   OK:  border, border-b, border-t-2, border-l-3, border-solid, border-collapse, border-spacing-*
  //   BAD: border-brand, border-gray-700, border-white, border-border
  /^border-(?![tblrxy](?:$|-\d)|[0-9]|solid$|dashed$|dotted$|double$|none$|hidden$|collapse$|separate$|spacing)/,
  // Shadow
  /^shadow/,
  // Border radius
  /^rounded/,
  // Ring
  /^ring/,
  // Opacity
  /^opacity-/,
  // Transitions & animations
  /^(?:transition|animate|duration|ease|delay)/,
  // Transforms
  /^(?:rotate|scale|skew|translate)/,
  // Cursor
  /^cursor-/,
  // Outline
  /^outline/,
  // Divide colors (allow divide-x, divide-y, divide-reverse, divide-none)
  /^divide-(?!x$|y$|reverse$|none$)/,
  // SVG fill/stroke
  /^(?:fill|stroke)-/,
  // Accent / caret colors
  /^(?:accent|caret)-/,
];

/** Strip variant prefixes (sm:, hover:, group-data-[...]:, etc.) and negation. */
function getBaseUtility(cls) {
  const colonIdx = cls.lastIndexOf(":");
  let base = colonIdx >= 0 ? cls.slice(colonIdx + 1) : cls;
  if (base.startsWith("-")) base = base.slice(1);
  return base;
}

function isVisualClass(cls) {
  const base = getBaseUtility(cls);
  return VISUAL_PATTERNS.some((p) => p.test(base));
}

/** Return true if the JSX tag is a native HTML element (lowercase first char). */
function isNativeElement(openingElement) {
  const { name } = openingElement;
  if (name.type === "JSXIdentifier") {
    return name.name[0] === name.name[0].toLowerCase();
  }
  return false;
}

/** Return the display name of a JSX element. */
function getComponentName(openingElement) {
  const { name } = openingElement;
  if (name.type === "JSXIdentifier") return name.name;
  if (name.type === "JSXMemberExpression") {
    return `${name.object.name}.${name.property.name}`;
  }
  return "Unknown";
}

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow visual/presentational Tailwind classes on native HTML elements outside src/lib/components/",
    },
    messages: {
      noVisualClass:
        "Visual Tailwind class '{{className}}' is not allowed on native HTML elements outside src/lib/components/. Move it into an atom.",
      noClassNameOnComponent:
        "Do not pass 'className' to component <{{component}}>. Use variant props instead.",
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename ?? context.getFilename();

    // Exempt: anything inside src/lib/components/ (atoms live there)
    if (filename.includes("/src/lib/components/")) return {};

    // Only check source files
    if (!filename.includes("/src/")) return {};

    function checkClasses(classString, node) {
      const classes = classString.split(/\s+/).filter(Boolean);
      for (const cls of classes) {
        if (isVisualClass(cls)) {
          context.report({
            node,
            messageId: "noVisualClass",
            data: { className: cls },
          });
        }
      }
    }

    /** Recursively extract string literals from an AST expression node. */
    function checkNode(node) {
      if (!node) return;
      switch (node.type) {
        case "Literal":
          if (typeof node.value === "string") {
            checkClasses(node.value, node);
          }
          break;
        case "TemplateLiteral":
          for (const quasi of node.quasis) {
            if (quasi.value.raw) {
              checkClasses(quasi.value.raw, quasi);
            }
          }
          for (const expr of node.expressions) {
            checkNode(expr);
          }
          break;
        case "ConditionalExpression":
          checkNode(node.consequent);
          checkNode(node.alternate);
          break;
        case "LogicalExpression":
          checkNode(node.right);
          break;
        case "JSXExpressionContainer":
          checkNode(node.expression);
          break;
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== "className") return;
        const element = node.parent;
        if (element.type !== "JSXOpeningElement") return;

        if (isNativeElement(element)) {
          // Native HTML elements: flag visual classes
          checkNode(node.value);
        } else {
          // Custom components: flag className prop entirely
          context.report({
            node,
            messageId: "noClassNameOnComponent",
            data: { component: getComponentName(element) },
          });
        }
      },
    };
  },
};
