export const cast = <T>(v: unknown): T => v as T;

export const noop = () => {};

export const uuid = /*#__PURE__*/ (() => {
  let id = 0;
  return () => {
    id++;
    return id.toString(36);
  };
})();
