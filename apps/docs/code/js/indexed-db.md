# IndexedDB

## 语法

```js
let db;
// open database
const request = window.indexedDB.open('MyTestDatabase', 3);
request.onerror = (event) => {
  console.error(`Database error: ${event.target.errorCode}`);
};
request.onsuccess = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore("name", { keyPath: "myKey" });
};
```

[文档](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)

[dexie](https://www.npmjs.com/package/dexie)
