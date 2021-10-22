import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let usuario

export default class UsuarioDAO {
  static async injectDB(conn) {
    if (usuario) {
      return
    }
    try {
      usuario = await conn.db(process.env.RESTREVIEWS_NS).collection("usuario")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in usuarioDAO: ${e}`,
      )
    }
  }


  static async getUsuario({
    filters = null,
    page = 0,
    usuariosPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("nombre" in filters) {
        query = { $text: { $search: filters["nombre"] } }
      } else if ("id_usuario" in filters) {
        query = { "id_usuario": { $eq: filters["id_usuario"] } }
      }
    }

    let cursor
    
    try {
      cursor = await usuario
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { usuariosList: [], totalNumusuarios: 0 }
    }

    const displayCursor = cursor.limit(usuariosPerPage).skip(usuariosPerPage * page)

    try {
      const usuariosList = await displayCursor.toArray()
      const totalNumusuarios = await usuario.countDocuments(query)

      return { usuariosList, totalNumusuarios }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { usuariosList: [], totalNumusuarios: 0 }
    }
  }

  static async addUsuario(id_usuario,nombre,correo,celular,fecha_nacimiento,fecha_ingreso,estado,rol) {
    try {
      const usuarioDoc = { 
        id_usuario:id_usuario,
        nombre:nombre, 
        correo:correo,
        celular:celular,
        fecha_nacimiento: fecha_nacimiento,
        fecha_ingreso: fecha_ingreso,
        estado: estado,
        rol:rol,
      }

      return await usuario.insertOne(usuarioDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async updateUsuario(id_usuario,nombre,correo,celular,fecha_nacimiento,fecha_ingreso,estado,rol) {
    try {
      const updateusuario = await usuario.updateOne(
        /*{ id_usuario:"3"},*/
        {id_usuario: id_usuario},
        { $set: { nombre:nombre, 
          correo:correo,
          celular:celular,
          fecha_nacimiento: fecha_nacimiento,
          fecha_ingreso: fecha_ingreso,
          estado: estado,
          rol:rol  } },
      )

      return updateUsuario
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteUsuario(id_usuario) {

    try {
      const deleteusuario = await usuario.deleteOne({
        id_usuario: id_usuario
      })

      return deleteUsuario
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }


}
  /*static async getusuarioByID(id) {
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
