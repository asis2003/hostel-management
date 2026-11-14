export function withId(doc) {
  if (!doc) return doc;
  const obj = typeof doc.toJSON === "function" ? doc.toJSON() : { ...doc };
  obj._id = obj.id;
  return obj;
}

export function withIds(arr) {
  return Array.isArray(arr) ? arr.map(withId) : arr;
}
