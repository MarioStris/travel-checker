import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USERS = [
  {
    clerkId: 'user_seed_001',
    email: 'ana.kovac@example.com',
    username: 'ana_travels',
    displayName: 'Ana Kovač',
    bio: 'Solo traveler from Croatia. 30+ countries and counting.',
    travelerCategory: 'solo',
    ageRange: '25-34',
    isPublic: true,
  },
  {
    clerkId: 'user_seed_002',
    email: 'marko.babic@example.com',
    username: 'marko_adventures',
    displayName: 'Marko Babić',
    bio: 'Backpacker and digital nomad. Working from coffee shops worldwide.',
    travelerCategory: 'backpacker',
    ageRange: '25-34',
    isPublic: true,
  },
  {
    clerkId: 'user_seed_003',
    email: 'petra.novak@example.com',
    username: 'petra_luxury',
    displayName: 'Petra Novak',
    bio: 'Luxury travel enthusiast. Life is too short for bad hotels.',
    travelerCategory: 'luxury',
    ageRange: '35-44',
    isPublic: false,
  },
] as const;

const TRIPS_DATA = [
  {
    userIndex: 0,
    title: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-03-24'),
    season: 'spring',
    travelerCategory: 'solo',
    ageRange: '25-34',
    isPublic: true,
    description: 'Spring cherry blossoms and incredible ramen.',
    budget: { currency: 'EUR', accommodation: 840, food: 420, transport: 320, activities: 280, other: 140, isApproximate: false },
  },
  {
    userIndex: 0,
    title: 'Bali Retreat',
    destination: 'Bali, Indonesia',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Ubud',
    latitude: -8.5069,
    longitude: 115.2625,
    startDate: new Date('2024-07-05'),
    endDate: new Date('2024-07-19'),
    season: 'summer',
    travelerCategory: 'solo',
    ageRange: '25-34',
    isPublic: true,
    description: 'Yoga, rice terraces, and temple hopping.',
    budget: { currency: 'EUR', accommodation: 560, food: 280, transport: 180, activities: 220, other: 80, isApproximate: false },
    accommodation: { name: 'Komaneka at Bisma', type: 'hotel', rating: 5, notes: 'Amazing infinity pool overlooking the jungle' },
  },
  {
    userIndex: 0,
    title: 'Lisbon Weekend',
    destination: 'Lisbon, Portugal',
    country: 'Portugal',
    countryCode: 'PT',
    city: 'Lisbon',
    latitude: 38.7223,
    longitude: -9.1393,
    startDate: new Date('2024-09-20'),
    endDate: new Date('2024-09-23'),
    season: 'autumn',
    travelerCategory: 'solo',
    isPublic: true,
    description: 'Fado music, pastel de nata, and sunset from Alfama.',
    budget: { currency: 'EUR', accommodation: 240, food: 120, transport: 80, activities: 60, other: 30, isApproximate: false },
  },
  {
    userIndex: 0,
    title: 'Kyoto in Autumn',
    destination: 'Kyoto, Japan',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Kyoto',
    latitude: 35.0116,
    longitude: 135.7681,
    startDate: new Date('2024-11-08'),
    endDate: new Date('2024-11-15'),
    season: 'autumn',
    travelerCategory: 'solo',
    isPublic: true,
    description: 'Maple leaves, zen gardens, and endless temples.',
    budget: { currency: 'EUR', accommodation: 560, food: 280, transport: 160, activities: 180, other: 60, isApproximate: true },
  },
  {
    userIndex: 1,
    title: 'Colombia Road Trip',
    destination: 'Medellín, Colombia',
    country: 'Colombia',
    countryCode: 'CO',
    city: 'Medellín',
    latitude: 6.2518,
    longitude: -75.5636,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-10'),
    season: 'winter',
    travelerCategory: 'backpacker',
    ageRange: '25-34',
    isPublic: true,
    description: 'From Medellín to Cartagena — the eternal spring city to the Caribbean coast.',
    budget: { currency: 'USD', accommodation: 480, food: 360, transport: 240, activities: 180, other: 120, isApproximate: false },
    accommodation: { name: 'Selina Medellín', type: 'hostel', rating: 4, notes: 'Great co-working space' },
  },
  {
    userIndex: 1,
    title: 'Vietnam by Motorbike',
    destination: 'Ho Chi Minh City, Vietnam',
    country: 'Vietnam',
    countryCode: 'VN',
    city: 'Ho Chi Minh City',
    latitude: 10.8231,
    longitude: 106.6297,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    season: 'spring',
    travelerCategory: 'backpacker',
    isPublic: true,
    description: '2000 km from south to north on a Honda Win.',
    budget: { currency: 'USD', accommodation: 300, food: 240, transport: 400, activities: 160, other: 80, isApproximate: false },
  },
  {
    userIndex: 1,
    title: 'Morocco Desert',
    destination: 'Marrakech, Morocco',
    country: 'Morocco',
    countryCode: 'MA',
    city: 'Marrakech',
    latitude: 31.6295,
    longitude: -7.9811,
    startDate: new Date('2024-10-05'),
    endDate: new Date('2024-10-18'),
    season: 'autumn',
    travelerCategory: 'backpacker',
    isPublic: true,
    description: 'Sahara nights, Berber hospitality, and medina maze.',
    budget: { currency: 'EUR', accommodation: 360, food: 200, transport: 280, activities: 240, other: 100, isApproximate: false },
  },
  {
    userIndex: 2,
    title: 'Maldives Overwater',
    destination: 'Male, Maldives',
    country: 'Maldives',
    countryCode: 'MV',
    city: 'Male',
    latitude: 4.1755,
    longitude: 73.5093,
    startDate: new Date('2024-02-14'),
    endDate: new Date('2024-02-21'),
    season: 'winter',
    travelerCategory: 'luxury',
    ageRange: '35-44',
    isPublic: false,
    description: 'Overwater bungalow, private pool, pure bliss.',
    budget: { currency: 'EUR', accommodation: 5600, food: 1200, transport: 800, activities: 600, other: 400, isApproximate: false },
    accommodation: { name: 'Soneva Jani', type: 'hotel', rating: 5, notes: 'Water villa with retractable roof for stargazing' },
  },
  {
    userIndex: 2,
    title: 'Dubai Luxury Break',
    destination: 'Dubai, UAE',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-27'),
    season: 'winter',
    travelerCategory: 'luxury',
    isPublic: false,
    description: 'Shopping, skyline, and desert safari.',
    budget: { currency: 'EUR', accommodation: 3200, food: 800, transport: 400, activities: 600, other: 300, isApproximate: false },
    accommodation: { name: 'Burj Al Arab', type: 'hotel', rating: 5, notes: 'Helicopter transfer included' },
  },
  {
    userIndex: 0,
    title: 'Iceland Ring Road',
    destination: 'Reykjavik, Iceland',
    country: 'Iceland',
    countryCode: 'IS',
    city: 'Reykjavik',
    latitude: 64.1265,
    longitude: -21.8174,
    startDate: new Date('2025-01-10'),
    endDate: new Date('2025-01-24'),
    season: 'winter',
    travelerCategory: 'solo',
    isPublic: true,
    description: 'Northern lights, waterfalls, and the silence of snow.',
    budget: { currency: 'EUR', accommodation: 1400, food: 700, transport: 900, activities: 500, other: 200, isApproximate: true },
  },
];

async function main() {
  console.log('Seeding database...');

  // Clean existing seed data
  await prisma.user.deleteMany({
    where: { clerkId: { in: USERS.map((u) => u.clerkId) } },
  });

  // Create users
  const createdUsers = await Promise.all(
    USERS.map((u) => prisma.user.create({ data: u })),
  );
  console.log(`Created ${createdUsers.length} users`);

  // Create trips with budgets and accommodations
  let tripCount = 0;
  for (const tripData of TRIPS_DATA) {
    const { userIndex, budget, accommodation, ...tripFields } = tripData;
    const user = createdUsers[userIndex];

    const trip = await prisma.trip.create({
      data: { ...tripFields, userId: user.id },
    });

    if (budget) {
      await prisma.budget.create({ data: { tripId: trip.id, ...budget } });
    }

    if (accommodation) {
      await prisma.accommodation.create({
        data: { tripId: trip.id, ...accommodation },
      });
    }

    tripCount++;
  }

  console.log(`Created ${tripCount} trips`);

  // Update user stats
  for (const user of createdUsers) {
    const [tripsCount, uniqueCountries] = await Promise.all([
      prisma.trip.count({ where: { userId: user.id } }),
      prisma.trip.findMany({
        where: { userId: user.id },
        select: { countryCode: true },
        distinct: ['countryCode'],
      }),
    ]);

    await prisma.user.update({
      where: { id: user.id },
      data: { tripsCount, countriesCount: uniqueCountries.length },
    });
  }

  // Create sample follows (ana follows marko, marko follows ana)
  await prisma.follow.createMany({
    data: [
      { followerId: createdUsers[0].id, followingId: createdUsers[1].id },
      { followerId: createdUsers[1].id, followingId: createdUsers[0].id },
    ],
    skipDuplicates: true,
  });

  console.log('Follow relationships created');
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
