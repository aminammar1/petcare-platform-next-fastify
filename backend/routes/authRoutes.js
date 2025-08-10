import * as authController from '../controllers/authController.js'
import * as cart from '../controllers/add_to_card.js'
import * as cartController from '../controllers/cartController.js'
import * as deleteItem from '../controllers/Deleteitem.js'
import * as cartCount from '../controllers/CartItemsCount.js'
import * as payment from '../controllers/Paiment.js'
import * as reminder from '../controllers/reminderController.js'
import * as claim from '../controllers/Claim_Vet.js'
import * as payment2 from '../controllers/Paiment2.js'
import * as profile from '../controllers/UserProfile.js'
import * as userImg from '../controllers/Userimg.js'
import * as getUserImage from '../controllers/Getuserimg.js'
import * as deleteUser from '../controllers/Deleteuser.js'
import * as offer from '../controllers/getOfferName.js'
import * as vetLogin from '../controllers/vetLogin.js'
import * as claimVetData from '../controllers/Get_claim_vet.js'
import * as admin from '../controllers/Admin.js'
import { requireAuth } from '../middleware/verifyJWT.js'
import { requireRole } from '../middleware/verifyRole.js'
import Roles from '../config/roles.js'
import * as reclam from '../controllers/reclamaùation.js'
import * as getReclamations from '../controllers/getreaclamation.js'
import * as device from '../controllers/deviceController.js'
import { analyzeImage } from '../controllers/emotionController.js'
import multipart from '@fastify/multipart'

async function authRoutes(fastify) {
  await fastify.register(multipart)

  fastify.post('/auth/register', authController.register)
  fastify.post('/auth/login', authController.login)
  fastify.get('/auth/refresh', authController.refresh)
  fastify.post('/auth/logout', authController.logout)
  fastify.post('/auth/forgotPassword', authController.forgotPassword)
  fastify.post('/auth/resetPassword', authController.resetPassword)
  fastify.post('/add_to_card', cart.addToCart)
  fastify.get('/cart_items', cartController.retrieveCartIems)
  fastify.delete('/cart_deleted/:id', deleteItem.deleteCartItem)
  fastify.get('/CartItemsCount', cartCount.getCartItemsCount)
  fastify.post('/save_payment', payment.savePayment)
  fastify.post('/save_reminder', reminder.saveReminder)
  fastify.post('/vet_claim', claim.saveClaim)
  fastify.post('/save_payment2', payment2.savePayment2)
  fastify.get('/user_info/:email', profile.getUserInfo)
  fastify.post('/save_user_info', userImg.saveUserInfo)
  fastify.get('/user_image/:email', getUserImage.getUserImage)
  fastify.delete('/user/:email', deleteUser.deleteUser)
  fastify.get('/offer_name/:email', offer.getOfferName)
  fastify.get('/Vet_Login/:email', vetLogin.vetLogin)
  fastify.get('/Get_Vet_Claim', claimVetData.getAllClaimVetData)
  fastify.post(
    '/Admin_page',
    { preHandler: [requireAuth, requireRole(Roles.Admin)] },
    admin.A_page
  )
  fastify.post('/Reclamation', reclam.saveReclamation)
  fastify.get('/Get_R', getReclamations.getReclamations)
  fastify.post('/C_DeviceId', device.checkDeviceId)
  fastify.post('/Analiser', async (request, reply) => {
    const parts = request.parts()
    for await (const part of parts) {
      if (part.file) {
        const chunks = []
        for await (const chunk of part.file) {
          chunks.push(chunk)
        }
        const imageBuffer = Buffer.concat(chunks)
        try {
          const response = await analyzeImage(imageBuffer)
          return reply.send(response)
        } catch (error) {
          return reply.code(500).send({ error: error.message })
        }
      } else {
        return reply.code(400).send({ error: 'Image is required' })
      }
    }
  })
}

export default authRoutes
