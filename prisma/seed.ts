import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const destinations = [
  { title: 'Weekend in Paris', destination: 'Paris', country: 'France', countryCode: 'FR', city: 'Paris', lat: 48.8566, lng: 2.3522, season: 'spring' },
  { title: 'Barcelona Beach Days', destination: 'Barcelona', country: 'Spain', countryCode: 'ES', city: 'Barcelona', lat: 41.3874, lng: 2.1686, season: 'summer' },
  { title: 'Rome History Tour', destination: 'Rome', country: 'Italy', countryCode: 'IT', city: 'Rome', lat: 41.9028, lng: 12.4964, season: 'autumn' },
  { title: 'Amsterdam Canals', destination: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam', lat: 52.3676, lng: 4.9041, season: 'spring' },
  { title: 'Prague Old Town', destination: 'Prague', country: 'Czech Republic', countryCode: 'CZ', city: 'Prague', lat: 50.0755, lng: 14.4378, season: 'winter' },
  { title: 'Lisbon Tram Ride', destination: 'Lisbon', country: 'Portugal', countryCode: 'PT', city: 'Lisbon', lat: 38.7223, lng: -9.1393, season: 'spring' },
  { title: 'Vienna Coffee Houses', destination: 'Vienna', country: 'Austria', countryCode: 'AT', city: 'Vienna', lat: 48.2082, lng: 16.3738, season: 'autumn' },
  { title: 'Berlin Wall Walk', destination: 'Berlin', country: 'Germany', countryCode: 'DE', city: 'Berlin', lat: 52.52, lng: 13.405, season: 'summer' },
  { title: 'Dubrovnik Walls', destination: 'Dubrovnik', country: 'Croatia', countryCode: 'HR', city: 'Dubrovnik', lat: 42.6507, lng: 18.0944, season: 'summer' },
  { title: 'Split Summer', destination: 'Split', country: 'Croatia', countryCode: 'HR', city: 'Split', lat: 43.5081, lng: 16.4402, season: 'summer' },
  { title: 'London Museums', destination: 'London', country: 'United Kingdom', countryCode: 'GB', city: 'London', lat: 51.5074, lng: -0.1278, season: 'autumn' },
  { title: 'Santorini Sunset', destination: 'Santorini', country: 'Greece', countryCode: 'GR', city: 'Santorini', lat: 36.3932, lng: 25.4615, season: 'summer' },
  { title: 'Istanbul Bazaar', destination: 'Istanbul', country: 'Turkey', countryCode: 'TR', city: 'Istanbul', lat: 41.0082, lng: 28.9784, season: 'spring' },
  { title: 'Swiss Alps Hiking', destination: 'Interlaken', country: 'Switzerland', countryCode: 'CH', city: 'Interlaken', lat: 46.6863, lng: 7.8632, season: 'summer' },
  { title: 'Budapest Baths', destination: 'Budapest', country: 'Hungary', countryCode: 'HU', city: 'Budapest', lat: 47.4979, lng: 19.0402, season: 'winter' },
  { title: 'Copenhagen Bikes', destination: 'Copenhagen', country: 'Denmark', countryCode: 'DK', city: 'Copenhagen', lat: 55.6761, lng: 12.5683, season: 'summer' },
  { title: 'Tokyo Temples', destination: 'Tokyo', country: 'Japan', countryCode: 'JP', city: 'Tokyo', lat: 35.6762, lng: 139.6503, season: 'spring' },
  { title: 'Bali Rice Terraces', destination: 'Bali', country: 'Indonesia', countryCode: 'ID', city: 'Ubud', lat: -8.5069, lng: 115.2625, season: 'autumn' },
  { title: 'New York City Lights', destination: 'New York', country: 'United States', countryCode: 'US', city: 'New York', lat: 40.7128, lng: -74.006, season: 'winter' },
  { title: 'Marrakech Medina', destination: 'Marrakech', country: 'Morocco', countryCode: 'MA', city: 'Marrakech', lat: 31.6295, lng: -7.9811, season: 'spring' },
  { title: 'Kyoto in Autumn', destination: 'Kyoto', country: 'Japan', countryCode: 'JP', city: 'Kyoto', lat: 35.0116, lng: 135.7681, season: 'autumn' },
  { title: 'Iceland Ring Road', destination: 'Reykjavik', country: 'Iceland', countryCode: 'IS', city: 'Reykjavik', lat: 64.1265, lng: -21.8174, season: 'winter' },
  { title: 'Amalfi Coast Drive', destination: 'Amalfi', country: 'Italy', countryCode: 'IT', city: 'Amalfi', lat: 40.6340, lng: 14.6027, season: 'summer' },
  { title: 'Scottish Highlands', destination: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', city: 'Edinburgh', lat: 55.9533, lng: -3.1883, season: 'autumn' },
  { title: 'Hvar Island Escape', destination: 'Hvar', country: 'Croatia', countryCode: 'HR', city: 'Hvar', lat: 43.1729, lng: 16.4411, season: 'summer' },
];

const categories = ['solo', 'couple', 'family', 'backpacker', 'luxury', 'digital_nomad', 'adventure', 'cultural', 'group', 'business'] as const;
const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64'] as const;

const users = [
  { first: 'Ana', last: 'Horvat', cat: 'solo', age: '25-34' },
  { first: 'Marko', last: 'Kovac', cat: 'backpacker', age: '25-34' },
  { first: 'Ivana', last: 'Babic', cat: 'luxury', age: '35-44' },
  { first: 'Luka', last: 'Maric', cat: 'digital_nomad', age: '25-34' },
  { first: 'Petra', last: 'Juric', cat: 'couple', age: '35-44' },
  { first: 'Tomislav', last: 'Novak', cat: 'adventure', age: '45-54' },
  { first: 'Nina', last: 'Knezevic', cat: 'cultural', age: '25-34' },
  { first: 'Ivan', last: 'Vukovic', cat: 'solo', age: '18-24' },
  { first: 'Maja', last: 'Matic', cat: 'family', age: '35-44' },
  { first: 'Josip', last: 'Tomic', cat: 'backpacker', age: '18-24' },
  { first: 'Sara', last: 'Bozic', cat: 'luxury', age: '45-54' },
  { first: 'Ante', last: 'Pavlovic', cat: 'adventure', age: '25-34' },
  { first: 'Lana', last: 'Radic', cat: 'digital_nomad', age: '25-34' },
  { first: 'Filip', last: 'Petrovic', cat: 'couple', age: '35-44' },
  { first: 'Eva', last: 'Simic', cat: 'solo', age: '18-24' },
  { first: 'Matej', last: 'Lukic', cat: 'cultural', age: '45-54' },
  { first: 'Tina', last: 'Grgic', cat: 'group', age: '25-34' },
  { first: 'Domagoj', last: 'Galic', cat: 'business', age: '35-44' },
  { first: 'Ema', last: 'Popovic', cat: 'backpacker', age: '18-24' },
  { first: 'Karlo', last: 'Vidovic', cat: 'adventure', age: '25-34' },
];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('Cleaning old seed data...');
  await prisma.user.deleteMany({
    where: { clerkId: { startsWith: 'seed_' } },
  });

  console.log('Seeding 20 users with 5 trips each...\n');

  for (let i = 0; i < 20; i++) {
    const u = users[i];
    const username = `${u.first.toLowerCase()}${u.last.toLowerCase()}`;

    const user = await prisma.user.create({
      data: {
        clerkId: `seed_${i.toString().padStart(3, '0')}`,
        email: `${username}@demo.travelchecker.app`,
        username,
        displayName: `${u.first} ${u.last}`,
        bio: `${u.cat.replace('_', ' ')} traveler from Croatia. Love exploring new places!`,
        travelerCategory: u.cat,
        ageRange: u.age,
        isPublic: true,
        tripsCount: 5,
        countriesCount: 0,
      },
    });

    console.log(`  [${i + 1}/20] ${user.displayName} (@${username})`);

    const countries = new Set<string>();
    for (let j = 0; j < 5; j++) {
      const dest = destinations[(i * 5 + j) % destinations.length];
      const startDate = randomDate(new Date('2024-01-01'), new Date('2026-03-01'));
      const endDate = new Date(startDate.getTime() + (3 + Math.floor(Math.random() * 10)) * 86400000);
      countries.add(dest.countryCode);

      await prisma.trip.create({
        data: {
          userId: user.id,
          title: dest.title,
          description: `Amazing trip to ${dest.destination}. Stayed in ${dest.city}. Highly recommend!`,
          destination: dest.destination,
          country: dest.country,
          countryCode: dest.countryCode,
          city: dest.city,
          latitude: dest.lat,
          longitude: dest.lng,
          startDate,
          endDate,
          season: dest.season,
          travelerCategory: u.cat,
          ageRange: u.age,
          isPublic: true,
          visibility: 'public',
          active: true,
          budget: {
            create: {
              currency: 'EUR',
              accommodation: Math.floor(Math.random() * 500 + 100),
              food: Math.floor(Math.random() * 300 + 50),
              transport: Math.floor(Math.random() * 200 + 30),
              activities: Math.floor(Math.random() * 200 + 20),
              other: Math.floor(Math.random() * 100),
            },
          },
        },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { countriesCount: countries.size },
    });
  }

  console.log('\nDone! 20 users, 100 trips created.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
