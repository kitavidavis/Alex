enum GeometryType {
    "Point",
    "LineString",
    "Polygon",
    "MultiPoint",
    "MultiLineString",
    "MultiPolygon"
}

export interface Geometry {
    type: string;
    properties: {name: string}, geometry: {type: GeometryType, coordinates: []}
}