'use server';

import { db } from '@/db';
import { tareas, casos } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { tareaSchema } from '../validations';

export async function getTareas() {
    const allTareas = await db.select({
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

    return allTareas;
}

export async function createTarea(formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    if (data.caso_id === '') {
        (data as any).caso_id = null;
    }

    const validatedFields = tareaSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields', details: validatedFields.error.flatten() };
    }

    await db.insert(tareas).values({
        id: uuidv4(),
        ...validatedFields.data,
    });

    revalidatePath('/tareas');
    revalidatePath('/calendario');
    revalidatePath('/');
    return { success: true };
}

export async function deleteTarea(id: string) {
    await db.delete(tareas).where(eq(tareas.id, id));
    revalidatePath('/tareas');
    revalidatePath('/calendario');
    revalidatePath('/');
}

export async function updateTarea(id: string, formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    if (data.caso_id === '') {
        (data as any).caso_id = null;
    }

    const validatedFields = tareaSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields', details: validatedFields.error.flatten() };
    }

    await db.update(tareas).set(validatedFields.data).where(eq(tareas.id, id));

    revalidatePath('/tareas');
    revalidatePath('/calendario');
    revalidatePath('/tablero');
    revalidatePath('/');
    return { success: true };
}

export async function updateTareaEstado(id: string, estado: string) {
    if (!['pendiente', 'en-progreso', 'completada'].includes(estado)) {
        return { error: 'Invalid state' };
    }
    await db.update(tareas).set({ estado: estado as any }).where(eq(tareas.id, id));
    revalidatePath('/tareas');
    revalidatePath('/calendario');
    revalidatePath('/tablero');
    revalidatePath('/');
    return { success: true };
}
