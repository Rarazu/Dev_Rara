const {request, response} = require("express");
const req = require("express/lib/request");

let modelCity = require("../models/index").cities

exports.getDataCity = (request, response) => {
    modelCity.findAll()
    .then((result) => {
        return response.json(result)
    })
    .catch((err) => {
        message: err.message
    })
}

exports.getCityByID = (request, response) => {
    const { city_id } = request.params;
    modelCity.findByPk(city_id)
        .then((result) => {
            if (!result) {
                return response.status(404).json({ message: "City not found" });
            }
            return response.json(result);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ message: err.message }); 
        });
};

exports.addDataCity = (request, response) => {
    let newCity = {
        city_name : request.body.city_name,
    }

    modelCity.create(newCity)
    .then(result => {
        return response.json({
            message: `added city data success`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.editDataCity = (request, response) => {
    let id = request.params.city_id
    let dataCity = {
        city_name : request.body.city_name,
    }

    modelCity.update(dataCity, {where:{city_id: id}})
    .then(result => {
        return response.json({
            message: `update city data success`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.deleteDataCity =  (request, response) => {
    let id = request.params.city_id

    modelCity.destroy({where: {city_id: id}})
    .then(result => {
        return response.json({
            message: `delete city data success`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}