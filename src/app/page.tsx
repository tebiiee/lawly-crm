import { getStats } from '@/lib/actions/stats';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default async function Dashboard() {
  const stats = await getStats();

  return (
    <div className="flex flex-col gap-16 w-full max-w-5xl">
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
          Lawly<span className="text-muted-foreground">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground tracking-tight max-w-lg">
          Gestión minimalista de práctica legal.
        </p>
      </header>

      {/* Avant-Garde Typographic Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50">
        <StatBlock label="Activos" value={stats.casosActivos} highlight />
        <StatBlock label="Casos" value={stats.casos} />
        <StatBlock label="Contactos" value={stats.contactos} />
        <StatBlock label="Tareas" value={stats.tareas} />
      </section>

      {/* Quick Actions - High Contrast */}
      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Acciones Rápidas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ActionCard
            href="/casos"
            title="Gestionar Casos"
            desc="Archivos y estados de casos"
            num="01"
          />
          <ActionCard
            href="/tareas"
            title="Tareas Pendientes"
            desc="Fechas límite y tareas activas"
            num="02"
          />
          <ActionCard
            href="/calendario"
            title="Ver Calendario"
            desc="Agenda y próximas fechas"
            num="03"
          />
        </div>
      </section>
    </div>
  );
}

function StatBlock({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`bg-background p-6 md:p-8 flex flex-col justify-between gap-8 h-48 group hover:bg-muted/30 transition-colors`}>
      <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
      <span className={`text-6xl md:text-7xl font-medium tracking-tighter ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}

function ActionCard({ href, title, desc, num }: { href: string; title: string; desc: string; num: string }) {
  return (
    <Link href={href} className="block group">
      <Card className="h-full border-border/50 bg-transparent rounded-none p-6 flex flex-col gap-12 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-sm font-mono tracking-widest opacity-50">{num}</span>
          <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
            <span className="text-xs">&rarr;</span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-medium tracking-tight mb-1">{title}</h3>
          <p className="text-base opacity-60 tracking-tight">{desc}</p>
        </div>
      </Card>
    </Link>
  );
}
