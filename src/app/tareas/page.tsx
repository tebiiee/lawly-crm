import { getTareas, createTarea, deleteTarea } from '@/lib/actions/tareas';
import { getCasos } from '@/lib/actions/casos';
import { EditTareaSheet } from '@/components/edit-tarea-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SubmitButton } from '@/components/submit-button';

export default async function TareasPage() {
    const tareas = await getTareas();
    const casos = await getCasos();

    return (
        <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-border/50 pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                        Tareas<span className="text-muted-foreground">.</span>
                    </h1>
                    <p className="text-base text-muted-foreground tracking-tight">Operaciones pendientes y fechas límite.</p>
                </div>

                <Sheet>
                    <SheetTrigger render={<Button className="rounded-none px-6 font-mono tracking-widest uppercase text-sm" />}>
                        Encolar Tarea
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[50vw] border-l border-border/50 p-8 sm:p-16 font-sans overflow-y-auto">
                        <SheetHeader className="mb-10 text-left">
                            <SheetTitle className="text-3xl font-bold tracking-tighter">Definición de Tarea</SheetTitle>
                            <SheetDescription className="text-base tracking-tight">Añadir una nueva tarea para seguimiento.</SheetDescription>
                        </SheetHeader>
                        <form action={async (formData) => {
                            'use server';
                            await createTarea(formData);
                        }} className="flex flex-col gap-10">
                            <div className="space-y-3">
                                <Label htmlFor="titulo" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Título *</Label>
                                <Input id="titulo" name="titulo" required className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" placeholder="Redactar documento..." />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="descripcion" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Notas</Label>
                                <Textarea id="descripcion" name="descripcion" rows={4} className="text-base rounded-none border border-border/50 bg-transparent resize-none focus-visible:ring-0 focus-visible:border-foreground mt-2" placeholder="Instrucciones específicas..." />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="fecha_vencimiento" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Fecha Límite</Label>
                                <Input id="fecha_vencimiento" name="fecha_vencimiento" type="date" className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="estado" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Estado</Label>
                                    <Select name="estado" defaultValue="pendiente">
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

                                <div className="space-y-3">
                                    <Label htmlFor="caso_id" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Vincular a Caso</Label>
                                    <Select name="caso_id">
                                        <SelectTrigger className="text-base rounded-none border-x-0 border-t-0 border-b border-border/50 bg-transparent px-0 focus:ring-0">
                                            <SelectValue placeholder="Asignar caso" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-border">
                                            <SelectItem value="" className="text-base rounded-none focus:bg-muted opacity-50">Ninguno</SelectItem>
                                            {casos.map(c => (
                                                <SelectItem key={c.id} value={c.id} className="text-base rounded-none focus:bg-muted">{c.numero} - {c.titulo}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <SubmitButton className="mt-8 rounded-none w-full font-mono tracking-widest uppercase text-sm py-6">Encolar Tarea</SubmitButton>
                        </form>
                    </SheetContent>
                </Sheet>
            </header>

            {tareas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border/50">
                    <span className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Cola Vacía</span>
                </div>
            ) : (
                <div className="flex flex-col border border-border/50 bg-background/50 divide-y divide-border/50">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-5 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <div className="col-span-5">Directriz</div>
                        <div className="col-span-2">Fecha Límite</div>
                        <div className="col-span-2">Vínculo</div>
                        <div className="col-span-2">Estado</div>
                        <div className="col-span-1 text-right">Acc</div>
                    </div>

                    {/* Data Rows */}
                    {tareas.map(tarea => (
                        <div key={tarea.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-muted/30 transition-colors group">
                            <div className="col-span-5">
                                <div className="text-base font-medium tracking-tight truncate pr-4">{tarea.titulo}</div>
                                {tarea.descripcion && <div className="text-sm text-muted-foreground truncate pr-4 mt-1">{tarea.descripcion}</div>}
                            </div>
                            <div className="col-span-2 font-mono text-base tracking-tight opacity-80">
                                {tarea.fecha_vencimiento ? new Date(tarea.fecha_vencimiento).toLocaleDateString() : <span className="opacity-40 italic">--</span>}
                            </div>
                            <div className="col-span-2 font-mono text-base tracking-tight opacity-80">
                                {tarea.caso_numero || <span className="opacity-40 italic">Ninguno</span>}
                            </div>
                            <div className="col-span-2">
                                <Badge variant={tarea.estado === 'completada' ? 'secondary' : tarea.estado === 'en-progreso' ? 'default' : 'outline'} className="rounded-none font-mono text-xs uppercase tracking-widest bg-transparent border-foreground/30 text-foreground">
                                    {tarea.estado ? tarea.estado.replace('-', ' ') : 'N/D'}
                                </Badge>
                            </div>
                            <div className="col-span-1 flex justify-end gap-1">
                                <EditTareaSheet tarea={{
                                    id: tarea.id,
                                    titulo: tarea.titulo,
                                    descripcion: tarea.descripcion,
                                    tipo: tarea.tipo,
                                    estado: tarea.estado,
                                    fecha_vencimiento: tarea.fecha_vencimiento,
                                    caso_id: tarea.caso_id
                                }} casos={casos} />
                                <form action={async () => {
                                    'use server';
                                    await deleteTarea(tarea.id);
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
