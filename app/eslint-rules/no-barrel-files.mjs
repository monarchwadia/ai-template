/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow barrel files (index.ts that only re-export).",
    },
    messages: {
      noBarrelFile:
        "Barrel files are not allowed. Import directly from the source module instead.",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    // Only target index.ts / index.tsx files
    if (!/[/\\]index\.tsx?$/.test(filename)) return {};

    let hasOwnCode = false;

    return {
      // Any non-export declaration or expression means this isn't a pure barrel
      VariableDeclaration(node) {
        if (node.parent.type === "ExportNamedDeclaration") return;
        hasOwnCode = true;
      },
      FunctionDeclaration(node) {
        if (node.parent.type === "ExportNamedDeclaration") return;
        hasOwnCode = true;
      },
      ClassDeclaration(node) {
        if (node.parent.type === "ExportNamedDeclaration") return;
        hasOwnCode = true;
      },
      ExpressionStatement() {
        hasOwnCode = true;
      },
      // Exports that define their own value (not re-exports) count as own code
      ExportNamedDeclaration(node) {
        if (node.declaration) hasOwnCode = true;
        // `export { X }` without `from` is a local re-export from same file — rare, but still a barrel pattern
      },
      ExportDefaultDeclaration() {
        hasOwnCode = true;
      },
      "Program:exit"(node) {
        if (hasOwnCode) return;
        // If the file has no own code, it's a pure barrel
        if (node.body.length > 0) {
          context.report({ node, messageId: "noBarrelFile" });
        }
      },
    };
  },
};
