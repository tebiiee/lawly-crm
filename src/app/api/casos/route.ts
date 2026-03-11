import { NextResponse } from 'next/server';
import { db } from '@/db';
import { casos, contactos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { casoSchema } from '@/lib/validations';

// GET: Retrieve all cases
export async function GET() {
    try {
        const data = await db.select({
            id: casos.id,
            numero: casos.numero,
            titulo: casos.titulo,
            descripcion: casos.descripcion,
            estado: casos.estado,
            cliente_id: casos.cliente_id,
            cliente_nombre: contactos.nombre,
            creado_en: casos.creado_en
        })
            .from(casos)
            .leftJoin(contactos, eq(casos.cliente_id, contactos.id))
            .orderBy(desc(casos.creado_en));

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
    }
}

// POST: Create a new case
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.cliente_id === '') body.cliente_id = null;

        const validatedFields = casoSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: 'Invalid fields', details: validatedFields.error.flatten() },
                { status: 400 }
            );
        }

        const newId = uuidv4();
        await db.insert(casos).values({
            id: newId,
            ...validatedFields.data,
        });

        const created = await db.select().from(casos).where(eq(casos.id, newId)).limit(1);
        return NextResponse.json(created[0], { status: 201 });

    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
            return NextResponse.json({ error: 'Case number already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create case', details: error.message }, { status: 500 });
    }
}

// PATCH: Update an existing case
const updateSchema = casoSchema.partial().extend({
    id: z.string().uuid("ID is required for patching"),
});

export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        if (body.cliente_id === '') body.cliente_id = null;

        const validatedFields = updateSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: 'Invalid fields', details: validatedFields.error.flatten() },
                { status: 400 }
            );
        }

        const { id, ...updateData } = validatedFields.data;

        await db.update(casos).set(updateData).where(eq(casos.id, id));

        const updated = await db.select().from(casos).where(eq(casos.id, id)).limit(1);
        if (updated.length === 0) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }

        return NextResponse.json(updated[0], { status: 200 });

    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
            return NextResponse.json({ error: 'Case number already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update case', details: error.message }, { status: 500 });
    }
}
