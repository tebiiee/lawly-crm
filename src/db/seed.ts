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
    const c1 = uuidv4(); const c2 = uuidv4(); const c3 = uuidv4(); const c4 = uuidv4();
    const c5 = uuidv4(); const c6 = uuidv4(); const c7 = uuidv4(); const c8 = uuidv4();
    const c9 = uuidv4(); const c10 = uuidv4(); const c11 = uuidv4(); const c12 = uuidv4();

    await db.insert(contactos).values([
        { id: c1, nombre: 'Grupo Inmobiliario Nexus', email: 'legal@nexus.com.mx', telefono: '+52 55 1234 5678', direccion: 'Av. Paseo de la Reforma 250, CDMX' },
        { id: c2, nombre: 'Elena Morales (Arquitecta)', email: 'emorales@studio-em.com', telefono: '+52 81 9876 5432', direccion: 'San Pedro Garza García, NL' },
        { id: c3, nombre: 'Logística Transcontinental', email: 'operaciones@transito-global.com', telefono: '+1 305 456 7890', direccion: 'Miami, FL, USA' },
        { id: c4, nombre: 'Constructora Pura Vida S.A.', email: 'legal@puravida-constructora.cr', telefono: '+506 2200 1234', direccion: 'San José, Costa Rica' },
        { id: c5, nombre: 'Fintech Oro Digital', email: 'compliance@orodigital.co', telefono: '+57 300 123 4567', direccion: 'Bogotá, Colombia' },
        { id: c6, nombre: 'Hospitales San Rafael', email: 'direccion@sanrafael.med', telefono: '+52 33 4455 6677', direccion: 'Zapopan, Jalisco' },
        { id: c7, nombre: 'Startup TechMinds', email: 'founders@techminds.io', telefono: '+1 415 987 6543', direccion: 'San Francisco, CA' },
        { id: c8, nombre: 'Agroexportadora del Sur', email: 'ventas@agrosur.cl', telefono: '+56 9 8765 4321', direccion: 'Santiago, Chile' },
        { id: c9, nombre: 'Dr. Alejandro Vargas', email: 'avargas@medicina-privada.com', telefono: '+52 55 9988 7766', direccion: 'Hospital ABC, CDMX' },
        { id: c10, nombre: 'Fundación Educación Primero', email: 'contacto@edupri.org', telefono: '+34 91 234 5678', direccion: 'Madrid, España' },
        { id: c11, nombre: 'Cervecería Artesanal Lúpulo', email: 'legal@lupulo-craft.com', telefono: '+54 11 4444 5555', direccion: 'Buenos Aires, Argentina' },
        { id: c12, nombre: 'María Fernanda Ruiz', email: 'mfruiz99@hotmail.com', telefono: '+52 55 1122 3344', direccion: 'Coyoacán, CDMX' }
    ]);
    console.log('✅ Contactos created');

    // 2. Create Mock Casos
    const caso1 = uuidv4(); const caso2 = uuidv4(); const caso3 = uuidv4(); const caso4 = uuidv4();
    const caso5 = uuidv4(); const caso6 = uuidv4(); const caso7 = uuidv4(); const caso8 = uuidv4();
    const caso9 = uuidv4(); const caso10 = uuidv4(); const caso11 = uuidv4(); const caso12 = uuidv4();

    await db.insert(casos).values([
        { id: caso1, numero: '2026-001', titulo: 'Auditoría de Cumplimiento Inmobiliario', descripcion: 'Revisión permisos desarrollo vertical Polanco.', estado: 'activo', cliente_id: c1 },
        { id: caso2, numero: '2026-042', titulo: 'Registro de Marca Internacional', descripcion: 'Trámite IMPI y WIPO para Studio EM.', estado: 'activo', cliente_id: c2 },
        { id: caso3, numero: '2025-103', titulo: 'Litigio Civil por Daños', descripcion: 'Defensa por interrupción de cadena suministro.', estado: 'activo', cliente_id: c3 },
        { id: caso4, numero: '2026-899', titulo: 'Due Diligence - Terrenos Guanacaste', descripcion: 'Revisión para adquisición de fincas costeras.', estado: 'activo', cliente_id: c4 },
        { id: caso5, numero: '2026-150', titulo: 'Licencia Sofipo Fintech', descripcion: 'Estructuración legal y trámites ante CNBV.', estado: 'activo', cliente_id: c5 },
        { id: caso6, numero: '2024-902', titulo: 'Negligencia Médica (Defensa)', descripcion: 'Caso heredado. Audiencia final programada.', estado: 'cerrado', cliente_id: c6 },
        { id: caso7, numero: '2026-333', titulo: 'Levantamiento de Capital Seed', descripcion: 'Revisión de Term Sheets de fondos americanos.', estado: 'activo', cliente_id: c7 },
        { id: caso8, numero: '2025-450', titulo: 'Contratos Exportación USA', descripcion: 'Redacción de lineamientos FDA y aduanas.', estado: 'archivado', cliente_id: c8 },
        { id: caso9, numero: '2026-112', titulo: 'Divorcio Administrativo', descripcion: 'Acuerdo de separación de bienes y custodia.', estado: 'activo', cliente_id: c9 },
        { id: caso10, numero: '2026-005', titulo: 'Registro Donataria Autorizada', descripcion: 'Alta ante el SAT para emitir recibos deducibles.', estado: 'activo', cliente_id: c10 },
        { id: caso11, numero: '2026-780', titulo: 'Litigio Laboral Colectivo', descripcion: 'Emplazamiento a huelga Sindicato Bebidas.', estado: 'activo', cliente_id: c11 },
        { id: caso12, numero: '2026-999', titulo: 'Sucesión Testamentaria', descripcion: 'Apertura de testamento y adjudicación de bienes.', estado: 'activo', cliente_id: c12 }
    ]);
    console.log('✅ Casos created');

    // 3. Create Mock Tareas with diverse dates
    const d = new Date();
    const fmt = (days: number) => {
        const nd = new Date(d);
        nd.setDate(nd.getDate() + days);
        return nd.toISOString().split('T')[0];
    };

    await db.insert(tareas).values([
        { id: uuidv4(), titulo: 'Redacción de Memorándum', descripcion: 'Borrrador auditoría.', estado: 'en-progreso', fecha_vencimiento: fmt(1), caso_id: caso1 },
        { id: uuidv4(), titulo: 'Preparar Solicitud IMPI', descripcion: 'Recopilar vectores.', estado: 'pendiente', fecha_vencimiento: fmt(2), caso_id: caso2 },
        { id: uuidv4(), titulo: 'Analizar Contrato', descripcion: 'Fuerza mayor.', estado: 'pendiente', fecha_vencimiento: fmt(7), caso_id: caso3 },
        { id: uuidv4(), titulo: 'Reunión Inicial', descripcion: 'Estrategia litigio.', estado: 'completada', fecha_vencimiento: fmt(-2), caso_id: caso3 },
        { id: uuidv4(), titulo: 'Evaluar Planos (CR)', descripcion: 'Revisar linderos.', estado: 'en-progreso', fecha_vencimiento: fmt(1), caso_id: caso4 },
        
        { id: uuidv4(), titulo: 'Enviar Requisitos PLD', descripcion: 'Manual prevención lavado.', estado: 'pendiente', fecha_vencimiento: fmt(5), caso_id: caso5 },
        { id: uuidv4(), titulo: 'Revisar acta asamblea', descripcion: 'Cambios mesa directiva.', estado: 'en-progreso', fecha_vencimiento: fmt(0), caso_id: caso5 },
        { id: uuidv4(), titulo: 'Cierre de archivo judicial', descripcion: 'Notificar al tribunal.', estado: 'completada', fecha_vencimiento: fmt(-30), caso_id: caso6 },
        { id: uuidv4(), titulo: 'Llamada con Inversionistas', descripcion: 'Venture Capital NY.', estado: 'pendiente', fecha_vencimiento: fmt(3), caso_id: caso7 },
        { id: uuidv4(), titulo: 'Apostillar Documentos', descripcion: 'Trámite Secretaria Gobernación.', estado: 'en-progreso', fecha_vencimiento: fmt(10), caso_id: caso7 },
        
        { id: uuidv4(), titulo: 'Revisar normatividad FDA', descripcion: 'Etiquetado frutas.', estado: 'completada', fecha_vencimiento: fmt(-15), caso_id: caso8 },
        { id: uuidv4(), titulo: 'Presentar convenio', descripcion: 'Juzgado familiar 4to.', estado: 'pendiente', fecha_vencimiento: fmt(14), caso_id: caso9 },
        { id: uuidv4(), titulo: 'Cita notaría', descripcion: 'Poder general.', estado: 'completada', fecha_vencimiento: fmt(-1), caso_id: caso9 },
        { id: uuidv4(), titulo: 'Acuse SAT', descripcion: 'Portal tramites RFC.', estado: 'pendiente', fecha_vencimiento: fmt(4), caso_id: caso10 },
        { id: uuidv4(), titulo: 'Borrador Estatutos', descripcion: 'Revisar objeto social.', estado: 'completada', fecha_vencimiento: fmt(-5), caso_id: caso10 },
        
        { id: uuidv4(), titulo: 'Contestación demanda', descripcion: 'Oponer excepciones laborales.', estado: 'pendiente', fecha_vencimiento: fmt(2), caso_id: caso11 },
        { id: uuidv4(), titulo: 'Ofrecimiento pruebas', descripcion: 'Testimoniales y confesional.', estado: 'pendiente', fecha_vencimiento: fmt(12), caso_id: caso11 },
        { id: uuidv4(), titulo: 'Búsqueda testamento', descripcion: 'Archivo general notarías.', estado: 'en-progreso', fecha_vencimiento: fmt(6), caso_id: caso12 },
        { id: uuidv4(), titulo: 'Avalúo propiedades', descripcion: 'Coordinar con perito valuador.', estado: 'pendiente', fecha_vencimiento: fmt(20), caso_id: caso12 },
        { id: uuidv4(), titulo: 'Llamada recordatorio', descripcion: 'Cobro de honorarios mes anterior.', estado: 'pendiente', fecha_vencimiento: fmt(0), caso_id: null }
    ]);
    
    console.log('✅ Tareas created');
    console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
