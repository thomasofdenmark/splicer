import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    category: 'Electronics',
    base_price: 12999, // $129.99
    minimum_quantity: 10,
    max_participants: 50,
    image_urls: ['/products/headphones.jpg'],
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Noise Cancellation': 'Active',
      'Weight': '250g'
    }
  },
  {
    name: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and waterproof design. Track your health and fitness goals.',
    category: 'Electronics',
    base_price: 8999, // $89.99
    minimum_quantity: 15,
    max_participants: 100,
    image_urls: ['/products/fitness-tracker.jpg'],
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery': '7 days',
      'Water Resistance': '5ATM',
      'Sensors': 'Heart Rate, GPS, Accelerometer'
    }
  },
  {
    name: 'Organic Coffee Beans - Premium Blend',
    description: 'Ethically sourced organic coffee beans from South America. Rich, full-bodied flavor perfect for espresso or drip coffee.',
    category: 'Food & Beverages',
    base_price: 2499, // $24.99
    minimum_quantity: 20,
    max_participants: 200,
    image_urls: ['/products/coffee-beans.jpg'],
    specifications: {
      'Origin': 'Colombia, Brazil',
      'Roast Level': 'Medium',
      'Weight': '1kg',
      'Certification': 'Organic, Fair Trade'
    }
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Professional ergonomic office chair with lumbar support, adjustable height, and breathable mesh back. Perfect for long work sessions.',
    category: 'Home & Garden',
    base_price: 29999, // $299.99
    minimum_quantity: 5,
    max_participants: 25,
    image_urls: ['/products/office-chair.jpg'],
    specifications: {
      'Material': 'Mesh and Fabric',
      'Weight Capacity': '150kg',
      'Adjustability': 'Height, Armrests, Lumbar',
      'Warranty': '5 years'
    }
  },
  {
    name: 'Yoga Mat Set with Blocks',
    description: 'Premium yoga mat set including non-slip mat, yoga blocks, and carrying strap. Perfect for home or studio practice.',
    category: 'Sports & Outdoors',
    base_price: 4999, // $49.99
    minimum_quantity: 12,
    max_participants: 75,
    image_urls: ['/products/yoga-mat.jpg'],
    specifications: {
      'Mat Size': '183cm x 61cm',
      'Thickness': '6mm',
      'Material': 'TPE (Eco-friendly)',
      'Includes': 'Mat, 2 blocks, strap'
    }
  },
  {
    name: 'Skincare Routine Bundle',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Suitable for all skin types with natural ingredients.',
    category: 'Health & Beauty',
    base_price: 7999, // $79.99
    minimum_quantity: 8,
    max_participants: 60,
    image_urls: ['/products/skincare-bundle.jpg'],
    specifications: {
      'Products': '4-step routine',
      'Skin Type': 'All types',
      'Ingredients': 'Natural, Cruelty-free',
      'Size': 'Full size products'
    }
  }
];

export async function GET() {
  try {
    console.log('🌱 Seeding sample products...');

    // Get the first user to assign as creator
    const users = await sql`SELECT id FROM users LIMIT 1`;
    if (users.length === 0) {
      return Response.json(
        { error: 'No users found. Please seed users first.' },
        { status: 400 }
      );
    }
    const userId = users[0].id;

    // Get categories
    const categories = await sql`SELECT id, name FROM categories`;
    const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));

    let productsCreated = 0;

    for (const product of sampleProducts) {
      const categoryId = categoryMap.get(product.category);
      if (!categoryId) {
        console.warn(`Category ${product.category} not found, skipping product ${product.name}`);
        continue;
      }

      // Check if product already exists
      const existing = await sql`
        SELECT id FROM products WHERE name = ${product.name}
      `;

      if (existing.length === 0) {
        await sql`
          INSERT INTO products (
            name, 
            description, 
            category_id, 
            base_price, 
            minimum_quantity, 
            max_participants,
            image_urls,
            specifications,
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
            ${userId}
          );
        `;
        productsCreated++;
      }
    }

    console.log(`✅ Created ${productsCreated} sample products`);

    return Response.json({
      message: `Successfully seeded ${productsCreated} sample products`,
      timestamp: new Date().toISOString(),
      products_created: productsCreated,
      total_attempted: sampleProducts.length
    });

  } catch (error) {
    console.error('❌ Product seeding failed:', error);
    return Response.json(
      { 
        error: 'Product seeding failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 