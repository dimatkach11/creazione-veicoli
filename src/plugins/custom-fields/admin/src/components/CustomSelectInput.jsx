import React, { useState, useEffect } from "react";

import { Flex } from "@strapi/design-system";

import { request, useCMEditViewDataManager } from "@strapi/helper-plugin";
import pluginId from "../pluginId";
import Collection from "./collection/Collection";
import { async } from "../../../../../../build/4238.449f7f96.chunk";

const fetchCollection = async (collectionName, filter) => {
  const requestURL = `/${pluginId}/custom-select`;
  const data = await request(requestURL, {
    method: "POST",
    body: { collectionTypeNames: [collectionName], filter },
  });

  return data.collections;
};

const initialOptions = async (
  _collectionTypes,
  _value,
  collectionTypeNames
) => {
  let count = 0;
  for (const collectionTypeName of collectionTypeNames) {
    if (!_collectionTypes[count].entities.length) {
      const collection = await fetchCollection(
        collectionTypeName,
        _value[collectionTypeName].relationField
      );
      if (collection?.[0].entities) {
        _collectionTypes[count].entities = collection[0].entities;
      }
      console.log(_collectionTypes);
    }
    count++;
  }
  return _collectionTypes;
};

export default function Input({
  onChange,
  value,
  name,
  attribute,
  error,
  required,
}) {
  const { allLayoutData, modifiedData } = useCMEditViewDataManager();

  const [collections, setCollections] = useState([]);

  const models = name.split("2");

  const collectionTypeNames = models.map((item) => item.split("__")[0]);
  const relationFields = collectionTypeNames.map((collectionType, index) => {
    if (!index) {
      return { name: models[index + 1].split("__")[1] };
    }

    return { name: models[index].split("__")[1] };
  });

  useEffect(() => {
    const _value = JSON.parse(value);
    console.log(_value);

    fetchCollection(collectionTypeNames[0]).then((collection) => {
      if (collection) {
        const _collectionTypes = collectionTypeNames.map((name, index) => {
          if (!index) {
            return {
              ...collection[0],
              _relationField: relationFields[0],
              _selected: false,
              // _disabled: false,
            };
          }

          return {
            name,
            entities: [],
            _relationField: relationFields[index],
            _selected: false,
            // _disabled: true,
          };
        });

        if (_value) {
          initialOptions(_collectionTypes, _value, collectionTypeNames).then(
            (_collectionTypes) => {
              setCollections(_collectionTypes);
            }
          );
        } else {
          setCollections(_collectionTypes);
        }
      }
    });
  }, []);

  const updateCollectionEntities = async (collections = []) => {
    let currentCollection = null;
    let nextCollectionName = null;
    const _value = JSON.parse(value);
    for (let index = 0; index < collections.length; index++) {
      const collection = collections[index];
      if (collection._selected) {
        currentCollection = collection;
        nextCollectionName = collectionTypeNames[index + 1];

        // console.log(collection, value, entity, filter);
      }
    }
    if (currentCollection && nextCollectionName) {
      // debugger;
      const collection = currentCollection;
      const nextCollection = collections.find(
        (collection) => collection.name === nextCollectionName
      );
      const entity = collection.entities.find(
        (entity) => entity.name == _value[collection.name].val
      );

      const filter = {
        [nextCollection._relationField.name]:
          entity[nextCollection._relationField.name],
      };

      return await fetchCollection(nextCollectionName, filter);
    }
    return collections;
  };

  useEffect(() => {
    const _value = JSON.parse(value);
    let _valueContentTypeNames = null;
    let _collections = [];
    if (_value != null) {
      _valueContentTypeNames = Object.keys(_value);

      _collections = collections.map((collection, index) => {
        if (_value[collection.name] != undefined) {
          return { ...collection, _selected: true };
        }

        return { ...collection, _selected: false };
      });
    } else {
      _collections = collections.map((collection) => {
        return { ...collection, _selected: false };
      });
    }

    let temp = true;
    _collections = _collections.map((collection, index) => {
      // debugger;
      if (temp && !collection._selected) {
        temp = false;
      }
      if (index && !temp) {
        // console.log(collection);
        return {
          ...collection,
          entities: [],
          _selected: false,
        };
      }

      return collection;
    });

    updateCollectionEntities(_collections).then((response) => {
      if (response) {
        _collections = _collections.map((collection, index) => {
          // console.log(collection);

          if (collection.name === response[0].name) {
            collection["entities"] = response[0].entities;
          }

          return collection;
        });
      }
      setCollections(_collections);
      console.log(response, _collections, _value);
    });
  }, [value]);

  const props = {
    value,
    onChange,
    name,
    attribute,
  };

  return (
    <Flex direction="column" alignItems="start" gap={3}>
      {collections &&
        collections.map((collection) => (
          <Collection
            key={collection.name}
            collection={collection}
            {...props}
          />
        ))}
    </Flex>
  );
}
Input.defaultProps = {
  value: null,
};
