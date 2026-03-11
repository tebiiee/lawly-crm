import { getCasos, createCaso, deleteCaso } from '@/lib/actions/casos';
import { getContactos } from '@/lib/actions/contactos';
import { EditCasoSheet } from '@/components/edit-caso-sheet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SubmitButton } from '@/components/submit-button';

export default async function CasosPage() {
    const casos = await getCasos();
    const clientes = await getContactos();

    return (
        <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border/50 pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                        Casos<span className="text-muted-foreground">.</span>
                    </h1>
                    <p className="text-base text-muted-foreground tracking-tight">Registro de casos activos y archivos de litigio.</p>
                </div>

                <Sheet>
                    <SheetTrigger render={<Button className="rounded-none px-6 font-mono tracking-widest uppercase text-sm" />}>
                        Abrir Nuevo Caso
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[50vw] border-l border-border/50 p-8 sm:p-16 font-sans overflow-y-auto">
                        <SheetHeader className="mb-10 text-left">
                            <SheetTitle className="text-3xl font-bold tracking-tighter">Ingreso de Caso</SheetTitle>
                            <SheetDescription className="text-base tracking-tight">Registrar un nuevo archivo de caso en el sistema.</SheetDescription>
                        </SheetHeader>
                        <form action={async (formData) => {
                            'use server';
                            await createCaso(formData);
                        }} className="flex flex-col gap-10">
                            <div className="space-y-3">
                                <Label htmlFor="numero" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Número de Caso *</Label>
                                <Input id="numero" name="numero" required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="2026-001" />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="titulo" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Título del Caso *</Label>
                                <Input id="titulo" name="titulo" required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="Descripción del asunto" />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="descripcion" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Notas</Label>
                                <Textarea id="descripcion" name="descripcion" rows={5} className="text-base rounded-none border border-border/50 bg-transparent resize-none focus-visible:ring-0 focus-visible:border-foreground mt-2" placeholder="Detalles relevantes..." />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="estado" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Estado</Label>
                                    <Select name="estado" defaultValue="activo">
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
                                    <Label htmlFor="cliente_id" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Cliente Asignado</Label>
                                    <Select name="cliente_id">
                                        <SelectTrigger className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus:ring-0">
                                            <SelectValue placeholder="Asignar cliente" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-border">
                                            <SelectItem value="" className="text-base rounded-none focus:bg-muted opacity-50">Ninguno</SelectItem>
                                            {clientes.map(c => (
                                                <SelectItem key={c.id} value={c.id} className="text-base rounded-none focus:bg-muted">{c.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <SubmitButton className="mt-8 rounded-none w-full font-mono tracking-widest uppercase text-sm py-6">Inicializar Caso</SubmitButton>
                        </form>
                    </SheetContent>
                </Sheet>
            </header>

            {casos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border/50">
                    <span className="text-muted-foreground font-mono text-sm uppercase tracking-widest">No hay casos activos</span>
                </div>
            ) : (
                <div className="flex flex-col border border-border/50 bg-background/50 divide-y divide-border/50">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-5 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <div className="col-span-2">Número</div>
                        <div className="col-span-4">Asunto</div>
                        <div className="col-span-3">Cliente</div>
                        <div className="col-span-2">Estado</div>
                        <div className="col-span-1 text-right">Acc</div>
                    </div>

                    {/* Data Rows */}
                    {casos.map(caso => (
                        <div key={caso.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-muted/30 transition-colors group">
                            <div className="col-span-2 font-mono text-base tracking-tight">{caso.numero}</div>
                            <div className="col-span-4">
                                <div className="text-base font-medium tracking-tight truncate pr-4">{caso.titulo}</div>
                                {caso.descripcion && <div className="text-sm text-muted-foreground truncate pr-4 mt-1">{caso.descripcion}</div>}
                            </div>
                            <div className="col-span-3 text-base tracking-tight opacity-80">
                                {caso.cliente_nombre || <span className="opacity-40 italic">Sin asignar</span>}
                            </div>
                            <div className="col-span-2">
                                <Badge variant={caso.estado === 'activo' ? 'default' : 'secondary'} className="rounded-none font-mono text-xs uppercase tracking-widest">
                                    {caso.estado}
                                </Badge>
                            </div>
                            <div className="col-span-1 flex justify-end gap-1">
                                <EditCasoSheet caso={{
                                    id: caso.id,
                                    numero: caso.numero,
                                    titulo: caso.titulo,
                                    descripcion: caso.descripcion,
                                    estado: caso.estado,
                                    cliente_id: caso.cliente_id
                                }} clientes={clientes} />
                                <form action={async () => {
                                    'use server';
                                    await deleteCaso(caso.id);
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
