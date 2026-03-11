import { getTareas } from '@/lib/actions/tareas';
import { KanbanBoard } from '@/components/kanban-board';

export default async function TableroPage() {
    const tareas = await getTareas();

    return (
        <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto h-[calc(100vh-8rem)]">
            <header className="flex flex-col border-b border-border/50 pb-8 shrink-0">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-2">
                    Tablero<span className="text-muted-foreground">.</span>
                </h1>
                <p className="text-base text-muted-foreground tracking-tight">Flujo de trabajo y gestión visual Kanban.</p>
            </header>

            {/* Client Component for Drag & Drop Pipeline */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard initialTareas={tareas} />
            </div>
        </div>
    );
}
