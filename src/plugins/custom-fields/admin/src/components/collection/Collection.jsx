import React, { useState, useEffect } from "react";

import { Box } from "@strapi/design-system";

import { Combobox } from "@strapi/design-system";
import { ComboboxOption } from "@strapi/design-system";

export default function Collection({
  collection,
  value,
  onChange,
  name,
  attribute,
}) {
  // const options = collection.entities;

  const [options, setOptions] = useState(collection.entities);

  useEffect(() => {
    setOptions(collection.entities);
  }, [collection]);

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
  const handleChange = (option) => {
    let _values = value;
    if (!["null", null, undefined].includes(_values)) {
      _values = JSON.parse(value);
    } else {
      _values = {};
    }

    if (!option) {
      delete _values[collection.name];
      _values = Object.keys(_values).length ? _values : null;
      onChangeValue(_values);
    } else {
      _values[collection.name] = {
        val: option.name,
        src: `${collection.name}s/${option.id}`,
        id: option.id,
        relationField: {
          [collection._relationField.name]:
            option[collection._relationField.name],
        },
      };
      onChangeValue(_values);
    }
  };

  const comboboxValue = JSON.parse(value)?.[collection.name]
    ? options?.find(
        (option) => option.id == JSON.parse(value)[collection.name].id
      )
    : "";

  return (
    <Box width="100%">
      <Combobox
        label={collection.name}
        placeholder="Add relation"
        value={comboboxValue}
        onChange={handleChange}
        // onInputChange={handleInputChange}
        onClear={() => {
          handleChange(undefined);
        }}
        // creatable
        // textValue={value ? JSON.parse(value)[collection.name].val : ""}
        // disabled={collection._disabled}
      >
        {options.map((option, index) => (
          <ComboboxOption key={option.name + option.id + index} value={option}>
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
