'use server';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Comprehensive product data with Picsum Photos images
const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Latest gadgets, computers, and electronic devices',
    image_url: 'https://picsum.photos/600/400?random=1'
  },
  {
    name: 'Fashion & Clothing',
    description: 'Stylish clothing, accessories, and fashion items',
    image_url: 'https://picsum.photos/600/400?random=2'
  },
  {
    name: 'Home & Garden',
    description: 'Furniture, decor, and gardening supplies',
    image_url: 'https://picsum.photos/600/400?random=3'
  },
  {
    name: 'Sports & Fitness',
    description: 'Athletic gear, fitness equipment, and sporting goods',
    image_url: 'https://picsum.photos/600/400?random=4'
  },
  {
    name: 'Health & Beauty',
    description: 'Skincare, cosmetics, and wellness products',
    image_url: 'https://picsum.photos/600/400?random=5'
  },
  {
    name: 'Food & Beverages',
    description: 'Gourmet foods, beverages, and culinary delights',
    image_url: 'https://picsum.photos/600/400?random=6'
  },
  {
    name: 'Books & Media',
    description: 'Books, movies, music, and educational content',
    image_url: 'https://picsum.photos/600/400?random=7'
  },
  {
    name: 'Toys & Games',
    description: 'Fun toys, board games, and entertainment',
    image_url: 'https://picsum.photos/600/400?random=8'
  }
];

const sampleProducts = [
  // Electronics
  {
    name: 'Premium Wireless Noise-Canceling Headphones',
    description: 'Experience crystal-clear audio with advanced noise cancellation technology. Features 40-hour battery life, quick charge, and premium materials for all-day comfort.',
    category: 'Electronics',
    base_price: 29999, // $299.99
    minimum_quantity: 8,
    max_participants: 50,
    image_urls: [
      'https://picsum.photos/300/200?random=10',
      'https://picsum.photos/300/200?random=11',
      'https://picsum.photos/300/200?random=12'
    ],
    specifications: {
      'Battery Life': '40 hours',
      'Connectivity': 'Bluetooth 5.2, USB-C',
      'Noise Cancellation': 'Active ANC',
      'Weight': '280g',
      'Warranty': '2 years'
    }
  },
  {
    name: 'Smart Fitness Watch Pro',
    description: 'Advanced fitness tracking with GPS, heart rate monitoring, sleep analysis, and 100+ workout modes. Water-resistant design perfect for all activities.',
    category: 'Electronics',
    base_price: 24999, // $249.99
    minimum_quantity: 12,
    max_participants: 75,
    image_urls: [
      'https://picsum.photos/300/200?random=13',
      'https://picsum.photos/300/200?random=14',
      'https://picsum.photos/300/200?random=15'
    ],
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery': '14 days',
      'Water Resistance': '10ATM',
      'Sensors': 'Heart Rate, GPS, SpO2',
      'Compatibility': 'iOS & Android'
    }
  },
  {
    name: '4K Ultra HD Action Camera',
    description: 'Capture your adventures in stunning 4K resolution with image stabilization, waterproof housing, and wireless connectivity.',
    category: 'Electronics',
    base_price: 19999, // $199.99
    minimum_quantity: 10,
    max_participants: 60,
    image_urls: [
      'https://picsum.photos/300/200?random=16',
      'https://picsum.photos/300/200?random=17',
      'https://picsum.photos/300/200?random=18'
    ],
    specifications: {
      'Video Quality': '4K@60fps',
      'Photo Resolution': '20MP',
      'Stabilization': 'Electronic + Optical',
      'Waterproof': '10m without housing',
      'Storage': 'MicroSD up to 256GB'
    }
  },

  // Fashion & Clothing
  {
    name: 'Premium Organic Cotton T-Shirt Collection',
    description: 'Sustainable fashion meets comfort. Pack of 5 premium organic cotton t-shirts in various colors. Ethically sourced and produced.',
    category: 'Fashion & Clothing',
    base_price: 12999, // $129.99
    minimum_quantity: 20,
    max_participants: 100,
    image_urls: [
      'https://picsum.photos/300/200?random=19',
      'https://picsum.photos/300/200?random=20',
      'https://picsum.photos/300/200?random=21'
    ],
    specifications: {
      'Material': '100% Organic Cotton',
      'Sizes': 'XS to XXL',
      'Colors': '5 Different Colors',
      'Certification': 'GOTS Certified',
      'Care': 'Machine Washable'
    }
  },
  {
    name: 'Designer Leather Weekend Bag',
    description: 'Handcrafted genuine leather weekend bag with multiple compartments, laptop sleeve, and adjustable shoulder strap. Perfect for travel and business.',
    category: 'Fashion & Clothing',
    base_price: 34999, // $349.99
    minimum_quantity: 6,
    max_participants: 30,
    image_urls: [
      'https://picsum.photos/300/200?random=22',
      'https://picsum.photos/300/200?random=23',
      'https://picsum.photos/300/200?random=24'
    ],
    specifications: {
      'Material': 'Full Grain Leather',
      'Dimensions': '50x30x25cm',
      'Compartments': '4 Main + 6 Pockets',
      'Laptop Fit': 'Up to 15 inch',
      'Hardware': 'Brass Fittings'
    }
  },

  // Home & Garden
  {
    name: 'Ergonomic Executive Office Chair',
    description: 'Premium ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh. Designed for 8+ hour work sessions.',
    category: 'Home & Garden',
    base_price: 45999, // $459.99
    minimum_quantity: 4,
    max_participants: 20,
    image_urls: [
      'https://picsum.photos/300/200?random=25',
      'https://picsum.photos/300/200?random=26',
      'https://picsum.photos/300/200?random=27'
    ],
    specifications: {
      'Material': 'Mesh Back, Fabric Seat',
      'Weight Capacity': '150kg',
      'Adjustments': 'Height, Tilt, Armrests',
      'Warranty': '5 years',
      'Dimensions': '70x70x120cm'
    }
  },
  {
    name: 'Smart Indoor Garden System',
    description: 'Automated hydroponic garden system with LED grow lights, app control, and everything needed to grow fresh herbs and vegetables indoors.',
    category: 'Home & Garden',
    base_price: 27999, // $279.99
    minimum_quantity: 8,
    max_participants: 40,
    image_urls: [
      'https://picsum.photos/300/200?random=28',
      'https://picsum.photos/300/200?random=29',
      'https://picsum.photos/300/200?random=30'
    ],
    specifications: {
      'Growing Pods': '12 Pods',
      'Light': 'Full Spectrum LED',
      'App Control': 'iOS & Android',
      'Water Tank': '4 Liters',
      'Includes': 'Seeds & Nutrients'
    }
  },

  // Sports & Fitness
  {
    name: 'Professional Yoga Mat & Accessories Set',
    description: 'Complete yoga practice set including premium non-slip mat, yoga blocks, strap, and carrying bag. Perfect for beginners and experts.',
    category: 'Sports & Fitness',
    base_price: 8999, // $89.99
    minimum_quantity: 15,
    max_participants: 80,
    image_urls: [
      'https://picsum.photos/300/200?random=31',
      'https://picsum.photos/300/200?random=32',
      'https://picsum.photos/300/200?random=33'
    ],
    specifications: {
      'Mat Size': '183x61cm',
      'Thickness': '6mm TPE',
      'Includes': 'Mat, 2 Blocks, Strap, Bag',
      'Material': 'Eco-friendly TPE',
      'Non-slip': 'Both Sides'
    }
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells that replace 15 sets of weights. Quick-change system with secure locking mechanism.',
    category: 'Sports & Fitness',
    base_price: 39999, // $399.99
    minimum_quantity: 6,
    max_participants: 25,
    image_urls: [
      'https://picsum.photos/300/200?random=34',
      'https://picsum.photos/300/200?random=35',
      'https://picsum.photos/300/200?random=36'
    ],
    specifications: {
      'Weight Range': '2.5kg to 24kg per dumbbell',
      'Adjustment': '2.5kg increments',
      'Material': 'Cast Iron & Rubber',
      'Includes': '2 Dumbbells + Stand',
      'Space Saving': 'Replaces 15 sets'
    }
  },

  // Health & Beauty
  {
    name: 'Complete Anti-Aging Skincare System',
    description: '6-step professional skincare routine with vitamin C serum, retinol treatment, and hyaluronic acid moisturizer. Dermatologist recommended.',
    category: 'Health & Beauty',
    base_price: 16999, // $169.99
    minimum_quantity: 12,
    max_participants: 70,
    image_urls: [
      'https://picsum.photos/300/200?random=37',
      'https://picsum.photos/300/200?random=38',
      'https://picsum.photos/300/200?random=39'
    ],
    specifications: {
      'Steps': '6 Product System',
      'Key Ingredients': 'Vitamin C, Retinol, Hyaluronic Acid',
      'Skin Type': 'All Skin Types',
      'Certification': 'Dermatologist Tested',
      'Duration': '3 Month Supply'
    }
  },

  // Food & Beverages
  {
    name: 'Artisan Coffee Subscription Box',
    description: 'Monthly selection of premium single-origin coffee beans from around the world. Includes tasting notes and brewing guides.',
    category: 'Food & Beverages',
    base_price: 4999, // $49.99
    minimum_quantity: 25,
    max_participants: 150,
    image_urls: [
      'https://picsum.photos/300/200?random=40',
      'https://picsum.photos/300/200?random=41',
      'https://picsum.photos/300/200?random=42'
    ],
    specifications: {
      'Duration': '3 Month Subscription',
      'Quantity': '340g per month',
      'Origins': '3 Different Countries',
      'Roast': 'Light to Dark',
      'Includes': 'Tasting Notes & Guides'
    }
  },
  {
    name: 'Gourmet Olive Oil & Vinegar Set',
    description: 'Premium collection of extra virgin olive oils and aged balsamic vinegars from Mediterranean regions. Perfect for cooking enthusiasts.',
    category: 'Food & Beverages',
    base_price: 12999, // $129.99
    minimum_quantity: 18,
    max_participants: 90,
    image_urls: [
      'https://picsum.photos/300/200?random=43',
      'https://picsum.photos/300/200?random=44',
      'https://picsum.photos/300/200?random=45'
    ],
    specifications: {
      'Olive Oils': '4 Different Varieties',
      'Vinegars': '3 Aged Balsamics',
      'Origin': 'Italy, Spain, Greece',
      'Bottles': '250ml each',
      'Packaging': 'Gift Box Included'
    }
  }
];

// Sample deals to create
const sampleDeals = [
  {
    title: 'Early Bird Special - Premium Headphones',
    description: 'Get premium wireless headphones at an unbeatable price! Limited time offer for early adopters.',
    productName: 'Premium Wireless Noise-Canceling Headphones',
    targetParticipants: 25,
    discountPercentage: 35,
    durationHours: 72
  },
  {
    title: 'Fitness Bundle Deal - Smart Watch',
    description: 'Perfect for your New Year fitness goals! Premium smartwatch with comprehensive health tracking.',
    productName: 'Smart Fitness Watch Pro',
    targetParticipants: 40,
    discountPercentage: 28,
    durationHours: 168
  },
  {
    title: 'Home Office Upgrade - Ergonomic Chair',
    description: 'Transform your workspace with this premium ergonomic chair. Perfect for remote workers.',
    productName: 'Ergonomic Executive Office Chair',
    targetParticipants: 15,
    discountPercentage: 40,
    durationHours: 120
  },
  {
    title: 'Adventure Ready - 4K Action Camera',
    description: 'Capture every moment in stunning 4K! Perfect for travelers and adventure enthusiasts.',
    productName: '4K Ultra HD Action Camera',
    targetParticipants: 30,
    discountPercentage: 32,
    durationHours: 96
  },
  {
    title: 'Sustainable Fashion - Organic Cotton Collection',
    description: 'Eco-friendly fashion that doesn\'t compromise on quality. Join the sustainable movement!',
    productName: 'Premium Organic Cotton T-Shirt Collection',
    targetParticipants: 50,
    discountPercentage: 25,
    durationHours: 144
  },
  {
    title: 'Wellness Wednesday - Complete Skincare System',
    description: 'Professional-grade skincare routine for radiant, youthful skin. Dermatologist recommended!',
    productName: 'Complete Anti-Aging Skincare System',
    targetParticipants: 35,
    discountPercentage: 30,
    durationHours: 48
  },
  {
    title: 'Coffee Lovers Unite - Artisan Subscription',
    description: 'Discover the world\'s finest coffee beans. A journey of flavors delivered to your door.',
    productName: 'Artisan Coffee Subscription Box',
    targetParticipants: 75,
    discountPercentage: 20,
    durationHours: 192
  },
  {
    title: 'Home Gym Essentials - Adjustable Dumbbells',
    description: 'Build the perfect home gym with space-saving adjustable dumbbells. No more crowded gyms!',
    productName: 'Adjustable Dumbbell Set',
    targetParticipants: 20,
    discountPercentage: 35,
    durationHours: 168
  }
];

export async function GET() {
  try {
    console.log('🧹 Clearing existing data...');
    
    // Clear existing data in correct order (respecting foreign key constraints)
    await sql`DELETE FROM deal_participants;`;
    await sql`DELETE FROM group_deals;`;
    await sql`DELETE FROM products;`;
    await sql`DELETE FROM categories;`;
    
    console.log('✅ Existing data cleared');
    
    // Get admin user
    const users = await sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
    let userId;
    if (users.length === 0) {
      // Create admin user if doesn't exist
      const adminUser = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('Admin User', 'admin@example.com', 'hashed_password', 'admin')
        RETURNING id;
      `;
      userId = adminUser[0].id;
    } else {
      userId = users[0].id;
    }
    
    console.log('👤 Using admin user:', userId);
    
    // Create categories
    console.log('📁 Creating categories...');
    const categoryMap = new Map();
    let categoriesCreated = 0;
    
    for (const category of sampleCategories) {
      const result = await sql`
        INSERT INTO categories (name, description, image_url, is_active)
        VALUES (${category.name}, ${category.description}, ${category.image_url}, true)
        RETURNING id;
      `;
      categoryMap.set(category.name, result[0].id);
      categoriesCreated++;
    }
    
    console.log(`✅ Created ${categoriesCreated} categories`);
    
    // Create products
    console.log('📦 Creating products...');
    const productMap = new Map();
    let productsCreated = 0;
    
    for (const product of sampleProducts) {
      const categoryId = categoryMap.get(product.category);
      if (!categoryId) {
        console.warn(`Category ${product.category} not found for product ${product.name}`);
        continue;
      }
      
      const result = await sql`
        INSERT INTO products (
          name, 
          description, 
          category_id, 
          base_price, 
          minimum_quantity, 
          max_participants,
          image_urls,
          specifications,
          is_active,
          created_by
        )
        VALUES (
          ${product.name}, 
          ${product.description}, 
          ${categoryId}, 
          ${product.base_price}, 
          ${product.minimum_quantity}, 
          ${product.max_participants},
          ${product.image_urls},
          ${JSON.stringify(product.specifications)},
          true,
          ${userId}
        )
        RETURNING id;
      `;
      
      productMap.set(product.name, result[0].id);
      productsCreated++;
    }
    
    console.log(`✅ Created ${productsCreated} products`);
    
    // Create deals
    console.log('🎯 Creating group deals...');
    let dealsCreated = 0;
    
    for (const deal of sampleDeals) {
      const productId = productMap.get(deal.productName);
      if (!productId) {
        console.warn(`Product ${deal.productName} not found for deal ${deal.title}`);
        continue;
      }
      
      // Get product price for calculations
      const product = await sql`SELECT base_price FROM products WHERE id = ${productId}`;
      const originalPrice = product[0].base_price;
      const dealPrice = originalPrice * (1 - deal.discountPercentage / 100);
      
      // Calculate end date
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + deal.durationHours);
      
      await sql`
        INSERT INTO group_deals (
          product_id,
          title,
          description,
          target_participants,
          target_quantity,
          current_participants,
          current_quantity,
          deal_price,
          original_price,
          discount_percentage,
          start_date,
          end_date,
          status,
          created_by
        ) VALUES (
          ${productId},
          ${deal.title},
          ${deal.description},
          ${deal.targetParticipants},
          ${deal.targetParticipants},
          0,
          0,
          ${dealPrice},
          ${originalPrice},
          ${deal.discountPercentage},
          NOW(),
          ${endDate.toISOString()},
          'pending',
          ${userId}
        );
      `;
      
      dealsCreated++;
    }
    
    console.log(`✅ Created ${dealsCreated} group deals`);
    
    console.log('🎉 Database seeding completed successfully!');
    
    return Response.json({
      success: true,
      message: 'Database seeded successfully with Picsum Photos images!',
      summary: {
        categories_created: categoriesCreated,
        products_created: productsCreated,
        deals_created: dealsCreated,
        admin_user_id: userId,
        image_service: 'Picsum Photos (https://picsum.photos/300/200)'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return Response.json(
      { 
        success: false,
        error: 'Database seeding failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 