import { expect, test } from "vitest";
import traverseNodes from "../src/traverseNodes";

const initialJson = {
  a: 1,
  b: {
    __typename: "OldValue",
    c: 3,
    d: {
      e: {
        __typename: "OldValue",
        f: {
          __typename: "OldValue",
          g: 7,
        },
      },
    },
  },
  h: [
    {
      __typename: "OldValue",
      i: [
        {
          __typename: "OldValue",
          j: {
            __typename: "OldValue",
            k: "hello",
          },
        },
      ],
    },
  ],
};

const expectedJson = {
  a: 1,
  b: {
    __typename: "NewValue",
    c: 3,
    d: {
      _e: {
        __typename: "NewValue",
        f: {
          __typename: "NewValue",
          g: 7,
        },
      },
    },
  },
  h: [
    {
      __typename: "NewValue",
      i: [
        {
          __typename: "OldValue",
          j: {
            __typename: "OldValue",
            k: "hello",
          },
        },
      ],
    },
  ],
};

test("traverseNodes", async () => {
  const mutatedJson = await traverseNodes(initialJson, async (node) => {
    console.log(JSON.stringify({ key: node.key, path: node.path }, null, 2));

    if (node.key === "__typename") node.set("NewValue");

    if (node?.childKeys?.includes("e")) {
      const { e, ...value } = node.value;
      node.set({ ...value, _e: node.value["e"] });
    }

    if (node.key === "i") node.break();
  });

  expect(mutatedJson).toStrictEqual(expectedJson);
  expect(initialJson).not.toStrictEqual(expectedJson);
});
