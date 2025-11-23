import Ajv from "ajv";
import schema from "../data/messages.schema.json";
import cards from "../data/messages.json";

test("messages.json must satisfy JSON Schema", () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const ok = validate(cards);
  if (!ok) {
    console.error(validate.errors);
  }
  expect(ok).toBe(true);
  expect(Array.isArray(cards)).toBe(true);
  expect(cards.length).toBeGreaterThanOrEqual(36);
});