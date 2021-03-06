import express from "express"
import ProductoCtrl from "./producto.controller.js"
import UsuarioCtrl from "./usuario.controller.js"
import VentaCtrl from "./venta.controller.js"

const router = express.Router()


/*router.route("/").get((req, res) => res.send("Hello world"))*/
router.route("/").get(ProductoCtrl.apiGetProducto)
/*router.route("/usuario").get(UsuarioCtrl.apiGetUsuario)
/*router.route("/id/:id").get(ProductoCtrl.apiGetProductoById)
router.route("/descripcion").get(ProductoCtrl.apiGetProductoDescripcion)
router.route("/valorunitario").get(ProductoCtrl.apiGetProductoValorunitario)
router.route("/estado").get(ProductoCtrl.apiGetProductoEstado)*/

router
  .route("/productos")
  .post(ProductoCtrl.apiPostProducto)
  .put(ProductoCtrl.apiUpdateProducto)
  .delete(ProductoCtrl.apiDeleteProducto)

  router
  .route("/usuarios")
  .get(UsuarioCtrl.apiGetUsuario)
  .post(UsuarioCtrl.apiPostUsuario)
  .put(UsuarioCtrl.apiUpdateUsuario)
  .delete(UsuarioCtrl.apiDeleteUsuario)
 
  router
  .route("/ventas")
  .get(VentaCtrl.apiGetVenta)
  .post(VentaCtrl.apiPostVenta)
  .put(VentaCtrl.apiUpdateVenta)
  .delete(VentaCtrl.apiDeleteVenta)

  router
  .route('/usuarios/self')
  .get(UsuarioCtrl.apiGetDatosUsuario
  );
  
export default router