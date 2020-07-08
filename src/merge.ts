import _ from "lodash";

export function merge(...sources: any[]) {
  return sources.reduce(
    (merged, source) => _.mergeWith(merged, source, customizer),
    {}
  );
}

function customizer(objValue: any, srcValue: any) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
