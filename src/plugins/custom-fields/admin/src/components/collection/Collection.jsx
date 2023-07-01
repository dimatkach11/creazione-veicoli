import React, { useState, useEffect } from "react";

import { Flex, Box } from "@strapi/design-system";

import { Combobox } from "@strapi/design-system";
import { ComboboxOption } from "@strapi/design-system";

export default function Collection({
  collection,
  value,
  onChange,
  name,
  attribute,
}) {
  const options = collection.entities;

  const onChangeValue = (value) => {
    onChange({
      target: {
        name,
        value: JSON.stringify(value),
        type: attribute.type,
      },
    });
  };

  const handleInputChange = (e) => {
    return;
    const targetValue = e.target.value;
    if (!targetValue) {
    } else {
    }
  };
  const handleChange = (val) => {
    let _values = value;
    if (_values != "null") {
      _values = JSON.parse(value);
    } else {
      _values = {};
    }

    if (!val) {
      delete _values[collection.name];
      _values = Object.keys(_values).length ? _values : null;
      onChangeValue(_values);
    } else {
      _values[collection.name] = val;
      onChangeValue(_values);
    }
  };

  return (
    <Box width="100%">
      <Combobox
        label={collection.name}
        placeholder="Add relation"
        // value={value}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onClear={() => {
          handleChange(undefined);
        }}
        disabled={collection._disabled}
      >
        {options.map((option, index) => (
          <ComboboxOption key={option.name + index} value={option.name}>
            {option.name}
          </ComboboxOption>
        ))}
      </Combobox>
    </Box>
  );
}
// Collection.defaultProps = {
//   value: "null",
// };
