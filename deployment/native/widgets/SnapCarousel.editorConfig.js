'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getProperties(values, defaultProperties, target) {
  if (values.dataType === "dynamic") {
    hidePropertiesIn(defaultProperties, values, ["staticItems"]);
  } else if (values.dataType === "static") {
    hidePropertiesIn(defaultProperties, values, ["data", "action", "content"]);
  }
  if (!values.autoplay) {
    hidePropertiesIn(defaultProperties, values, ["autoplayDelay", "autoplayInterval"]);
  } else {
    hidePropertiesIn(defaultProperties, values, ["lockScrollWhileSnapping"]);
  }
  if (values.carouselWidth === "full") {
    hidePropertiesIn(defaultProperties, values, ["customWidth"]);
  }
  if (values.layout === "default") {
    hidePropertiesIn(defaultProperties, values, ["layoutCardOffset"]);
  }
  if (!values.pagination) {
    hidePropertiesIn(defaultProperties, values, ["paginationColor"]);
  }
  return defaultProperties;
}
function hidePropertiesIn(propertyGroups, _value, keys) {
  keys.forEach(function (key) {
    return modifyProperty(function (_, index, container) {
      return container.splice(index, 1);
    }, propertyGroups, key, undefined, undefined);
  });
}
function modifyProperty(modify, propertyGroups, key, nestedPropIndex, nestedPropKey) {
  propertyGroups.forEach(function (propGroup) {
    var _propGroup$properties;
    if (propGroup.propertyGroups) {
      modifyProperty(modify, propGroup.propertyGroups, key, nestedPropIndex, nestedPropKey);
    }
    (_propGroup$properties = propGroup.properties) === null || _propGroup$properties === void 0 || _propGroup$properties.forEach(function (prop, index, array) {
      if (prop.key === key) {
        if (nestedPropIndex === undefined || nestedPropKey === undefined) {
          modify(prop, index, array);
        } else if (prop.objects) {
          modifyProperty(modify, prop.objects[nestedPropIndex].properties, nestedPropKey);
        } else if (prop.properties) {
          modifyProperty(modify, prop.properties[nestedPropIndex], nestedPropKey);
        }
      }
    });
  });
}
exports.getProperties = getProperties;
