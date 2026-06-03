import { describe, expect, it } from "vitest";
import { canUserAccessDocument, canUserShareDocument } from "./lib/sharing";

describe("document sharing logic", () => {
  const doc = {
    ownerId: "u1",
    sharedWith: ["u2"],
  };

  it("allows owner and shared user to access a document", () => {
    expect(canUserAccessDocument(doc, "u1")).toBe(true);
    expect(canUserAccessDocument(doc, "u2")).toBe(true);
  });

  it("blocks users who were not granted access", () => {
    expect(canUserAccessDocument(doc, "u3")).toBe(false);
  });

  it("only allows the owner to share a document", () => {
    expect(canUserShareDocument(doc, "u1")).toBe(true);
    expect(canUserShareDocument(doc, "u2")).toBe(false);
  });
});