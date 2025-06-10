import postgres from 'postgres';

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Deal,
  Product,
  DealStats,
  LatestDealRaw,
  ActiveUser,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].count ?? '0');
    const numberOfCustomers = Number(data[1].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// New functions for the refactored dashboard
export async function fetchDashboardCardData() {
  try {
    // Mock data for demonstration - replace with actual database queries
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const totalDeals = 127;
    const totalProducts = 89;
    const totalUsers = 45;
    const activeDeals = 23;
    
    return {
      totalDeals,
      totalProducts, 
      totalUsers,
      activeDeals,
    };
  } catch (error) {
    console.error('Dashboard Error:', error);
    throw new Error('Failed to fetch dashboard card data.');
  }
}

export async function fetchDealStats() {
  try {
    // Mock data for demonstration - replace with actual database queries
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const dealStats: DealStats[] = [
      { month: 'Jan', deals: 12 },
      { month: 'Feb', deals: 18 },
      { month: 'Mar', deals: 15 },
      { month: 'Apr', deals: 22 },
      { month: 'May', deals: 19 },
      { month: 'Jun', deals: 25 },
      { month: 'Jul', deals: 21 },
      { month: 'Aug', deals: 28 },
      { month: 'Sep', deals: 24 },
      { month: 'Oct', deals: 32 },
      { month: 'Nov', deals: 29 },
      { month: 'Dec', deals: 35 },
    ];
    
    return dealStats;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch deal statistics.');
  }
}

export async function fetchLatestDeals() {
  try {
    // Mock data for demonstration - replace with actual database queries
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const latestDealsRaw: LatestDealRaw[] = [
      { 
        id: '1', 
        title: 'Enterprise Software License', 
        company: 'TechCorp Inc.', 
        value: 125000, 
        status: 'open' 
      },
      { 
        id: '2', 
        title: 'Cloud Migration Project', 
        company: 'Global Systems Ltd.', 
        value: 89000, 
        status: 'pending' 
      },
      { 
        id: '3', 
        title: 'Marketing Campaign', 
        company: 'Creative Agency', 
        value: 45000, 
        status: 'closed' 
      },
      { 
        id: '4', 
        title: 'Data Analytics Suite', 
        company: 'Analytics Pro', 
        value: 78000, 
        status: 'open' 
      },
      { 
        id: '5', 
        title: 'Mobile App Development', 
        company: 'StartupXYZ', 
        value: 95000, 
        status: 'pending' 
      },
    ];
    
    const latestDeals = latestDealsRaw.map((deal) => ({
      ...deal,
      value: formatCurrency(deal.value),
    }));
    
    return latestDeals;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest deals.');
  }
}

export async function fetchActiveUsers() {
  try {
    // Mock data for demonstration - replace with actual database queries
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const activeUsers: ActiveUser[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        image_url: '/customers/sarah-jones.png',
        last_login: '2024-01-15 14:30:00',
        role: 'admin'
      },
      {
        id: '2', 
        name: 'Michael Chen',
        email: 'michael.c@company.com',
        image_url: '/customers/michael-novotny.png',
        last_login: '2024-01-15 13:45:00',
        role: 'user'
      },
      {
        id: '3',
        name: 'Emily Davis',
        email: 'emily.d@company.com', 
        image_url: '/customers/amy-burns.png',
        last_login: '2024-01-15 12:20:00',
        role: 'user'
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'david.w@company.com',
        image_url: '/customers/balazs-orban.png',
        last_login: '2024-01-15 11:15:00',
        role: 'user'
      },
      {
        id: '5',
        name: 'Lisa Anderson',
        email: 'lisa.a@company.com',
        image_url: '/customers/lee-robinson.png', 
        last_login: '2024-01-15 10:30:00',
        role: 'admin'
      },
    ];
    
    return activeUsers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch active users.');
  }
}
