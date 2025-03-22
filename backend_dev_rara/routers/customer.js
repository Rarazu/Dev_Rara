const express = require(`express`)
const app = express()

let customerController = require("../controllers/customerController")


app.get("/", customerController.getDataCustomer)
app.get("/:customers_id", customerController.getCustomerByID)
app.post("/", customerController.addDataCustomer)
app.put("/:customers_id", customerController.editDataCustomer)
app.delete("/:customers_id", customerController.deleteDataCustomer)

module.exports = app