/** Format story args as JSX usage of the real playground component (not story-only wrappers). */
const formatJsValue = (value: unknown, indent: number): string => {
  const pad = "  ".repeat(indent);

  if (value === null) return "null";
  if (typeof value === "string") return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const lines = value.map(
      (entry) => `${pad}  ${formatJsValue(entry, indent + 1)},`,
    );
    return `[\n${lines.join("\n")}\n${pad}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const lines = entries.map(([key, entry]) => {
      const keyLiteral = /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`;
      return `${pad}  ${keyLiteral}: ${formatJsValue(entry, indent + 1)},`;
    });
    return `{\n${lines.join("\n")}\n${pad}}`;
  }

  return String(value);
};

export const formatPlaygroundDocsSource = (
  importLine: string,
  componentName: string,
  props: Record<string, unknown>,
): string => {
  const propLines = Object.entries(props).map(([key, value]) => {
    if (typeof value === "string" && key === "accent") {
      return `  ${key}="${value}"`;
    }
    return `  ${key}={${formatJsValue(value, 1)}}`;
  });

  return `${importLine}\n\n<${componentName}\n${propLines.join("\n")}\n/>`;
};
