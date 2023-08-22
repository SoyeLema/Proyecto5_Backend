const { obtenerJoyas, filtrarJoyas } = require('./consultas');

const express = require('express');
const app = express();

app.listen(3000, console.log("Server Funcionando en puerto 3000"));

const reportarConsulta = async (req, res, next) => {
    const parametros = req.query
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    con los parámetros:
    `, parametros)
    next()
}

const prepararHATEOAS = (joyas) => {
    const results = joyas.map((j) => {
        return {
            name: j.nombre,
            href: `/joyas/joya/${j.id}`,
        }
    })
    const totalJoyas = joyas.length
    const stockTotal = joyas.reduce((totalStock, joya) => totalStock + joya.stock, 0)
    const HATEOAS = {
        totalJoyas,
        stockTotal,
        results
    }
    return HATEOAS
}

app.get("/joyas", reportarConsulta, async (req, res) => {
    try {
        const queryStrings = req.query;
        console.log(queryStrings)
        const joyas = await obtenerJoyas(queryStrings);
        const HATEOAS = prepararHATEOAS(joyas)
        return res.json(HATEOAS);
    } catch (error) {
        res.status(500).send(error)
    }
});

app.get('/joyas/filtros', reportarConsulta, async (req, res) => {
    try {
        const queryStrings = req.query
        const joyas = await filtrarJoyas(queryStrings)
        res.json(joyas)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("*", async (req, res) => {
    res.status(404).send("Esta ruta no existe")
})