import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let producto

export default class VentasDAO {
  static async injectDB(conn) {
    if (ventas) {
      return
    }
    try {
      ventas = await conn.db(process.env.RESTREVIEWS_NS).collection("ventas")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in ProductoDAO: ${e}`,
      )
    }
  }

  static async getVentas({
    filters = null,
    page = 0,
    productosPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("descripcion" in filters) {
        query = { $text: { $search: filters["descripcion"] } }
      } else if ("id_producto" in filters) {
        query = { "id_producto": { $eq: filters["id_producto"] } }
      }
    }

    let cursor
    
    try {
      cursor = await ventas
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { productosList: [], totalNumVentas: 0 }
    }

    const displayCursor = cursor.limit(productosPerPage).skip(productosPerPage * page)

    try {
      const productosList = await displayCursor.toArray()
      const totalNumVentas = await ventas.countDocuments(query)

      return { ventasList, totalNumVentas }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { ventasList: [], totalNumVentas: 0 }
    }
  }

  static async addVentas(id_ventas,id_cliente, vendedor, fecha_venta, estado_venta) {
    try {
      const productoDoc = { id_ventas: id_ventas,
        id_cliente: id_cliente,
        vendedor: vendedor,
        fecha_venta: fecha_venta,
        estado_venta: estado_venta, }

      return await ventas.insertOne(ventasDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async updateProducto(id_ventas,id_cliente, vendedor, fecha_venta, estado_venta) {
    try {
      const updateProducto = await venta.updateOne(
        /*{ id_producto:"3"},*/
        {id_ventas: id_ventas},
        { $set: { id_cliente: id_cliente, vendedor: vendedor,
          fecha_venta: fecha_venta, estado_venta: estado_venta  } },
      )

      return updateVenta
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteVentas(id_ventas) {

    try {
      const deleteVentas = await ventas.deleteOne({
        id_ventas: id_ventas
      })

      return deleteVentas
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }


}
  /*static async getProductoByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await restaurants.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await restaurants.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}*/