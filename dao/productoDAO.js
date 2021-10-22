import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let producto

export default class ProductoDAO {
  static async injectDB(conn) {
    if (producto) {
      return
    }
    try {
      producto = await conn.db(process.env.RESTREVIEWS_NS).collection("producto")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in ProductoDAO: ${e}`,
      )
    }
  }


  static async getProducto({
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
      cursor = await producto
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { productosList: [], totalNumProductos: 0 }
    }

    const displayCursor = cursor.limit(productosPerPage).skip(productosPerPage * page)

    try {
      const productosList = await displayCursor.toArray()
      const totalNumProductos = await producto.countDocuments(query)

      return { productosList, totalNumProductos }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { productosList: [], totalNumProductos: 0 }
    }
  }

  static async addProducto(id_producto,nombre_producto, descripcion, valor_unitario,estado) {
    try {
      const productoDoc = { id_producto: id_producto,
        nombre_producto: nombre_producto,
        descripcion: descripcion,
        valor_unitario: valor_unitario,
        estado: estado, }

      return await producto.insertOne(productoDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async updateProducto(id_producto,nombre_producto,descripcion, valor_unitario,estado) {
    try {
      const updateProducto = await producto.updateOne(
        /*{ id_producto:"3"},*/
        {id_producto: id_producto},
        { $set: { descripcion: descripcion, nombre_producto: nombre_producto,
          valor_unitario: valor_unitario, estado: estado  } },
      )

      return updateProducto
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteProducto(id_producto) {

    try {
      const deleteProducto = await producto.deleteOne({
        id_producto: id_producto
      })

      return deleteProducto
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
