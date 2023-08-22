const { Pool } = require('pg');
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "3690",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

const obtenerJoyas = async ({ limits, order_by = "id_ASC", page = 1 }) => {

    const offset = (page - 1) * limits
    const [campo, direccion] = order_by.split("_")

    let consulta = format("SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset);

    pool.query(consulta);

    const { rows } = await pool.query(consulta);
    return rows;

}

const filtrarJoyas = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = []
    const values = []

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if (precio_min) agregarFiltro('precio', '>=', precio_min)
    if (precio_max) agregarFiltro('precio', '<=', precio_max)
    if (categoria) agregarFiltro('categoria', '=', categoria)
    if (metal) agregarFiltro('metal', '=', metal)

    let consulta = "SELECT * FROM inventario"

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    const { rows: inventario } = await pool.query(consulta, values)
    return inventario;
}

module.exports = { obtenerJoyas, filtrarJoyas }