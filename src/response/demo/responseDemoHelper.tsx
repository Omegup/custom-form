import { useImperativeHandle } from "react";
import responseDemoSource from "./ResponseDemo.tsx?raw";
import responseDemoTypesSource from "./responseDemoTypes.t.ts?raw";
import type * as types from "./responseDemoTypes.t";
import * as lib from "./library";

export const INITIAL_ITEMS: types.Item[] = [
  lib.branded({
    id: "name",
    type: "field",
    deleted: false,
    params: { name: "Full name", required: true },
  }),
  lib.branded({
    id: "note",
    type: "field",
    deleted: false,
    params: { name: "Note (optional)", required: false },
  }),
];

export const INITIAL_RESPONSES: Record<string, lib.Response> = {};

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const RESPONSE_DEMO_SOURCE = [
  withFileHeader("response/demo/responseDemoTypes.t.ts", responseDemoTypesSource),
  withFileHeader("response/demo/ResponseDemo.tsx", responseDemoSource),
].join("\n\n");

/** Registers validate/update on the viewer's internal impRef (school input pattern). */
export const useFieldMethods = (
  impRef: types.FieldExtra["impRef"],
  response: lib.ResponseSetter,
  required: boolean,
  label: string,
) => {
  useImperativeHandle(impRef, () => ({
    validate: (value) => {
      const text = value.data.value?.trim() ?? "";
      if (required && !text) return `${label} is required`;
      return null;
    },
    update: (value) => value ?? lib.emptyResponse(),
  }));

  const setDataValue = (text: string) => {
    response.setValue?.("data", { ...response.value.data, value: text });
  };

  return { setDataValue, value: response.value.data.value ?? "" };
};
