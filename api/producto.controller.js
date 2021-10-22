import ProductoDAO from "../dao/productoDAO.js"

export default class ProductoController {
  static async apiGetProducto(req, res, next) {
    const productosPerPage = req.query.productosPerPage ? parseInt(req.query.productosPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.descripcion) {
      filters.descripcion = req.query.descripcion
    } else if (req.query.id_producto) {
      filters.id_producto = req.query.id_producto
    } 

    const { productosList, totalNumProductos } = await ProductoDAO.getProducto({
      filters,
      page,
      productosPerPage,
    })

    let response = {
      productos: productosList,
      page: page,
      filters: filters,
      entries_per_page: productosPerPage,
      total_results: totalNumProductos,
    }
    res.json(response)
  }

  static async apiPostProducto(req, res, next) {
    try {
      const id_producto = req.body.id_producto
      const nombre_producto = req.body.nombre_producto
      const descripcion = req.body.descripcion
      const valor_unitario = req.body.valor_unitario
      const estado = req.body.estado

      const MiProducto = await ProductoDAO.addProducto(
        id_producto,
        nombre_producto,
        descripcion,
        valor_unitario,
        estado,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateProducto(req, res, next) {
    try {
      const id_producto = req.body.id_producto
      const nombre_producto = req.body.nombre_producto
      const descripcion = req.body.descripcion
      const valor_unitario = req.body.valor_unitario
      const estado = req.body.estado

      const MiProducto = await ProductoDAO.updateProducto(
        id_producto,
        nombre_producto,
        descripcion,
        valor_unitario,
        estado,
      )

      var { error } = MiProducto
      if (error) {
        res.status(400).json({ error })
      }


      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteProducto(req, res, next) {
    try {
      const id_producto = req.body.id_producto

      console.log(id_producto)
      const MiProducto = await ProductoDAO.deleteProducto(
        id_producto,
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