"use client"

import React, { useState, useEffect, useTransition } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateTareaEstado } from '@/lib/actions/tareas';
import { Badge } from '@/components/ui/badge';

type TareaData = {
    id: string;
    titulo: string;
    descripcion: string | null;
    estado: string | null;
    fecha_vencimiento: string | null;
};

const COLUMNS = [
    { id: 'pendiente', title: 'Pendiente' },
    { id: 'en-progreso', title: 'En Progreso' },
    { id: 'completada', title: 'Completada' }
];

export function KanbanBoard({ initialTareas }: { initialTareas: TareaData[] }) {
    const [isMounted, setIsMounted] = useState(false);
    const [tareas, setTareas] = useState<TareaData[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setIsMounted(true);
        setTareas(initialTareas);
    }, [initialTareas]);

    if (!isMounted) return null;

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const newEstado = destination.droppableId;

        // Optimistic UI change
        setTareas(prev => prev.map(t => t.id === draggableId ? { ...t, estado: newEstado } : t));

        // Persist to server
        startTransition(() => {
            updateTareaEstado(draggableId, newEstado);
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-8 h-full w-full overflow-x-auto pb-4">
                {COLUMNS.map(col => {
                    const colTareas = tareas.filter(t => t.estado === col.id);

                    return (
                        <div key={col.id} className="flex flex-col bg-muted/20 border border-border/50 min-w-[320px] w-full max-w-md rounded-none">
                            <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/40">
                                <span className="font-mono text-xs uppercase tracking-widest text-foreground">{col.title}</span>
                                <Badge variant="secondary" className="rounded-none font-mono text-xs px-2">{colTareas.length}</Badge>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 px-5 py-8 flex flex-col gap-6 min-h-[60vh] transition-colors ${snapshot.isDraggingOver ? 'bg-muted/40 border-dashed border border-foreground/30 inset-0' : ''}`}
                                    >
                                        {colTareas.map((tarea, index) => (
                                            <Draggable key={tarea.id} draggableId={tarea.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-background border-2 ${snapshot.isDragging ? 'border-foreground shadow-[6px_6px_0_var(--foreground)] -translate-y-1 -translate-x-1' : 'border-border/50 hover:border-foreground/50 shadow-md'} p-6 flex flex-col gap-4 group transition-all duration-200 cursor-grab active:cursor-grabbing`}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <h4 className="font-medium tracking-tight text-base leading-tight group-hover:text-primary transition-colors">{tarea.titulo}</h4>
                                                        {tarea.descripcion && (
                                                            <p className="text-sm text-muted-foreground tracking-tight line-clamp-3 leading-relaxed">
                                                                {tarea.descripcion}
                                                            </p>
                                                        )}
                                                        {tarea.fecha_vencimiento && (
                                                            <div className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground bg-muted/30 w-fit px-2 py-1">
                                                                {new Date(tarea.fecha_vencimiento).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}
