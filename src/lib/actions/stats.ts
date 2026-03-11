'use server';

import { db } from '@/db';
import { contactos, casos, tareas } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';

export async function getStats() {
    const [contactosCount] = await db.select({ count: sql<number>`count(*)` }).from(contactos);
    const [casosCount] = await db.select({ count: sql<number>`count(*)` }).from(casos);
    const [tareasCount] = await db.select({ count: sql<number>`count(*)` }).from(tareas);
    const [casosActivos] = await db.select({ count: sql<number>`count(*)` })
        .from(casos)
        .where(eq(casos.estado, 'activo'));

    return {
        contactos: contactosCount.count,
        casos: casosCount.count,
        tareas: tareasCount.count,
        casosActivos: casosActivos.count
    };
}
