const showSchool = () => {
    return `
        SELECT matruong, tentruong, diachi, trangweb
        FROM danhsachtruonghoc
    `
}
const createSchool = ({layer, id, name, address, web, long, lat}) => {
    let currentYear = new Date().getFullYear()
    let insertData = ''
    let insertSchool = `
            INSERT INTO danhsachtruonghoc(matruong, tentruong, maloaihinh, diachi, trangweb, geom)
            VALUES ('${id}', '${name}', '{${layer}}', '${address}', '${web}', 'SRID=4326; POINT(${long} ${lat})');
    `
    if (layer.includes('00LTKC00')) {
        insertData += `
            INSERT INTO chitieu(matruong, manhom, namtuyensinh)
            VALUES ('${id}', '00CTLT00', ${currentYear});
            INSERT INTO diemchuan(matruong, maloaihinh, namtuyensinh)
            VALUES ('${id}', '00LTKC00', ${currentYear});
        `
          }  
    if (layer.includes('00LTHC00')) {
        insertData += `
            INSERT INTO chitieu(matruong, manhom, namtuyensinh)
            VALUES ('${id}', '00CTLTH00', ${currentYear});
            INSERT INTO diemchuan(matruong, maloaihinh, namtuyensinh)
            VALUES ('${id}', '00LTHC00', ${currentYear});
        `
    }
    const specialTypes = layer.filter((lyr) => (
        lyr !== '00LTKC00' && lyr !== '00LTHC00'
    ))
    if (specialTypes.length) {
        insertData += `
            INSERT INTO chitieu(matruong, manhom, namtuyensinh)
            VALUES ('${id}', '00CTLC00', ${currentYear});
        `
        insertData += specialTypes.map((lyr) => (`
            INSERT INTO diemchuan(matruong, maloaihinh, namtuyensinh)
            VALUES ('${id}', '${lyr}', ${currentYear});
        `)).join('')
    }
    return insertSchool + insertData
}
const updateSchool = ({id, name, address, web}) => {
    return `
        UPDATE danhsachtruonghoc
        SET tentruong = '${name}', diachi = '${address}', trangweb = '${web}'
        WHERE matruong = '${id}'
    `
}
const deleteSchool = ({id}) => {
    return `
        DELETE FROM danhsachtruonghoc
        WHERE matruong = '${id}'
    `
}
const showScore = ({layer, year}) => {
    return `
        SELECT a.*, b.tentruong
        FROM diemchuan a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
        WHERE a.maloaihinh = '${layer}' AND a.namtuyensinh = ${year}
    `
}
const createScore = ({layer, year, schoolids}) => {
    return schoolids.map((schoolid) => (`
        INSERT INTO diemchuan(matruong, maloaihinh, namtuyensinh)
        VALUES('${schoolid}', '${layer}', ${year});
    `)).join('')
}
const updateScore = ({layer, nv1, nv2, nv3, id}) => {
    return `
        UPDATE diemchuan SET 
        nv1 = ${nv1}, nv2 = ${nv2}, nv3 = ${nv3} 
        WHERE matruong = '${id}' AND maloaihinh = '${layer}'
    `
}
const showStatistic = ({layer, year}) => {
    return `
        SELECT a.*, b.tentruong
        FROM chitieu a
        JOIN danhsachtruonghoc b
        ON a.matruong = b.matruong
        WHERE a.manhom = '${layer}' AND a.namtuyensinh = ${year}
    `
}
const createStatistic = ({layer, year, schoolids}) => {
    return schoolids.map((schoolid) => (`
        INSERT INTO chitieu(matruong, manhom, namtuyensinh)
        VALUES('${schoolid}', '${layer}', ${year});
    `)).join('')
}
const updateStatistic = ({layer, ctieu, slnv1, id}) => {
    return `
        UPDATE chitieu SET 
        ctieu = ${ctieu}, slnv1 = ${slnv1}
        WHERE matruong = '${id}' AND manhom = '${layer}'
    `
}

module.exports = {
    showSchool,
    createSchool,
    updateSchool,
    deleteSchool,

    showScore,
    createScore,
    updateScore,

    showStatistic,
    createStatistic,
    updateStatistic
}