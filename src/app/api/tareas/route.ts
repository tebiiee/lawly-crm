import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tareas, casos } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { tareaSchema } from '@/lib/validations';

// GET: Retrieve all tasks
export async function GET() {
    try {
        const data = await db.select({
            id: tareas.id,
            titulo: tareas.titulo,
            descripcion: tareas.descripcion,
            tipo: tareas.tipo,
            estado: tareas.estado,
            fecha_vencimiento: tareas.fecha_vencimiento,
            caso_id: tareas.caso_id,
            creado_en: tareas.creado_en,
            caso_numero: casos.numero
        })
            .from(tareas)
            .leftJoin(casos, eq(tareas.caso_id, casos.id))
            .orderBy(asc(tareas.fecha_vencimiento));

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

// POST: Create a new task
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.caso_id === '') body.caso_id = null;

        const validatedFields = tareaSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: 'Invalid fields', details: validatedFields.error.flatten() },
                { status: 400 }
            );
        }

        const newId = uuidv4();
        await db.insert(tareas).values({
            id: newId,
            ...validatedFields.data,
        });

        const created = await db.select().from(tareas).where(eq(tareas.id, newId)).limit(1);
        return NextResponse.json(created[0], { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create task', details: error.message }, { status: 500 });
    }
}

// PATCH: Update an existing task
const updateSchema = tareaSchema.partial().extend({
    id: z.string().uuid("ID is required for patching"),
});

export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        if (body.caso_id === '') body.caso_id = null;

        const validatedFields = updateSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: 'Invalid fields', details: validatedFields.error.flatten() },
                { status: 400 }
            );
        }

        const { id, ...updateData } = validatedFields.data;

        await db.update(tareas).set(updateData).where(eq(tareas.id, id));

        const updated = await db.select().from(tareas).where(eq(tareas.id, id)).limit(1);
        if (updated.length === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(updated[0], { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update task', details: error.message }, { status: 500 });
    }
}
