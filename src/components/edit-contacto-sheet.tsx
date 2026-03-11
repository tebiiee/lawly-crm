"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SubmitButton } from '@/components/submit-button';
import { updateContacto } from '@/lib/actions/contactos';

type ContactoData = {
    id: string;
    nombre: string;
    email: string | null;
    telefono: string | null;
    direccion: string | null;
};

export function EditContactoSheet({ contacto }: { contacto: ContactoData }) {
    const [open, setOpen] = useState(false);

    async function action(formData: FormData) {
        await updateContacto(contacto.id, formData);
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
                    <SheetTitle className="text-3xl font-bold tracking-tighter">Editar Contacto</SheetTitle>
                    <SheetDescription className="text-base tracking-tight">Actualizar la información de {contacto.nombre} en el directorio.</SheetDescription>
                </SheetHeader>
                <form action={action} className="flex flex-col gap-10">
                    <div className="space-y-3">
                        <Label htmlFor={`nombre-${contacto.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Nombre Completo *</Label>
                        <Input id={`nombre-${contacto.id}`} name="nombre" defaultValue={contacto.nombre} required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="Juan Pérez" />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor={`email-${contacto.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Correo Electrónico</Label>
                        <Input id={`email-${contacto.id}`} name="email" defaultValue={contacto.email || ''} type="email" className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="contacto@ejemplo.com" />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor={`telefono-${contacto.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Número de Teléfono</Label>
                        <Input id={`telefono-${contacto.id}`} name="telefono" defaultValue={contacto.telefono || ''} className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor={`direccion-${contacto.id}`} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Dirección Física</Label>
                        <Textarea id={`direccion-${contacto.id}`} name="direccion" defaultValue={contacto.direccion || ''} rows={4} className="text-base rounded-none border border-border/50 bg-transparent resize-none focus-visible:ring-0 focus-visible:border-foreground mt-2" placeholder="Av. Legal 123..." />
                    </div>

                    <SubmitButton className="mt-8 rounded-none w-full font-mono tracking-widest uppercase text-sm py-6">Actualizar Cambios</SubmitButton>
                </form>
            </SheetContent>
        </Sheet>
    );
}
