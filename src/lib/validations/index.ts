import { z } from 'zod';

export const contactoSchema = z.object({
    nombre: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
});

export const casoSchema = z.object({
    numero: z.string().min(1, 'Case number is required'),
    titulo: z.string().min(1, 'Title is required'),
    descripcion: z.string().optional(),
    estado: z.enum(['activo', 'cerrado', 'archivado']).default('activo'),
    cliente_id: z.string().optional().nullable(),
});

export const tareaSchema = z.object({
    titulo: z.string().min(1, 'Title is required'),
    descripcion: z.string().optional(),
    tipo: z.string().default('tarea'),
    estado: z.enum(['pendiente', 'en-progreso', 'completada']).default('pendiente'),
    fecha_vencimiento: z.string().optional(),
    caso_id: z.string().optional().nullable(),
});
