const {request, response} = require("express");
const req = require("express/lib/request");
const axios = require("axios");

let modelCustomer = require("../models/index").customers

exports.getDataCustomer = (request, response) => {
    modelCustomer.findAll()
    .then((result) => {
        return response.json(result)
    })
    .catch((err) => {
        message: err.message
    })
}

exports.getCustomerByID = (request, response) => {
    const { customers_id } = request.params; 
    modelCustomer.findByPk(customers_id)
        .then((result) => {
            if (!result) {
                return response.status(404).json({ message: "Customer not found" });
            }
            return response.json(result); 
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ message: err.message }); 
        });
};


const fetchCoordinates = async (address) => {
    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: address,
                format: "json",
                limit: 1
            }
        });

        if (response.data.length > 0) {
            return {
                latitude: response.data[0].lat,
                longitude: response.data[0].lon
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
};

exports.addDataCustomer = async (request, response) => {
    try {
        const { name, code, address, city_id } = request.body;

        if (!address) {
            return response.status(400).json({
                message: "Address is required"
            });
        }

        const coordinates = await fetchCoordinates(address);

        if (!coordinates) {
            return response.status(400).json({
                message: "Invalid address. Please enter a valid location."
            });
        }

        let newCustomer = {
            name,
            code,
            address,
            city_id,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        };

        await modelCustomer.create(newCustomer);

        return response.json({
            message: "Added customer data successfully",
            data: newCustomer
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message
        });
    }
};

exports.editDataCustomer = async (request, response) => {
    try {
        const id = request.params.customers_id;
        const { name, code, address, city_id } = request.body;

        // Pengecekan jika alamat kosong
        if (!address) {
            return response.status(400).json({
                message: "Address is required"
            });
        }

        // Mendapatkan koordinat berdasarkan alamat
        const coordinates = await fetchCoordinates(address);

        // Jika koordinat tidak ditemukan, kembalikan pesan error
        if (!coordinates) {
            return response.status(400).json({
                message: "Invalid address. Please enter a valid location."
            });
        }

        // Data customer yang akan diperbarui
        let updatedCustomer = {
            name,
            code,
            address,
            city_id,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        };

        // Update data customer di database
        await modelCustomer.update(updatedCustomer, {
            where: { customers_id: id }
        });

        return response.json({
            message: "Customer data updated successfully",
            data: updatedCustomer
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message
        });
    }
};


exports.deleteDataCustomer =  (request, response) => {
    let id = request.params.customers_id

    modelCustomer.destroy({where: {customers_id: id}})
    .then(result => {
        return response.json({
            message: `delete customer data success`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}