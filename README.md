# tskit

Just a bunch of TS utility functions.

- [delay](#delay)
- [jsonParse](#jsonparse)
- [jsonStringify](#jsonstringify)
- [traverseNodes](#traversenodes)
- [tryPromise](#trypromise)
- [tryPromiseAll](#trypromiseall)
- [usePromisesQueue](#usepromisesqueue)

## Functions

### delay

Async setTimeout.

```typescript
await delay(2000);
```

### jsonParse

JSON.parse with built-in error-catching and fallback value.

```typescript
const jsonObj = jsonParse(jsonString, {});
```

### jsonStringify

JSON.parse with built-in error-catching and fallback value.

```typescript
const jsonString = jsonStringify(jsonObj, "[]");
```

### traverseNodes

Walk object tree nodes and return a mutated copy.

```typescript
const newObj = await traverse(oldObj, async (node: TraverseNode) => {
  if (node.key === "__typename") {
    node.set(newValue);
    node.stopWalk();
  }
});

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
```

### tryPromise

Execute a promise with built-in error-catching and fallback value.

```typescript
const { data, err } = await tryPromise(promiseFn(), null);
```

### tryPromiseAll

Execute a promises array (Promise.all) with built-in error-catching and fallback values.

```typescript
const promises = [promiseFn(), promiseFn()];
const results = await tryPromiseAll(promises, null);
```

### usePromisesQueue

```typescript
const promisesFn = [
  async () => {
    return something;
  },
  async () => {
    return something;
  },
  async () => {
    return something;
  },
];

const queue = usePromisesQueue<SomethingType>(promisesFn);

const { results, errors } = await queue.resolve({
  concurrent: 10,
  retries: 1,
  interval: 1000,
  timeout: 15000,
});
```
