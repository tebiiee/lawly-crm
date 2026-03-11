"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SubmitButton } from '@/components/submit-button';
import { updateTarea } from '@/lib/actions/tareas';

type TareaData = {
    id: string;
    titulo: string;
    descripcion: string | null;
    tipo: string | null;
    estado: string | null;
    fecha_vencimiento: string | null;
    caso_id: string | null;
};

type CasoData = {
    id: string;
    numero: string;
    titulo: string;
};

export function EditTareaSheet({ tarea, casos }: { tarea: TareaData, casos: CasoData[] }) {
    const [open, setOpen] = useState(false);

    async function action(formData: FormData) {
        await updateTarea(tarea.id, formData);
        setOpen(false); // Close modal on success
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted text-foreground">
                        <span className="sr-only">Editar</span>
                        {/* Minimalist pencil/edit icon representation */}
                        <span className="font-mono text-sm leading-none">Ed</span>
                    </Button>
                }
            />
            <SheetContent className="sm:max-w-[50vw] border-l border-border/50 p-8 sm:p-16 font-sans overflow-y-auto w-full">
                <SheetHeader className="mb-10 text-left">
                    <SheetTitle className="text-3xl font-bold tracking-tighter">Editar Tarea</SheetTitle>
                    <SheetDescription className="text-base tracking-tight">Actualizar la información de la tarea programada.</SheetDescription>
                </SheetHeader>
                <form action={action} className="flex flex-col gap-10">
                    <div className="space-y-3">
                        <Label htmlFor={`titulo-${tarea.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Título de la Tarea *</Label>
                        <Input id={`titulo-${tarea.id}`} name="titulo" defaultValue={tarea.titulo} required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="Preparar documento..." />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor={`descripcion-${tarea.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Instrucciones</Label>
                        <Textarea id={`descripcion-${tarea.id}`} name="descripcion" defaultValue={tarea.descripcion || ''} rows={4} className="text-base rounded-none border border-border/50 bg-transparent resize-none focus-visible:ring-0 focus-visible:border-foreground mt-2" placeholder="Pasos a seguir..." />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor={`fecha_vencimiento-${tarea.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Vencimiento</Label>
                            <Input id={`fecha_vencimiento-${tarea.id}`} name="fecha_vencimiento" defaultValue={tarea.fecha_vencimiento || ''} type="date" className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor={`estado-${tarea.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Flujo</Label>
                            <Select name="estado" defaultValue={tarea.estado || 'pendiente'}>
                                <SelectTrigger className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus:ring-0">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-border">
                                    <SelectItem value="pendiente" className="text-base rounded-none focus:bg-muted">Pendiente</SelectItem>
                                    <SelectItem value="en-progreso" className="text-base rounded-none focus:bg-muted">En Progreso</SelectItem>
                                    <SelectItem value="completada" className="text-base rounded-none focus:bg-muted">Completada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor={`caso_id-${tarea.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Vincular a Caso</Label>
                        <Select name="caso_id" defaultValue={tarea.caso_id || ''}>
                            <SelectTrigger className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus:ring-0">
                                <SelectValue placeholder="Seleccionar caso" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-border">
                                <SelectItem value="" className="text-base rounded-none focus:bg-muted opacity-50">Tarea Independiente</SelectItem>
                                {casos.map(c => (
                                    <SelectItem key={`edit-t-${tarea.id}-c-${c.id}`} value={c.id} className="text-base rounded-none focus:bg-muted">
                                        <span className="font-mono text-xs mr-2 opacity-50">{c.numero}</span>
                                        {c.titulo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <SubmitButton className="mt-8 rounded-none w-full font-mono tracking-widest uppercase text-sm py-6">Actualizar Tarea</SubmitButton>
                </form>
            </SheetContent>
        </Sheet>
    );
}
