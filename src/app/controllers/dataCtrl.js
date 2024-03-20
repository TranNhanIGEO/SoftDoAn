const pool = require('../../dbConfig')
const query = require('../query/queryData')

const DataController = {
    showSchool(req, res) {
        pool.query(query.showSchool(), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)
        })
    },
    createSchool(req, res) {
        const {layer, id, name, address, web, long, lat} = req.body
        pool.query(query.createSchool({layer, id, name, address, web, long, lat}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)   
        })
    },
    updateSchool(req, res) {
        const {name, address, web} = req.body
        const id = req.params.id
        pool.query(query.updateSchool({id, name, address, web}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)   
        })
    },
    deleteSchool(req, res) {
        const id = req.params.id
        pool.query(query.deleteSchool({id}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)
        })
    },
    showScore(req, res) {
        const {layer, year} = req.query
        pool.query(query.showScore({layer, year}), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)   
        })
    },
    createScore(req, res) {
        const {layer, year, schoolids} = req.body
        pool.query(query.createScore({layer, year, schoolids}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)   
        })
    },
    updateScore(req, res) {
        const id = req.params.id
        const {layer, nv1, nv2, nv3} = req.body
        pool.query(query.updateScore({layer, nv1, nv2, nv3, id}), (error, result) => {
            if (error) throw error
            res.status(200).json(result)   
        })
    },
    showStatistic(req, res) {
        const {layer, year} = req.query
        pool.query(query.showStatistic({layer, year}), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)
        })   
    },
    createStatistic(req, res) {
        const {layer, year, schoolids} = req.body
        pool.query(query.createStatistic({layer, year, schoolids}), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)
        })
    },
    updateStatistic(req, res) {
        const id = req.params.id
        const {layer, ctieu, slnv1} = req.body
        pool.query(query.updateStatistic({layer, ctieu, slnv1, id}), (error, result) => {
            if (error) throw error
            res.status(200).json(result.rows)
        })       
    }
}

module.exports = DataController