import UsuarioDAO from "../dao/usuarioDAO.js"



export default class UsuarioController {
  static async apiGetUsuario(req, res, next) {
    const usuariosPerPage = req.query.usuariosPerPage ? parseInt(req.query.usuariosPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.descripcion) {
      filters.descripcion = req.query.descripcion
    } else if (req.query.id_usuario) {
      filters.id_usuario = req.query.id_usuario
    } 

    const { usuariosList, totalNumusuarios } = await UsuarioDAO.getUsuario({
      filters,
      page,
      usuariosPerPage,
    })

    let response = {
      usuarios: usuariosList,
      page: page,
      filters: filters,
      entries_per_page: usuariosPerPage,
      total_results: totalNumusuarios,
    }
    res.json(response)
  }
  static async apiGetDatosUsuario(req, res, next) {
    console.log('HOLAAAA')
    consultarOcrearusuario(req, genercCallback(res));
    const usuariosPerPage = req.query.usuariosPerPage ? parseInt(req.query.usuariosPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.descripcion) {
      filters.descripcion = req.query.descripcion
    } else if (req.query.id_usuario) {
      filters.id_usuario = req.query.id_usuario
    } 

    const { usuariosList, totalNumusuarios } = await UsuarioDAO.getUsuario({
        filters,
        page,
        usuariosPerPage,
      })

      let response = {
        usuarios: usuariosList,
        page: page,
        filters: filters,
        entries_per_page: usuariosPerPage,
        total_results: totalNumusuarios,
      }
      res.json(response)
    console.log('HOLA LEEME')
  }
  

  static async apiPostUsuario(req, res, next) {
    try {
      const id_usuario = req.body.id_usuario
      const nombre = req.body.nombre
      const correo = req.body.correo
      const celular = req.body.celular
      const fecha_ingreso = req.body.fecha_ingreso
      const estado = req.body.estado
      const rol = req.body.rol


      const MiUsuario = await UsuarioDAO.addUsuario(
        id_usuario,
        nombre,
        correo,
        celular,
        fecha_ingreso,
        estado,
        rol,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateUsuario(req, res, next) {
    try {
      const id_usuario = req.body.id_usuario
      const nombre = req.body.nombre
      const correo = req.body.correo
      const celular = req.body.celular
      const fecha_ingreso = req.body.fecha_ingreso
      const estado = req.body.estado
      const rol = req.body.rol

      const MiUsuario = await UsuarioDAO.updateUsuario(
        id_usuario,
        nombre,
        correo,
        celular,
        fecha_ingreso,
        estado,
        rol,
      )

      var { error } = MiUsuario
      if (error) {
        res.status(400).json({ error })
      }


      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteUsuario(req, res, next) {
    try {
      const id_usuario = req.body.id_usuario

      console.log(id_usuario)
      const MiUsuario = await UsuarioDAO.deleteUsuario(
        id_usuario,
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
