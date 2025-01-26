import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { adminDb, adminAuth } from '@/utils/firebase-admin'
import type { User, Portfolio } from '@/types/firebase'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET')
    return new Response('Missing webhook secret', { status: 500 })
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers')
    return new Response('Missing svix headers', { status: 400 })
  }

  // Get the body
  let payload: any;
  try {
    payload = await req.json()
  } catch (err) {
    console.error('Error parsing webhook body:', err)
    return new Response('Error parsing body', { status: 400 })
  }

  const body = JSON.stringify(payload);

  // Verify the webhook
  let evt: WebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 })
  }

  // Handle the webhook
  try {
    const eventType = evt.type;
    
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;

      if (!email) {
        console.error('No email found for user');
        return new Response('No email found', { status: 400 });
      }

      // Create Firebase custom token
      await adminAuth.createCustomToken(id);

      // Start a batch write
      const batch = adminDb.batch();

      // 1. Create user document
      const userRef = adminDb.collection('users').doc(id);
      const userData: User = {
        id,
        email,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      batch.set(userRef, userData);

      // 2. Create default portfolio
      const portfolioRef = adminDb.collection('portfolios').doc();
      const portfolioData: Portfolio = {
        id: portfolioRef.id,
        userId: id,
        name: `${userData.name}'s Portfolio`,
        services: ['Wedding', 'Portrait', 'Event', 'Commercial'],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      batch.set(portfolioRef, portfolioData);


      // 4. Create default folders
      const defaultFolders = ['Wedding Photos', 'Portrait Sessions', 'Events'];
      defaultFolders.forEach(folderName => {
        const folderRef = adminDb.collection('folders').doc();
        batch.set(folderRef, {
          id: folderRef.id,
          userId: id,
          name: folderName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      return new Response('User and related collections created successfully', { status: 200 });
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Internal server error', { status: 500 });
  }
} 