import { Card, CardContent } from '@/components/ui/card';
import { SCALE_DESCRIPTIONS } from '../constants';

export function ScaleLegend() {
    return (
        <Card>
            <CardContent className="pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-700 sm:text-sm">Legenda Skala Saaty:</p>
                <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
                    {SCALE_DESCRIPTIONS.map((scale) => (
                        <div key={scale.value} className="flex flex-col items-center gap-0.5">
                            <div
                                className={`${scale.color} flex h-7 w-full items-center justify-center rounded text-center text-xs font-bold text-white sm:h-8`}
                                title={scale.description}
                            >
                                {scale.label}
                            </div>
                            <p className="line-clamp-1 text-center text-xs text-slate-600">{scale.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
