import { ReactNode } from 'react';

interface AnalysisCardProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    isLocked?: boolean;
}

export default function AnalysisCard({ title, subtitle, icon, children, isLocked = false }: AnalysisCardProps) {
    return (
        <div className={`analysis-card ${isLocked ? 'relative overflow-hidden' : ''}`}>
            <div className={`space-y-6 ${isLocked ? 'filter blur-xl opacity-20 pointer-events-none select-none' : ''}`}>
                <div className="flex items-center gap-4 mb-6">
                    {icon && (
                        <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h3 className="text-2xl text-foreground font-serif leading-tight">{title}</h3>
                        {subtitle && <p className="text-sm text-gray-500 font-sans tracking-wide">{subtitle}</p>}
                    </div>
                </div>
                <div className="text-readable text-gray-600 leading-relaxed font-sans">
                    {children}
                </div>
            </div>

            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                    {/* Placeholder for Lock indicator if needed internally, otherwise overlay handled by parent */}
                </div>
            )}
        </div>
    );
}
