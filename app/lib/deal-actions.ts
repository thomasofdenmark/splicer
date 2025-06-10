'use server';

import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { z } from 'zod';

import { auth } from '@/auth';

import type { GroupDealActionState, JoinDealActionState } from './group-buying-types';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Validation schemas
const CreateGroupDealSchema = z.object({
  product_id: z.string().uuid('Please select a valid product.'),
  title: z.string().min(1, 'Title is required.').max(100, 'Title must be 100 characters or less.'),
  description: z.string().optional(),
  target_participants: z.coerce
    .number()
    .int()
    .min(2, 'Minimum 2 participants required.')
    .max(1000, 'Maximum 1000 participants allowed.'),
  target_quantity: z.coerce
    .number()
    .int()
    .min(1, 'Target quantity must be at least 1.')
    .optional(),
  discount_percentage: z.coerce
    .number()
    .min(1, 'Discount must be at least 1%.')
    .max(80, 'Discount cannot exceed 80%.'),
  duration_hours: z.coerce
    .number()
    .int()
    .min(1, 'Duration must be at least 1 hour.')
    .max(720, 'Duration cannot exceed 30 days.'), // 30 days max
});

const JoinDealSchema = z.object({
  deal_id: z.string().uuid('Invalid deal ID.'),
  quantity: z.coerce
    .number()
    .int()
    .min(1, 'Quantity must be at least 1.')
    .max(100, 'Maximum 100 items per person.'),
  notes: z.string().max(500, 'Notes must be 500 characters or less.').optional(),
});

export async function createGroupDeal(
  prevState: GroupDealActionState,
  formData: FormData,
): Promise<GroupDealActionState> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'You must be logged in to create group deals.',
    };
  }

  const validatedFields = CreateGroupDealSchema.safeParse({
    product_id: formData.get('product_id'),
    title: formData.get('title'),
    description: formData.get('description'),
    target_participants: formData.get('target_participants'),
    target_quantity: formData.get('target_quantity'),
    discount_percentage: formData.get('discount_percentage'),
    duration_hours: formData.get('duration_hours'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create group deal.',
    };
  }

  const {
    product_id,
    title,
    description,
    target_participants,
    target_quantity,
    discount_percentage,
    duration_hours,
  } = validatedFields.data;

  try {
    // Get product details to calculate prices
    const product = await sql<[{ base_price: number; name: string }]>`
      SELECT base_price, name FROM products WHERE id = ${product_id} AND is_active = true;
    `;

    if (!product.length) {
      return {
        errors: { product_id: ['Product not found or inactive.'] },
        message: 'Failed to create group deal.',
      };
    }

    const originalPrice = product[0].base_price;
    const dealPrice = originalPrice * (1 - discount_percentage / 100);
    
    // Calculate end date
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + duration_hours);

    // Create the group deal
    const dealId = await sql<[{ id: string }]>`
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
         ${product_id},
         ${title},
         ${description || ''},
         ${target_participants},
         ${target_quantity || target_participants},
        0,
        0,
        ${dealPrice},
        ${originalPrice},
        ${discount_percentage},
        NOW(),
        ${endDate.toISOString()},
        'pending',
        ${session.user.id}
      ) RETURNING id;
    `;

    revalidatePath('/deals');
    revalidatePath('/products');
    revalidatePath(`/deals/${dealId[0].id}`);
    
    // Return success state - the redirect will be handled in the component
    return {
      errors: {},
      message: 'Deal created successfully! Redirecting to deal page...',
      dealId: dealId[0].id,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      errors: {},
      message: 'Database Error: Failed to create group deal.',
    };
  }
}

export async function joinGroupDeal(
  prevState: JoinDealActionState,
  formData: FormData,
): Promise<JoinDealActionState> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return {
      errors: {},
      message: 'You must be logged in to join group deals.',
    };
  }

  const validatedFields = JoinDealSchema.safeParse({
    deal_id: formData.get('deal_id'),
    quantity: formData.get('quantity'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to join group deal.',
    };
  }

  const { deal_id, quantity, notes } = validatedFields.data;
  const notesString = notes || '';

  try {
    // Check if user has any existing participation (active or cancelled)
    const existingParticipation = await sql<[{ id: string; status: string }]>`
      SELECT id, status FROM deal_participants 
      WHERE deal_id = ${deal_id} AND user_id = ${session.user.id};
    `;

    if (existingParticipation.length > 0) {
      if (existingParticipation[0].status === 'active') {
        return {
          errors: {},
          message: 'You are already participating in this group deal.',
        };
      }
      // If user previously left (status = 'cancelled'), we'll reactivate their participation
    }

    // Get deal details and check if it's still active
    const deal = await sql<[{
      id: string;
      status: string;
      current_participants: number;
      target_participants: number;
      current_quantity: number;
      end_date: string;
      max_participants?: number;
    }]>`
      SELECT 
        id, status, current_participants, target_participants, current_quantity, end_date,
        (SELECT max_participants FROM products WHERE id = gd.product_id) as max_participants
      FROM group_deals gd
      WHERE id = ${deal_id};
    `;

    if (!deal.length) {
      return {
        errors: { deal_id: ['Deal not found.'] },
        message: 'Failed to join group deal.',
      };
    }

    const dealData = deal[0];

    // Check if deal is still active
    if (dealData.status !== 'pending' && dealData.status !== 'active') {
      return {
        errors: {},
        message: 'This group deal is no longer active.',
      };
    }

    // Check if deal has expired
    if (new Date(dealData.end_date) < new Date()) {
      return {
        errors: {},
        message: 'This group deal has expired.',
      };
    }

    // Check if there's space for more participants
    if (dealData.max_participants && dealData.current_participants >= dealData.max_participants) {
      return {
        errors: {},
        message: 'This group deal is already full.',
      };
    }

    // Add participant and update deal counters in a transaction
    await sql.begin(async (sql) => {
      if (existingParticipation.length > 0) {
        // Reactivate existing cancelled participation
        await sql`
          UPDATE deal_participants 
          SET 
            quantity = ${quantity},
            joined_at = NOW(),
            status = 'active',
            notes = ${notesString}
          WHERE deal_id = ${deal_id} AND user_id = ${session.user!.id};
        `;
      } else {
        // Add new participant
        await sql`
          INSERT INTO deal_participants (
            deal_id,
            user_id,
            quantity,
            joined_at,
            status,
            notes
          ) VALUES (
            ${deal_id},
            ${session.user!.id},
            ${quantity},
            NOW(),
            'active',
            ${notesString}
          );
        `;
      }

      // Update deal counters
      await sql`
        UPDATE group_deals 
        SET 
          current_participants = current_participants + 1,
          current_quantity = current_quantity + ${quantity},
          status = CASE 
            WHEN current_participants + 1 >= target_participants THEN 'active'
            ELSE status
          END,
          updated_at = NOW()
        WHERE id = ${deal_id};
      `;
    });

    revalidatePath('/deals');
    revalidatePath(`/deals/${deal_id}`);
    
    return {
      errors: {},
      message: 'Successfully joined the group deal!',
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      errors: {},
      message: 'Database Error: Failed to join group deal.',
    };
  }
}

export async function leaveDeal(dealId: string, userId?: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('You must be logged in to leave group deals.');
  }

  const userIdToRemove = userId || session.user.id;

  try {
    // Get participant details before removing
    const participant = await sql<[{ quantity: number }]>`
      SELECT quantity FROM deal_participants 
      WHERE deal_id = ${dealId} AND user_id = ${userIdToRemove} AND status = 'active';
    `;

    if (!participant.length) {
      throw new Error('Participation not found.');
    }

    const quantity = participant[0].quantity;

    // Remove participant and update counters in a transaction
    await sql.begin(async (sql) => {
      // Update participant status
      await sql`
        UPDATE deal_participants 
        SET status = 'cancelled', notes = COALESCE(notes, '') || ' [Left the deal]'
        WHERE deal_id = ${dealId} AND user_id = ${userIdToRemove} AND status = 'active';
      `;

      // Update deal counters
      await sql`
        UPDATE group_deals 
        SET 
          current_participants = current_participants - 1,
          current_quantity = current_quantity - ${quantity},
          status = CASE 
            WHEN current_participants - 1 < target_participants THEN 'pending'
            ELSE status
          END,
          updated_at = NOW()
        WHERE id = ${dealId};
      `;
    });

    revalidatePath('/deals');
    revalidatePath(`/deals/${dealId}`);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to leave group deal.');
  }
}

export async function cancelDeal(dealId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('You must be logged in to cancel group deals.');
  }

  try {
    // Check if user is the creator or admin
    const deal = await sql<[{ created_by: string }]>`
      SELECT created_by FROM group_deals WHERE id = ${dealId};
    `;

    if (!deal.length) {
      throw new Error('Deal not found.');
    }

    if (deal[0].created_by !== session.user.id) {
      throw new Error('Only the deal creator can cancel this deal.');
    }

    // Cancel the deal and all participants
    await sql.begin(async (sql) => {
      // Cancel all participants
      await sql`
        UPDATE deal_participants 
        SET status = 'cancelled', notes = COALESCE(notes, '') || ' [Deal cancelled by creator]'
        WHERE deal_id = ${dealId} AND status = 'active';
      `;

      // Cancel the deal
      await sql`
        UPDATE group_deals 
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = ${dealId};
      `;
    });

    revalidatePath('/deals');
    revalidatePath(`/deals/${dealId}`);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to cancel group deal.');
  }
} 