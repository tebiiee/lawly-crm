import { db } from './index';
import { contactos, casos, tareas } from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('🌱 Seeding database with mock data...');

    await db.delete(tareas);
    await db.delete(casos);
    await db.delete(contactos);
    console.log('🧹 Old data wiped');

    // 1. Create Mock Contacts
    const contactoId1 = uuidv4();
    const contactoId2 = uuidv4();
    const contactoId3 = uuidv4();

    await db.insert(contactos).values([
        {
            id: contactoId1,
            nombre: 'Grupo Inmobiliario Nexus',
            email: 'legal@nexus.com.mx',
            telefono: '+52 55 1234 5678',
            direccion: 'Av. Paseo de la Reforma 250, CDMX',
        },
        {
            id: contactoId2,
            nombre: 'Elena Morales (Arquitecta)',
            email: 'emorales@studio-em.com',
            telefono: '+52 81 9876 5432',
            direccion: 'San Pedro Garza García, NL',
        },
        {
            id: contactoId3,
            nombre: 'Logística Transcontinental',
            email: 'operaciones@transito-global.com',
            telefono: '+1 305 456 7890',
            direccion: 'Miami, FL, USA / Sucursal CDMX',
        },
        {
            id: uuidv4(),
            nombre: 'Constructora Pura Vida S.A.',
            email: 'legal@puravida-constructora.cr',
            telefono: '+506 2200 1234',
            direccion: 'San José, Costa Rica',
        }
    ]);

    console.log('✅ Contactos created');

    // 2. Create Mock Casos
    const casoId1 = uuidv4();
    const casoId2 = uuidv4();
    const casoId3 = uuidv4();

    await db.insert(casos).values([
        {
            id: casoId1,
            numero: '2026-001',
            titulo: 'Auditoría de Cumplimiento Inmobiliario',
            descripcion: 'Revisión extensiva de permisos de uso de suelo y licencias de construcción para el nuevo desarrollo vertical en Polanco.',
            estado: 'activo',
            cliente_id: contactoId1,
        },
        {
            id: casoId2,
            numero: '2026-042',
            titulo: 'Registro de Marca Internacional',
            descripcion: 'Trámite ante el IMPI y WIPO para la protección de marca nominativa y diseño industrial del Studio EM.',
            estado: 'activo',
            cliente_id: contactoId2,
        },
        {
            id: casoId3,
            numero: '2025-103',
            titulo: 'Litigio Civil por Daños',
            descripcion: 'Defensa ante la corte civil por la demanda de interrupción de cadena de suministro y avería gruesa marítima.',
            estado: 'abierto', // Assuming schema allows string, or activo
            cliente_id: contactoId3,
        },
        {
            id: uuidv4(),
            numero: '2026-899',
            titulo: 'Due Diligence - Terrenos Guanacaste',
            descripcion: 'Revisión registral y municipal para adquisición de fincas costeras en la Península de Nicoya, CR.',
            estado: 'activo',
            cliente_id: null,
        }
    ]);

    console.log('✅ Casos created');

    // 3. Create Mock Tareas with upcoming dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await db.insert(tareas).values([
        {
            id: uuidv4(),
            titulo: 'Redacción de Memorándum de Revisión',
            descripcion: 'Elaborar el primer borrador de la auditoría y destacar los riesgos de zonificación identificados. Enviar al cliente antes de la llamada del viernes.',
            estado: 'en-progreso',
            fecha_vencimiento: tomorrow.toISOString().split('T')[0],
            caso_id: casoId1,
        },
        {
            id: uuidv4(),
            titulo: 'Preparar Solicitud IMPI',
            descripcion: 'Recopilar los archivos vectoriales del logo, pago de derechos y poderes notariales para presentar mañana.',
            estado: 'pendiente',
            fecha_vencimiento: tomorrow.toISOString().split('T')[0],
            caso_id: casoId2,
        },
        {
            id: uuidv4(),
            titulo: 'Analizar Contrato de Fletamento',
            descripcion: 'Revisión exhaustiva de las cláusulas de Fuerza Mayor y Responsabilidad Limitada en el contrato original de 2024.',
            estado: 'pendiente',
            fecha_vencimiento: nextWeek.toISOString().split('T')[0],
            caso_id: casoId3,
        },
        {
            id: uuidv4(),
            titulo: 'Reunión Inicial de Litigio',
            descripcion: 'Videollamada con los directivos de logística para trazar la estrategia de mediación y evitar el embargo.',
            estado: 'completada',
            fecha_vencimiento: today.toISOString().split('T')[0],
            caso_id: casoId3,
        },
        {
            id: uuidv4(),
            titulo: 'Evaluar Planos Catastrados (CR)',
            descripcion: 'Revisar la superposición de linderos en la finca matriz de Guanacaste según el Registro Nacional de Costa Rica.',
            estado: 'en-progreso',
            fecha_vencimiento: tomorrow.toISOString().split('T')[0],
            caso_id: null,
        }
    ]);

    console.log('✅ Tareas created');
    console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
