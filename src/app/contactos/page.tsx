import { getContactos, createContacto, deleteContacto } from '@/lib/actions/contactos';
import { EditContactoSheet } from '@/components/edit-contacto-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SubmitButton } from '@/components/submit-button';

export default async function ContactosPage() {
    const contactos = await getContactos();

    return (
        <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border/50 pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                        Contactos<span className="text-muted-foreground">.</span>
                    </h1>
                    <p className="text-base text-muted-foreground tracking-tight">Directorio de clientes e índice de red.</p>
                </div>

                <Sheet>
                    <SheetTrigger render={<Button className="rounded-none px-6 font-mono tracking-widest uppercase text-sm" />}>
                        Añadir Contacto
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[50vw] border-l border-border/50 p-8 sm:p-16 font-sans overflow-y-auto">
                        <SheetHeader className="mb-10 text-left">
                            <SheetTitle className="text-3xl font-bold tracking-tighter">Nueva Entrada</SheetTitle>
                            <SheetDescription className="text-base tracking-tight">Registrar un nuevo contacto en el directorio.</SheetDescription>
                        </SheetHeader>
                        <form action={async (formData) => {
                            'use server';
                            await createContacto(formData);
                        }} className="flex flex-col gap-10">
                            <div className="space-y-3">
                                <Label htmlFor="nombre" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Nombre Completo *</Label>
                                <Input id="nombre" name="nombre" required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="Juan Pérez" />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="contacto@ejemplo.com" />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="telefono" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Número de Teléfono</Label>
                                <Input id="telefono" name="telefono" className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="+1 (555) 000-0000" />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="direccion" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Dirección Física</Label>
                                <Textarea id="direccion" name="direccion" rows={4} className="text-base rounded-none border border-border/50 bg-transparent resize-none focus-visible:ring-0 focus-visible:border-foreground mt-2" placeholder="Av. Legal 123..." />
                            </div>

                            <SubmitButton className="mt-8 rounded-none w-full font-mono tracking-widest uppercase text-sm py-6">Guardar Contacto</SubmitButton>
                        </form>
                    </SheetContent>
                </Sheet>
            </header>

            {contactos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border/50">
                    <span className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Directorio Vacío</span>
                </div>
            ) : (
                <div className="flex flex-col border border-border/50 bg-background/50 divide-y divide-border/50">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-5 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <div className="col-span-4">Identidad</div>
                        <div className="col-span-4">Contacto</div>
                        <div className="col-span-3">Ubicación</div>
                        <div className="col-span-1 text-right">Acc</div>
                    </div>

                    {/* Data Rows */}
                    {contactos.map(contacto => (
                        <div key={contacto.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-muted/30 transition-colors group">
                            <div className="col-span-4 text-base font-medium tracking-tight truncate pr-4">{contacto.nombre}</div>
                            <div className="col-span-4 flex flex-col justify-center">
                                {contacto.email && <div className="text-base tracking-tight truncate pr-4">{contacto.email}</div>}
                                {contacto.telefono && <div className="text-sm text-muted-foreground font-mono tracking-tight mt-1">{contacto.telefono}</div>}
                                {!contacto.email && !contacto.telefono && <span className="opacity-40 italic text-base">Sin información</span>}
                            </div>
                            <div className="col-span-3 text-base text-muted-foreground tracking-tight truncate pr-4">
                                {contacto.direccion || <span className="opacity-40 italic">Desconocida</span>}
                            </div>
                            <div className="col-span-1 flex justify-end gap-1">
                                <EditContactoSheet contacto={contacto} />
                                <form action={async () => {
                                    'use server';
                                    await deleteContacto(contacto.id);
                                }}>
                                    <Button variant="ghost" size="icon" type="submit" className="h-10 w-10 rounded-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
                                        <span className="sr-only">Eliminar</span>
                                        <span className="text-2xl leading-none">&times;</span>
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
