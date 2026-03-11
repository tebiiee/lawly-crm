"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Pin, PinOff } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Sidebar() {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Load pin state from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem('sidebar-pinned');
        if (stored === 'true') {
            setIsPinned(true);
        }
    }, []);

    const togglePin = () => {
        const newValue = !isPinned;
        setIsPinned(newValue);
        localStorage.setItem('sidebar-pinned', String(newValue));
    };

    const isExpanded = isPinned || isHovered;

    return (
        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "transition-all duration-300 ease-in-out border-r border-border/50 bg-background flex flex-col justify-between py-8 group overflow-hidden sticky top-0 h-screen z-50",
                isExpanded ? "w-64" : "w-16"
            )}
        >
            <div className="flex flex-col gap-12 px-4">
                {/* Logo Mark & Pin */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-foreground shrink-0" />
                        <span className={cn("font-medium tracking-tight whitespace-nowrap transition-opacity duration-200", isExpanded ? "opacity-100" : "opacity-0 invisible")}>
                            Lawly
                        </span>
                    </div>

                    <button
                        onClick={togglePin}
                        className={cn(
                            "text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none",
                            isExpanded ? "opacity-100" : "opacity-0 invisible pointer-events-none",
                            isPinned && "text-foreground"
                        )}
                        title={isPinned ? "Desfijar menú" : "Fijar menú"}
                    >
                        {isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-4">
                    <NavItem href="/" icon="01" label="Panel" isExpanded={isExpanded} />
                    <NavItem href="/contactos" icon="02" label="Contactos" isExpanded={isExpanded} />
                    <NavItem href="/casos" icon="03" label="Casos" isExpanded={isExpanded} />
                    <NavItem href="/tareas" icon="04" label="Tareas" isExpanded={isExpanded} />
                    <NavItem href="/tablero" icon="05" label="Tablero" isExpanded={isExpanded} />
                    <NavItem href="/calendario" icon="06" label="Calendario" isExpanded={isExpanded} />
                </nav>
            </div>

            <div className="px-6 pb-4 flex flex-col gap-6">
                <div className={cn("transition-opacity", isExpanded ? "opacity-100" : "opacity-0 invisible")}>
                    <ThemeToggle />
                </div>
                <div className="w-full h-[1px] bg-border/50" />
                <div className={cn("text-xs text-muted-foreground uppercase tracking-widest transition-opacity whitespace-nowrap font-mono", isExpanded ? "opacity-100" : "opacity-0 invisible")}>
                    Sistema Activo
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, isExpanded }: { href: string; icon: string; label: string, isExpanded: boolean }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-start gap-6 px-2 py-2 text-muted-foreground hover:text-foreground transition-colors group/nav"
        >
            <span className="text-sm font-mono tracking-tighter shrink-0 w-4 text-center">{icon}</span>
            <span className={cn(
                "text-base font-medium tracking-tight whitespace-nowrap transition-opacity duration-200 group-hover/nav:translate-x-1",
                isExpanded ? "opacity-100" : "opacity-0 invisible"
            )}>
                {label}
            </span>
        </Link>
    );
}
