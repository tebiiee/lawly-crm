'use client';

import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { getTareas } from '@/lib/actions/tareas';

// Simple types for client component
type TareaData = {
    id: string;
    titulo: string;
    descripcion: string | null;
    estado: string | null;
    fecha_vencimiento: string | null;
};

export default function CalendarioPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [tareas, setTareas] = useState<TareaData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getTareas();
            setTareas(data as TareaData[]);
            setLoading(false);
        }
        load();
    }, []);

    const tareasDelDia = tareas.filter(t => {
        if (!t.fecha_vencimiento) return false;
        // Localize the DB date string properly to match react-calendar
        const tareaDate = new Date(t.fecha_vencimiento);
        // Ignore time completely, match YYYY-MM-DD
        return tareaDate.getUTCFullYear() === date?.getFullYear() &&
            tareaDate.getUTCMonth() === date?.getMonth() &&
            tareaDate.getUTCDate() === date?.getDate();
    });

    return (
        <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto">
            <header className="flex flex-col gap-2 border-b border-border/50 pb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                    Calendario<span className="text-muted-foreground">.</span>
                </h1>
                <p className="text-base text-muted-foreground tracking-tight">Mapa temporal de fechas límite.</p>
            </header>

            <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
                {/* Calendar Picker Matrix */}
                <div className="md:col-span-6 lg:col-span-5 min-w-0 bg-background border border-border/50 p-6 md:p-8 flex items-center justify-center overflow-x-auto">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="font-mono tracking-tighter [--cell-size:2rem] md:[--cell-size:2.5rem] lg:[--cell-size:3rem] [&_[data-slot=calendar]]:w-full"
                    />
                </div>

                {/* Task Detail Panel */}
                <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-8 min-w-0">
                    <div>
                        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-4 mb-4">
                            {date ? date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Seleccionar Fecha'}
                        </h2>

                        {loading ? (
                            <div className="animate-pulse flex gap-4">
                                <div className="h-5 w-1/4 bg-muted/50" />
                                <div className="h-5 w-1/2 bg-muted/50" />
                            </div>
                        ) : tareasDelDia.length === 0 ? (
                            <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground opacity-50 py-12">
                                No hay directrices para esta fecha.
                            </p>
                        ) : (
                            <div className="flex flex-col divide-y divide-border/50">
                                {tareasDelDia.map(tarea => (
                                    <div key={tarea.id} className="py-6 flex flex-col gap-4 group">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-2xl font-medium tracking-tight group-hover:text-primary transition-colors">
                                                {tarea.titulo}
                                            </h3>
                                            <Badge variant={tarea.estado === 'completada' ? 'secondary' : tarea.estado === 'en-progreso' ? 'default' : 'outline'} className="rounded-none font-mono text-xs uppercase tracking-widest bg-transparent border-foreground/30 text-foreground">
                                                {tarea.estado ? tarea.estado.replace('-', ' ') : 'N/D'}
                                            </Badge>
                                        </div>
                                        {tarea.descripcion && (
                                            <p className="text-base text-muted-foreground tracking-tight leading-relaxed max-w-lg">
                                                {tarea.descripcion}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
