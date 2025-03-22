const express = require(`express`)
const app = express()

let cityController = require("../controllers/cityController")


app.get("/", cityController.getDataCity)
app.get("/:city_id", cityController.getCityByID)
app.post("/", cityController.addDataCity)
app.put("/:city_id", cityController.editDataCity)
app.delete("/:city_id", cityController.deleteDataCity)

module.exports = app