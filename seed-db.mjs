import { drizzle } from 'drizzle-orm/mysql2';
import { menuItems, operatingHours, reviews } from './drizzle/schema.js';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function seed() {
  try {
    // Parse DATABASE_URL
    const url = new URL(DATABASE_URL);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    });

    const db = drizzle(connection);

    console.log('🌱 Seeding database...');

    // Seed Menu Items
    const menuData = [
      // Pâtes
      {
        nameEn: 'Spaghetti Carbonara',
        nameFr: 'Spaghetti Carbonara',
        nameAr: 'سباغيتي كربونارا',
        descriptionFr: 'Pâtes crémeuses avec bacon et œuf',
        descriptionAr: 'معكرونة كريمية مع لحم مقدد وبيض',
        price: 3500,
        category: 'Pâtes',
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221fcf4f?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      {
        nameEn: 'Pasta Bolognese',
        nameFr: 'Pâtes Bolognaise',
        nameAr: 'معكرونة بولونيز',
        descriptionFr: 'Sauce tomate riche avec viande hachée',
        descriptionAr: 'صلصة طماطم غنية مع لحم مفروم',
        price: 3200,
        category: 'Pâtes',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      {
        nameEn: 'Fettuccine Alfredo',
        nameFr: 'Fettuccine Alfredo',
        nameAr: 'فيتوتشيني ألفريدو',
        descriptionFr: 'Pâtes crémeuses avec parmesan',
        descriptionAr: 'معكرونة كريمية مع جبن بارميزان',
        price: 3400,
        category: 'Pâtes',
        imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      // Desserts
      {
        nameEn: 'Cheesecake Lotus',
        nameFr: 'Cheesecake Lotus',
        nameAr: 'كيك الجبن لوتس',
        descriptionFr: 'Cheesecake crémeux avec biscuits Lotus',
        descriptionAr: 'كيك جبن كريمي مع بسكويت لوتس',
        price: 2000,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-742ce1801520?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      {
        nameEn: 'Chocolate Lava Cake',
        nameFr: 'Gâteau Chocolat Coulant',
        nameAr: 'كعكة الشوكولاتة الذائبة',
        descriptionFr: 'Gâteau au chocolat avec cœur coulant',
        descriptionAr: 'كعكة الشوكولاتة مع قلب ذائب',
        price: 1800,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      {
        nameEn: 'Tiramisu',
        nameFr: 'Tiramisu',
        nameAr: 'تيراميسو',
        descriptionFr: 'Dessert italien classique',
        descriptionAr: 'حلوى إيطالية كلاسيكية',
        price: 1600,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      // Milkshakes
      {
        nameEn: 'Vanilla Milkshake',
        nameFr: 'Milkshake Vanille',
        nameAr: 'مشروب الفانيليا',
        descriptionFr: 'Milkshake crémeux à la vanille',
        descriptionAr: 'مشروب فانيليا كريمي',
        price: 1200,
        category: 'Milkshakes',
        imageUrl: 'https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      {
        nameEn: 'Chocolate Milkshake',
        nameFr: 'Milkshake Chocolat',
        nameAr: 'مشروب الشوكولاتة',
        descriptionFr: 'Milkshake riche au chocolat',
        descriptionAr: 'مشروب شوكولاتة غني',
        price: 1300,
        category: 'Milkshakes',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
      {
        nameEn: 'Strawberry Milkshake',
        nameFr: 'Milkshake Fraise',
        nameAr: 'مشروب الفراولة',
        descriptionFr: 'Milkshake frais à la fraise',
        descriptionAr: 'مشروب فراولة منعش',
        price: 1300,
        category: 'Milkshakes',
        imageUrl: 'https://images.unsplash.com/photo-1590080876-5b0893b34b79?w=400&h=300&fit=crop',
        isAvailable: 1,
      },
    ];

    console.log('📋 Inserting menu items...');
    for (const item of menuData) {
      await db.insert(menuItems).values(item);
    }
    console.log(`✅ Inserted ${menuData.length} menu items`);

    // Seed Operating Hours
    const hoursData = [
      { dayOfWeek: 0, openTime: '17:00', closeTime: '02:00', isClosed: 0 }, // Sunday
      { dayOfWeek: 1, openTime: '17:00', closeTime: '02:00', isClosed: 0 }, // Monday
      { dayOfWeek: 2, openTime: '17:00', closeTime: '02:00', isClosed: 0 }, // Tuesday
      { dayOfWeek: 3, openTime: '17:00', closeTime: '02:00', isClosed: 0 }, // Wednesday
      { dayOfWeek: 4, openTime: '17:00', closeTime: '03:00', isClosed: 0 }, // Thursday
      { dayOfWeek: 5, openTime: '17:00', closeTime: '03:00', isClosed: 0 }, // Friday
      { dayOfWeek: 6, openTime: '17:00', closeTime: '03:00', isClosed: 0 }, // Saturday
    ];

    console.log('⏰ Inserting operating hours...');
    for (const hours of hoursData) {
      await db.insert(operatingHours).values(hours);
    }
    console.log(`✅ Inserted ${hoursData.length} operating hours`);

    // Seed Reviews
    const reviewsData = [
      {
        authorName: 'Ahmed Hassan',
        rating: 5,
        comment: 'Excellent restaurant! La nourriture était délicieuse et le service impeccable. Je recommande vivement!',
        isApproved: 1,
      },
      {
        authorName: 'Fatima Mohamed',
        rating: 5,
        comment: 'Ambiance magnifique avec la piscine. Les pâtes étaient parfaites. À revenir!',
        isApproved: 1,
      },
      {
        authorName: 'Ibrahim Sow',
        rating: 4,
        comment: 'Très bon restaurant. Les desserts sont excellents. Un peu cher mais ça vaut le coup.',
        isApproved: 1,
      },
      {
        authorName: 'Aïcha Diallo',
        rating: 5,
        comment: 'Meilleur endroit pour une soirée à Nouakchott! Ambiance premium, nourriture excellente.',
        isApproved: 1,
      },
      {
        authorName: 'Moussa Mint',
        rating: 4,
        comment: 'Bon service et bonne nourriture. La piscine est un plus. Visite recommandée!',
        isApproved: 1,
      },
    ];

    console.log('⭐ Inserting reviews...');
    for (const review of reviewsData) {
      await db.insert(reviews).values(review);
    }
    console.log(`✅ Inserted ${reviewsData.length} reviews`);

    console.log('\n🎉 Database seeded successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
