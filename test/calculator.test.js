import { describe, it } from "node:test";
import assert from "node:assert";

function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

let LAST_RESULT = 0;

function calculateExpression(expression) {
  try {
    let normalizedExpression = normalizeExpression(expression);
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );
    let result = Function(`"use strict"; return (${normalizedExpression})`)();
    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }
    return result;
  } catch (e) {
    return "Error";
  }
}

describe("normalizeExpression", () => {
  it("replaces sin( with sinDeg(", () => {
    assert.strictEqual(normalizeExpression("sin(30)"), "sinDeg(30)");
  });

  it("replaces cos( with cosDeg(", () => {
    assert.strictEqual(normalizeExpression("cos(45)"), "cosDeg(45)");
  });

  it("replaces tan( with tanDeg(", () => {
    assert.strictEqual(normalizeExpression("tan(60)"), "tanDeg(60)");
  });

  it("replaces e with Math.E", () => {
    assert.strictEqual(normalizeExpression("e"), "Math.E");
  });

  it("replaces pi with Math.PI", () => {
    assert.strictEqual(normalizeExpression("pi"), "Math.PI");
  });

  it("does not replace e inside words", () => {
    assert.strictEqual(normalizeExpression("test"), "test");
  });
});

describe("calculateExpression", () => {
  it("adds two numbers", () => {
    assert.strictEqual(calculateExpression("2+3"), 5);
  });

  it("subtracts two numbers", () => {
    assert.strictEqual(calculateExpression("10-4"), 6);
  });

  it("multiplies two numbers", () => {
    assert.strictEqual(calculateExpression("3*7"), 21);
  });

  it("divides two numbers", () => {
    assert.strictEqual(calculateExpression("10/2"), 5);
  });

  it("handles decimal numbers", () => {
    assert.strictEqual(calculateExpression("3.5+2.5"), 6);
  });

  it("handles parentheses", () => {
    assert.strictEqual(calculateExpression("(2+3)*4"), 20);
  });

  it("handles exponentiation", () => {
    assert.strictEqual(calculateExpression("2**3"), 8);
  });

  it("handles negative numbers", () => {
    assert.strictEqual(calculateExpression("-5+3"), -2);
  });

  it("respects operator precedence", () => {
    assert.strictEqual(calculateExpression("2+3*4"), 14);
  });

  it("returns Error for division by zero", () => {
    assert.strictEqual(calculateExpression("1/0"), "Error");
  });

  it("returns Error for invalid expression", () => {
    assert.strictEqual(calculateExpression("2+"), "Error");
  });

  it("returns Error for empty expression", () => {
    assert.strictEqual(calculateExpression(""), "Error");
  });

  it("preserves ans as a keyword", () => {
    LAST_RESULT = 10;
    assert.strictEqual(calculateExpression("ans+5"), 15);
    LAST_RESULT = 0;
  });
});
