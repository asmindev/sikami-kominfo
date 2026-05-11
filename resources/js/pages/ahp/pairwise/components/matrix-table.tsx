import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import { SCALE_DESCRIPTIONS, SCALE_LABELS } from '../constants';
import { getTooltipText } from '../helpers';
import { Criteria } from '../types';
import { formatValue, getDomainName, getDomainShort } from '../utils';

const DELAY_TOOLTIP = 500;

interface MatrixTableProps {
    criteria: Criteria[];
    matrix: number[][];
    errors: Record<string, string>;
    onCellChange: (rowIdx: number, colIdx: number, value: number) => void;
}

interface MatrixCellProps {
    value: number;
    onSelect: (value: number) => void;
}

function MatrixCell({ value, onSelect }: MatrixCellProps) {
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

export function MatrixTable({ criteria, matrix, errors, onCellChange }: MatrixTableProps) {
    return (
        <>
            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs sm:text-sm">Terdapat kesalahan pada input Anda. Silakan periksa kembali.</AlertDescription>
                </Alert>
            )}

            <div className="overflow-x-auto rounded-lg border shadow-sm">
                <Table className="bg-background text-sm">
                    <TableHeader>
                        <TableRow className="hover:bg-muted">
                            <TableHead className="w-32 font-bold text-foreground sm:w-48">Domain</TableHead>
                            {criteria.map((col) => (
                                <Tooltip key={`header-${col.id}`} delayDuration={DELAY_TOOLTIP}>
                                    <TooltipTrigger asChild>
                                        <TableHead
                                            className="min-w-20 cursor-help text-center font-semibold text-foreground transition-colors hover:bg-muted"
                                            title={getDomainName(col.code)}
                                        >
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="text-sm font-bold">{getDomainShort(col.code)}</span>
                                                <span className="hidden text-xs text-muted-foreground sm:inline">{col.name}</span>
                                            </div>
                                        </TableHead>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs text-xs">{getDomainName(col.code)}</TooltipContent>
                                </Tooltip>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {criteria.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell className="align-top text-xs font-semibold text-foreground sm:text-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="line-clamp-2">{row.name}</span>
                                        <Badge variant="outline" className="w-fit text-xs">
                                            {getDomainShort(row.code)}
                                        </Badge>
                                    </div>
                                </TableCell>
                                {criteria.map((col, j) => {
                                    // Diagonal cell
                                    if (i === j) {
                                        return (
                                            <Tooltip key={`${i}-${j}`} delayDuration={DELAY_TOOLTIP}>
                                                <TooltipTrigger asChild>
                                                    <TableCell className="cursor-help bg-muted p-1 text-center">
                                                        <span className="text-lg font-bold text-muted-foreground">=</span>
                                                    </TableCell>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-xs">
                                                    {getTooltipText(i, j, row.code, col.code)}
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    }

                                    // Lower triangle (auto-calculated)
                                    if (i > j) {
                                        const val = matrix[i][j];
                                        return (
                                            <Tooltip key={`${i}-${j}`} delayDuration={DELAY_TOOLTIP}>
                                                <TooltipTrigger asChild>
                                                    <TableCell className="cursor-help bg-muted/50 p-1 text-center">
                                                        <div className="flex items-center justify-center gap-0.5">
                                                            <span className="text-xs font-semibold text-muted-foreground">{formatValue(val)}</span>
                                                            <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">Auto</p>
                                                    </TableCell>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs text-xs">
                                                    {getTooltipText(i, j, row.code, col.code)}
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    }

                                    // Upper triangle (editable)
                                    const cellId = `${i}-${j}`;
                                    return (
                                        <Tooltip key={cellId} delayDuration={DELAY_TOOLTIP}>
                                            <TooltipTrigger asChild>
                                                <TableCell className="cursor-help p-1 text-center">
                                                    <MatrixCell value={matrix[i][j]} onSelect={(value) => onCellChange(i, j, value)} />
                                                </TableCell>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs text-xs">{getTooltipText(i, j, row.code, col.code)}</TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
