export const polygonSrc = ({ name, data }) => {
  const boundaries = data?.map((dt) => ({
    type: "Feature",
    geometry: JSON.parse(dt.shape),
  }));
  const collection = {
    type: "FeatureCollection",
    features: boundaries,
  };
  const geojson = {
    type: "geojson",
    name: name,
    data: collection,
  };
  return geojson;
};

export const pointSrc = ({ name, data, attributes }) => {
  const getAttributes = (dt) => ( 
    Object.fromEntries(attributes.map(obj => [obj, dt[obj]]))
  )
  const points = data?.map((dt) => ({
    type: "Feature",
    geometry: dt.json,
    properties: getAttributes(dt),
  }));
  const collection = {
    type: "FeatureCollection",
    features: points,
  };
  const geojson = {
    type: "geojson",
    name: name,
    data: collection,
  };
  return geojson;
};
