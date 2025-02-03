interface Service {
   Implementation: any
   dependencies: string[]
   singleton: boolean
}

class DIContainer {
   private services: Map<string, Service>
   private singletons: Map<string, Service>

   constructor() {
      this.services = new Map()
      this.singletons = new Map()
   }

   // Register a service with its implementation
   register(name: string, Implementation: any, dependencies: string[] = []) {
      this.services.set(name, {
         Implementation,
         dependencies,
         singleton: false,
      })
      return this
   }
   // Register a singleton service
   registerSingleton(name: string, Implementation: any, dependencies = []) {
      this.services.set(name, {
         Implementation,
         dependencies,
         singleton: true,
      })
      return this
   }
   // Resolve a service and its dependencies
   resolve(name: string): any {
      const service = this.services.get(name)

      if (!service) {
         throw new Error(`Service ${name} not found`)
      }

      if (service.singleton && this.singletons.has(name)) {
         return this.singletons.get(name)
      }

      const dependencies = service.dependencies.map((dep) => this.resolve(dep))
      const instance = new service.Implementation(...dependencies)

      if (service.singleton) {
         this.singletons.set(name, instance)
      }

      return instance
   }
}
class EmailService {
   public async sendOrderConfirmation(user: object | string | number, productId: string | number) {
      // Implementation
      console.log('Order confirmation sent', user, productId)
   }
}

class PaymentService {
   async processPayment(amount: number, userId: string | number) {
      // Implementation
      console.log('Payment processed', amount, userId)
   }
}

class OrderService {
   private emailService: EmailService
   private paymentService: PaymentService

   constructor(emailService: EmailService, paymentService: PaymentService) {
      this.emailService = emailService
      this.paymentService = paymentService
   }

   public async createOrder(userId: string | number, productId: string | number) {
      const email = await this.emailService.sendOrderConfirmation(userId, productId)
      const payment = await this.paymentService.processPayment(100, userId)
      console.log({
         email,
         payment,
      })
      // do something with email and payment process
   }
}

enum Services {
   EMAIL,
   ORDER,
   PAYMENT,
}

const container = new DIContainer()

container.registerSingleton('emailService', EmailService)
container.registerSingleton('paymentService', PaymentService)

container.register('orderService', OrderService, ['emailService', 'paymentService'])

const orderService: OrderService = container.resolve('orderService')

orderService.createOrder(1, 2)
