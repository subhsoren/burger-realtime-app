
const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/adminController')

//middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')


function initRoutes(app){
app.get("/", homeController().index)
//login
app.get("/login",guest, authController().login)
app.post("/login", authController().postLogin)

//register
app.get("/register",guest,authController().register)
app.post('/register',authController().postRegister)

//logout
app.post('/logout',authController().logout)
//cart
app.get("/cart",cartController().index)
app.post('/update-cart',cartController().update)

//customers orders
app.post('/orders',auth,  orderController().store)
app.get('/customer/orders',auth, orderController().index)

//Admin routes
app.get('/admin/orders',admin, adminOrderController().index)




}
module.exports = initRoutes