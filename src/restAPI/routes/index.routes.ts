import express from 'express'
import { ApiKey, Permission } from '../../auth/checkAuth'
import { ROLES } from '../../utils/constant'
const route = express.Router()

route.get('/api/health', (req, res) => {
   res.status(200).json({
      status: 'success',
      message: 'Server is running',
   })
})
//check API Key
route.use(ApiKey)
route.use('/v1/api/upload', require('./v1/upload.v1.routes'))
route.use('/v1/api/aws', require('./v1/aws.v1.routes'))
// //Check Permission
route.use(Permission(ROLES.USER))
//

route.use('/v1/api/product', require('./v1/product.v1.routes'))
route.use('/v1/api/discount', require('./v1/discount.v1.routes'))
route.use('/v1/api/cart', require('./v1/cart.v1.routes'))
route.use('/v1/api/checkout', require('./v1/checkout.v1.routes'))
route.use('/v1/api/inventory/shop', require('./v1/inventory.v1.routes'))
//
route.use('/v1/api/admin', require('./v1/admin.v1.routes'))
route.use('/v1/api', require('./v1/user.v1.routes'))
//

//
export default route

//
