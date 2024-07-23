export function changeEnumToObject(enumObject) {
  const StringIsNumber = (value) => isNaN(Number(value)) === false;
  const enumArray = (Object.values(enumObject) || [])
    .filter(StringIsNumber)
    .map((key: number) => ({
      name: enumObject[key],
      description: key.toString(),
    }));
  const transformedEnum = enumArray.reduce((a, b) => {
    return (a[b?.name] = b.description), a;
  }, {});

  return transformedEnum;
}