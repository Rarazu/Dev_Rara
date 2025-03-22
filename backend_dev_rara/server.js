const express = require(`express`)
const app = express()
const PORT = 8000
const cors = require(`cors`)
app.use(cors())
app.use(express.static(__dirname))
app.use(express.json());

// prefix = imbuan endpoint
let routes = [
    {prefix: `/city`, route: require(`./routers/city`)}, 
    {prefix: `/customer`, route: require(`./routers/customer`)},
]

for (let i = 0; i < routes.length; i++) {
    app.use(routes[i].prefix, routes[i].route)
}

app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
})