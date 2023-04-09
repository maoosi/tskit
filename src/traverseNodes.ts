export default async function traverseNodes(
  node: any,
  callback: (node: TraverseNode) => Promise<void>,
  parentKey?: string | number,
  key?: string | number,
  path: (string | number)[] = []
): Promise<any> {
  if (node && Array.isArray(node)) {
    let newArray: any[] = [...node];
    let shouldContinue = true;

    const setFn = (newVal: any) => {
      newArray = newVal;
    };

    const breakFn = () => {
      shouldContinue = false;
    };

    const traverseNode: TraverseNode = {
      parentKey,
      childKeys: Array.from(Array(newArray.length).keys()),
      key,
      value: newArray,
      type: "array",
      path: typeof key !== "undefined" ? [...path, key] : [...path],
      set: setFn,
      break: breakFn,
    };

    await callback(traverseNode);

    if (shouldContinue) {
      for (let childKey = 0; childKey < node.length; childKey++) {
        const childValue = node[childKey];
        newArray[childKey] = await traverseNodes(
          childValue,
          callback,
          key,
          childKey,
          typeof key !== "undefined" ? [...path, key] : [...path]
        );
      }
    }

    return newArray;
  } else if (
    typeof node === "function" ||
    (typeof node === "object" && !!node)
  ) {
    let newObject: any = { ...node };
    let shouldContinue = true;

    const setFn = (newVal: any) => {
      newObject = newVal;
    };

    const breakFn = () => {
      shouldContinue = false;
    };

    const traverseNode: TraverseNode = {
      parentKey,
      childKeys: Object.keys(newObject),
      key,
      value: newObject,
      type: "object",
      path: typeof key !== "undefined" ? [...path, key] : [...path],
      set: setFn,
      break: breakFn,
    };

    await callback(traverseNode);

    if (shouldContinue) {
      for (const [childKey, childValue] of Object.entries(newObject)) {
        newObject[childKey] = await traverseNodes(
          childValue,
          callback,
          key,
          childKey,
          typeof key !== "undefined" ? [...path, key] : [...path]
        );
      }
    }

    return newObject;
  } else {
    let newValue = node;

    const setFn = (newVal: any) => {
      newValue = newVal;
    };

    const breakFn = () => {};

    const traverseNode: TraverseNode = {
      parentKey,
      childKeys: [],
      key,
      value: newValue,
      type: "value",
      path: typeof key !== "undefined" ? [...path, key] : [...path],
      set: setFn,
      break: breakFn,
    };

    await callback(traverseNode);

    return newValue;
  }
}

interface TraverseNode {
  parentKey?: string | number;
  childKeys?: (string | number)[];
  key?: string | number;
  value: any;
  type: "array" | "object" | "value";
  path: (string | number)[];
  set: (newValue: any) => void;
  break: () => void;
}
