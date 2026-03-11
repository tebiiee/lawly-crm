'use server';

import { db } from '@/db';
import { casos, contactos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { casoSchema } from '../validations';

export async function getCasos() {
    const allCasos = await db.select({
        id: casos.id,
        numero: casos.numero,
        titulo: casos.titulo,
        descripcion: casos.descripcion,
        estado: casos.estado,
        cliente_id: casos.cliente_id,
        creado_en: casos.creado_en,
        cliente_nombre: contactos.nombre
    })
        .from(casos)
        .leftJoin(contactos, eq(casos.cliente_id, contactos.id))
        .orderBy(desc(casos.creado_en));

    return allCasos;
}

export async function createCaso(formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    // Handle empty string as null for foreign key
    if (data.cliente_id === '') {
        (data as any).cliente_id = null;
    }

    const validatedFields = casoSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields', details: validatedFields.error.flatten() };
    }

    try {
        await db.insert(casos).values({
            id: uuidv4(),
            ...validatedFields.data,
        });
    } catch (e: any) {
        if (e.message?.includes('UNIQUE constraint failed')) {
            return { error: 'Case number already exists' };
        }
        return { error: 'Failed to create case' };
    }

    revalidatePath('/casos');
    revalidatePath('/');
    return { success: true };
}

export async function deleteCaso(id: string) {
    await db.delete(casos).where(eq(casos.id, id));
    revalidatePath('/casos');
    revalidatePath('/');
}

export async function updateCaso(id: string, formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    if (data.cliente_id === '') {
        (data as any).cliente_id = null;
    }

    const validatedFields = casoSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields', details: validatedFields.error.flatten() };
    }

    try {
        await db.update(casos).set(validatedFields.data).where(eq(casos.id, id));
    } catch (e: any) {
        if (e.message?.includes('UNIQUE constraint failed')) {
            return { error: 'Case number already exists' };
        }
        return { error: 'Failed to update case' };
    }

    revalidatePath('/casos');
    revalidatePath('/');
    return { success: true };
}
