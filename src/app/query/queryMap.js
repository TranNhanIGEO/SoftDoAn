const convert_vi_to_en = require('../../utils/vi_to_en')
const replace_regexp = require('../../utils/replace_regexp')

const getAddress = (address) => {
    switch (address) {
        case undefined:
            return `
                SELECT diachi
                FROM sonha
            `   
    
        default:
            return `
                SELECT lat, lon 
                FROM sonha 
                WHERE diachi LIKE '%${address}%'
            `
    }
}
const getMinScore = (layer) => {
    return `
        SELECT MIN(nv1)
        FROM diemchuan
        WHERE maloaihinh = '${layer}' AND namtuyensinh = 2023
    `

}
const getSchoolName = (school) => {
    switch (school) {
        case undefined:
            return `
                SELECT tentruong, diachi, trangweb, maloaihinh, ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM danhsachtruonghoc
            `
    
        default:
            return `
                SELECT tentruong, maloaihinh, ST_AsGeoJSON(ST_Transform(geom, 4326)):: jsonb as json
                FROM danhsachtruonghoc
                WHERE vi_to_en(tentruong) = '${replace_regexp(convert_vi_to_en(school))}'
            `
    }
}
const getSchoolInfo = ({layer, school}) => {
    return `
        SELECT a.nv1, a.nv2, a.nv3, a.maloaihinh, a.namtuyensinh, b.tentruong
        FROM diemchuan a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
        WHERE a.maloaihinh = '${layer}' AND b.tentruong = '${school}'
    `
}
const getSchoolDocument = ({school}) => {
    return `
        SELECT a.ckclgd, a.csvc, a.clgd, a.namtuyensinh, b.tentruong
        FROM tailieu a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
        WHERE tentruong = '${school}'
    `
}
const getLayerStatistic = (layer) => {
    return `
        SELECT b.tentruong
        FROM chitieu a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
        WHERE a.manhom = '${layer}'
    `
}
const renderChart = ({layer, school}) => {  
    return `
        SELECT a.ctieu, a.slnv1, a.namtuyensinh, b.tentruong
        FROM chitieu a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
        WHERE a.manhom = '${layer}' AND vi_to_en(b.tentruong) = '${replace_regexp(convert_vi_to_en(school))}'
    `
}
const advisingEnrollment = ({layer, distance, score, longitude, latitude}) => {
    return `
        SELECT a.matruong, a.nv1, a.nv2, a.nv3, b.tentruong, c.ctieu,
            ST_AsGeoJSON(ST_Intersection(b.geom, buffer))::json as pointJson, 
            ST_AsGeoJSON(buffer)::json as bufferJson
        FROM 
            (SELECT ST_Buffer((ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)::geography), ${distance})::Geometry as buffer) cliped, 
            diemchuan a
        JOIN danhsachtruonghoc b ON a.matruong = b.matruong
        JOIN chitieu c ON b.matruong = c.matruong
        JOIN loaihinhdaotao d ON a.maloaihinh = d.maloaihinh
        WHERE 
            a.maloaihinh = '${layer}'
            AND nv1 <= ${score}
            AND a.namtuyensinh = 2023
            AND c.namtuyensinh = 2023
			AND d.manhom = c.manhom
        GROUP BY a.matruong, a.nv1, a.nv2, a.nv3, b.tentruong, b.geom, buffer, c.ctieu
        HAVING ST_AsGeoJSON(ST_Intersection(b.geom, buffer)) <> '{"type":"Point","coordinates":[]}'
        ORDER BY a.nv1 DESC
        LIMIT 20
    `
}

module.exports = {
    getAddress,
    getMinScore,
    getSchoolName,
    getSchoolInfo,
    getSchoolDocument,
    getLayerStatistic,
    renderChart,
    advisingEnrollment
}