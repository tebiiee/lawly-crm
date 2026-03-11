import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contactos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { contactoSchema } from '@/lib/validations';

// GET: Retrieve all contacts
export async function GET() {
    try {
        const data = await db.select().from(contactos).orderBy(desc(contactos.creado_en));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}

// POST: Create a new contact
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedFields = contactoSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: 'Invalid fields', details: validatedFields.error.flatten() },
                { status: 400 }
            );
        }

        const newId = uuidv4();
        await db.insert(contactos).values({
            id: newId,
            ...validatedFields.data,
        });

        // Fetch and return the created record
        const created = await db.select().from(contactos).where(eq(contactos.id, newId)).limit(1);
        return NextResponse.json(created[0], { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create contact', details: error.message }, { status: 500 });
    }
}

// PATCH: Update an existing contact
const updateSchema = contactoSchema.partial().extend({
    id: z.string().uuid("ID is required for patching"),
});

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const validatedFields = updateSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: 'Invalid fields', details: validatedFields.error.flatten() },
                { status: 400 }
            );
        }

        const { id, ...updateData } = validatedFields.data;

        await db.update(contactos).set(updateData).where(eq(contactos.id, id));

        const updated = await db.select().from(contactos).where(eq(contactos.id, id)).limit(1);
        if (updated.length === 0) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json(updated[0], { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update contact', details: error.message }, { status: 500 });
    }
}
