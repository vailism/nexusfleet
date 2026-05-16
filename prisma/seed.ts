import { PrismaClient, Role, VehicleStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  // 2. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Acme Corp',
      email: 'billing@acmecorp.com',
      phone: '+1-555-0100',
      address: '123 Business Rd, Tech City, TC 10001',
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Globex Inc',
      email: 'accounts@globex.com',
      phone: '+1-555-0200',
      address: '456 Industry Way, Metro, ME 20002',
    },
  })

  // 3. Create Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      make: 'Ford',
      model: 'Transit',
      year: 2021,
      licensePlate: 'ABC-1234',
      vin: '1FDRX4567890ABCDE',
      status: VehicleStatus.ACTIVE,
      driverName: 'John Doe',
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      make: 'Mercedes',
      model: 'Sprinter',
      year: 2022,
      licensePlate: 'XYZ-9876',
      vin: 'WDB987654321ZYXWV',
      status: VehicleStatus.ACTIVE,
      driverName: 'Jane Smith',
    },
  })

  // 4. Create Expenses
  await prisma.expense.create({
    data: {
      amount: 150.00,
      category: 'Maintenance',
      description: 'Oil change and filter',
      vehicleId: vehicle1.id,
    },
  })

  await prisma.expense.create({
    data: {
      amount: 65.50,
      category: 'Tolls',
      description: 'Highway tolls for trip to City A',
      vehicleId: vehicle2.id,
    },
  })

  // 5. Create Fuel Logs
  await prisma.fuelLog.create({
    data: {
      vehicleId: vehicle1.id,
      liters: 45.5,
      cost: 75.00,
      odometer: 15000,
    },
  })

  // 6. Create Invoices
  await prisma.invoice.create({
    data: {
      number: 'INV-2026-001',
      amount: 1000.00,
      tax: 100.00,
      total: 1100.00,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      customerId: customer1.id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
