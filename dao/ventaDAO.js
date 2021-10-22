import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let ventas

export default class VentaDAO {
  static async injectDB(conn) {
    if (venta) {
      return
    }
    try {
      venta = await conn.db(process.env.RESTREVIEWS_NS).collection("venta")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in VentaDAO: ${e}`,
      )
    }
  }

  static async getVenta({
    filters = null,
    page = 0,
    ventassPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("descripcion" in filters) {
        query = { $text: { $search: filters["descripcion"] } }
      } else if ("id_venta" in filters) {
        query = { "id_venta": { $eq: filters["id_venta"] } }
      }
    }

    let cursor
    
    try {
      cursor = await ventas
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { ventasList: [], totalNumVentas: 0 }
    }

    const displayCursor = cursor.limit(ventassPerPage).skip(ventassPerPage * page)

    try {
      const ventasList = await displayCursor.toArray()
      const totalNumVentas = await ventas.countDocuments(query)

      return { ventasList, totalNumVentas }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { ventasList: [], totalNumVentas: 0 }
    }
  }

  static async addVenta(id_venta,id_cliente, vendedor,nombre_cliente, fecha_venta, estado_venta,valor_venta) {
    try {
      const ventasDoc = { id_venta: id_venta,
        id_cliente: id_cliente,
        vendedor: vendedor,
        nombre_cliente: nombre_cliente,
        fecha_venta: fecha_venta,
        estado_venta: estado_venta,
        valor_venta:valor_venta }

      return await ventas.insertOne(ventasDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async updateVenta(id_venta,id_cliente, vendedor,nombre_cliente, fecha_venta, estado_venta, valor_venta) {
    try {
      const updateVentas = await venta.updateOne(
        /*{ id_venta:"3"},*/
        {id_venta: id_venta},
        { $set: { id_cliente: id_cliente, vendedor: vendedor, nombre_cliente:nombre_cliente,
          fecha_venta: fecha_venta, estado_venta: estado_venta, valor_venta:valor_venta  } },
      )

      return updateVentas
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteVenta(id_venta) {

    try {
      const deleteVentas = await ventas.deleteOne({
        id_venta: id_venta
      })

      return deleteVentas
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }


}
  /*static async getVentasByID(id) {
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