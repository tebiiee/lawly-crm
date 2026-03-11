"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SubmitButton } from '@/components/submit-button';
import { updateCaso } from '@/lib/actions/casos';

type CasoData = {
    id: string;
    numero: string;
    titulo: string;
    descripcion: string | null;
    estado: string | null;
    cliente_id: string | null;
};

type ClienteData = {
    id: string;
    nombre: string;
};

export function EditCasoSheet({ caso, clientes }: { caso: CasoData, clientes: ClienteData[] }) {
    const [open, setOpen] = useState(false);

    async function action(formData: FormData) {
        await updateCaso(caso.id, formData);
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
            <SheetContent className="sm:max-w-[50vw] border-l border-border/50 p-8 sm:p-16 font-sans overflow-y-auto">
                <SheetHeader className="mb-10 text-left">
                    <SheetTitle className="text-3xl font-bold tracking-tighter">Editar Caso</SheetTitle>
                    <SheetDescription className="text-base tracking-tight">Actualizar la información del archivo de litigio.</SheetDescription>
                </SheetHeader>
                <form action={action} className="flex flex-col gap-10">
                    <div className="space-y-3">
                        <Label htmlFor={`numero-${caso.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Número de Caso *</Label>
                        <Input id={`numero-${caso.id}`} name="numero" defaultValue={caso.numero} required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="2026-001" />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor={`titulo-${caso.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Título del Caso *</Label>
                        <Input id={`titulo-${caso.id}`} name="titulo" defaultValue={caso.titulo} required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="Descripción del asunto" />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor={`descripcion-${caso.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Notas</Label>
                        <Textarea id={`descripcion-${caso.id}`} name="descripcion" defaultValue={caso.descripcion || ''} rows={5} className="text-base rounded-none border border-border/50 bg-transparent resize-none focus-visible:ring-0 focus-visible:border-foreground mt-2" placeholder="Detalles relevantes..." />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor={`estado-${caso.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Estado</Label>
                            <Select name="estado" defaultValue={caso.estado || 'activo'}>
                                <SelectTrigger className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus:ring-0">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-border">
                                    <SelectItem value="activo" className="text-base rounded-none focus:bg-muted">Activo</SelectItem>
                                    <SelectItem value="cerrado" className="text-base rounded-none focus:bg-muted">Cerrado</SelectItem>
                                    <SelectItem value="archivado" className="text-base rounded-none focus:bg-muted">Archivado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor={`cliente_id-${caso.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Cliente Asignado</Label>
                            <Select name="cliente_id" defaultValue={caso.cliente_id || ''}>
                                <SelectTrigger className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus:ring-0">
                                    <SelectValue placeholder="Asignar cliente" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-border">
                                    <SelectItem value="" className="text-base rounded-none focus:bg-muted opacity-50">Ninguno</SelectItem>
                                    {clientes.map(c => (
                                        <SelectItem key={`edit-${caso.id}-cl-${c.id}`} value={c.id} className="text-base rounded-none focus:bg-muted">{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <SubmitButton className="mt-8 rounded-none w-full font-mono tracking-widest uppercase text-sm py-6">Actualizar Caso</SubmitButton>
                </form>
            </SheetContent>
        </Sheet>
    );
}
