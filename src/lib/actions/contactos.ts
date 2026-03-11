'use server';

import { db } from '@/db';
import { contactos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { contactoSchema } from '../validations';

export async function getContactos() {
    return await db.select().from(contactos).orderBy(desc(contactos.creado_en));
}

export async function createContacto(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = contactoSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    await db.insert(contactos).values({
        id: uuidv4(),
        ...validatedFields.data,
    });

    revalidatePath('/contactos');
    revalidatePath('/clientes');
    revalidatePath('/');
    return { success: true };
}

export async function deleteContacto(id: string) {
    await db.delete(contactos).where(eq(contactos.id, id));
    revalidatePath('/contactos');
    revalidatePath('/clientes');
    revalidatePath('/');
}

export async function updateContacto(id: string, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = contactoSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    await db.update(contactos).set(validatedFields.data).where(eq(contactos.id, id));

    revalidatePath('/contactos');
    revalidatePath('/clientes');
    revalidatePath('/');
    return { success: true };
}
