import VentaDAO from "../dao/ventaDAO.js"


export default class VentaController {
  static async apiGetVenta(req, res, next) {
    const ventasPerPage = req.query.ventasPerPage ? parseInt(req.query.ventasPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.descripcion) {
      filters.descripcion = req.query.descripcion
    } else if (req.query.id_venta) {
      filters.id_venta = req.query.id_venta
    } 

    const { ventasList, totalNumventas } = await VentaDAO.getVenta({
      filters,
      page,
      ventasPerPage,
    })

    let response = {
      ventas: ventasList,
      page: page,
      filters: filters,
      entries_per_page: ventasPerPage,
      total_results: totalNumventas,
    }
    res.json(response)
  }

  static async apiPostVenta(req, res, next) {
    try {
      const id_venta = req.body.id_venta
      const id_cliente = req.body.id_cliente
      const vendedor = req.body.vendedor
      const nombre_cliente = req.body.nombre_cliente
      const fecha_venta = req.body.fecha_venta
      const estado_venta = req.body.estado_venta
      const valor_venta = req.body.valor_venta

      const MiVenta = await VentaDAO.addVenta(
        id_venta,
        id_cliente,
        vendedor,
        nombre_cliente,
        fecha_venta,
        estado_venta,
        estado_venta,
        valor_venta,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateVenta(req, res, next) {
    try {
      const id_venta = req.body.id_venta
        const id_cliente = req.body.id_cliente
        const vendedor = req.body.vendedor
        const nombre_cliente= req.body.nombre_cliente
        const fecha_venta = req.body.fecha_venta
        const estado_venta = req.body.estado_venta
        const valor_venta = req.body.valor_venta

      const MiVenta = await VentaDAO.updateVenta(
        id_venta,
        id_cliente,
        vendedor,
        nombre_cliente,
        fecha_venta,
        estado_venta,
        estado_venta,
        valor_venta,
      )

      var { error } = MiVenta
      if (error) {
        res.status(400).json({ error })
      }


      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteVenta(req, res, next) {
    try {
      const id_venta = req.body.id_venta

      console.log(id_venta)
      const MiVenta = await VentaDAO.deleteVenta(
        id_venta,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}
  /*static async apiGetRestaurantById(req, res, next) {
    try {
      let id = req.params.id || {}
      let restaurant = await RestaurantsDAO.getRestaurantByID(id)
      if (!restaurant) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(restaurant)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetRestaurantCuisines(req, res, next) {
    try {
      let cuisines = await RestaurantsDAO.getCuisines()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}*/