import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const contactos = sqliteTable('contactos', {
    id: text('id').primaryKey(),
    nombre: text('nombre').notNull(),
    email: text('email'),
    telefono: text('telefono'),
    direccion: text('direccion'),
    creado_en: text('creado_en').default(sql`CURRENT_TIMESTAMP`),
});

export const casos = sqliteTable('casos', {
    id: text('id').primaryKey(),
    numero: text('numero').notNull().unique(),
    titulo: text('titulo').notNull(),
    descripcion: text('descripcion'),
    estado: text('estado').default('activo'),
    cliente_id: text('cliente_id').references(() => contactos.id),
    creado_en: text('creado_en').default(sql`CURRENT_TIMESTAMP`),
});

export const tareas = sqliteTable('tareas', {
    id: text('id').primaryKey(),
    titulo: text('titulo').notNull(),
    descripcion: text('descripcion'),
    tipo: text('tipo').default('tarea'),
    estado: text('estado').default('pendiente'),
    fecha_vencimiento: text('fecha_vencimiento'),
    caso_id: text('caso_id').references(() => casos.id),
    creado_en: text('creado_en').default(sql`CURRENT_TIMESTAMP`),
});
