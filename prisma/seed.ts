import { PrismaClient, PlanTier, VehicleStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { id: 'seed-org-id' },
    update: {},
    create: {
      id: 'seed-org-id',
      name: 'NexusFleet Demo Corp',
      planId: PlanTier.BUSINESS,
    },
  })

  // 2. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      memberships: {
        upsert: {
          where: { userId_organizationId: { userId: 'admin-user-id', organizationId: org.id } },
          update: { role: 'OWNER' },
          create: { organizationId: org.id, role: 'OWNER' }
        }
      }
    },
    create: {
      id: 'admin-user-id',
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      memberships: {
        create: {
          organizationId: org.id,
          role: 'OWNER',
        }
      }
    },
  })

  // 3. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Acme Corp',
      email: 'billing@acmecorp.com',
      phone: '+1-555-0100',
      address: '123 Business Rd, Tech City, TC 10001',
      organizationId: org.id,
    },
  })

  // 4. Create Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      make: 'Ford',
      model: 'Transit',
      year: 2021,
      licensePlate: 'ABC-1234',
      vin: '1FDRX4567890ABCDE',
      status: VehicleStatus.ACTIVE,
      driverName: 'John Doe',
      organizationId: org.id,
    },
  })

  // 5. Create Expenses
  await prisma.expense.create({
    data: {
      amount: 150.00,
      category: 'Maintenance',
      description: 'Oil change and filter',
      vehicleId: vehicle1.id,
      organizationId: org.id,
    },
  })

  // 6. Create Fuel Logs
  await prisma.fuelLog.create({
    data: {
      vehicleId: vehicle1.id,
      liters: 45.5,
      cost: 75.00,
      odometer: 15000,
    },
  })

  // 7. Create Invoices
  await prisma.invoice.create({
    data: {
      number: 'INV-2026-001',
      amount: 1000.00,
      tax: 100.00,
      total: 1100.00,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      customerId: customer1.id,
      organizationId: org.id,
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
