import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { SCALE_DESCRIPTIONS, SCALE_LABELS } from '../constants';
import { formatValue } from '../utils';

interface MatrixCellProps {
    value: number;
    onSelect: (value: number) => void;
}

export function MatrixCell({ value, onSelect }: MatrixCellProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="mx-auto h-8 w-16 border-blue-200 px-2 text-xs font-semibold hover:border-blue-400">
                    {formatValue(value)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="center">
                <Command>
                    <CommandInput placeholder="Cari atau ketik nilai..." className="h-8 text-xs" />
                    <CommandEmpty>Nilai tidak ditemukan.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {SCALE_DESCRIPTIONS.map((scale) => (
                                <CommandItem
                                    key={scale.value}
                                    value={scale.label}
                                    onSelect={() => {
                                        onSelect(scale.value);
                                        setOpen(false);
                                    }}
                                    className="text-xs"
                                >
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold">{SCALE_LABELS[scale.value]}</span>
                                        </div>
                                        {value === scale.value && <span className="text-xs font-semibold text-blue-600">✓</span>}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
