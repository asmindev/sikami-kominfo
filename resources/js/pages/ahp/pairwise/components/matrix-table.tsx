import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Lock } from 'lucide-react';
import { getTooltipText } from '../helpers';
import { Criteria } from '../types';
import { formatValue, getDomainName, getDomainShort } from '../utils';
import { MatrixCell } from './matrix-cell';

interface MatrixTableProps {
    criteria: Criteria[];
    matrix: number[][];
    errors: Record<string, string>;
    onCellChange: (rowIdx: number, colIdx: number, value: number) => void;
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

            <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                <Table className="text-sm">
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="w-32 font-bold text-slate-900 sm:w-48">Domain</TableHead>
                            {criteria.map((col) => (
                                <Tooltip key={`header-${col.id}`}>
                                    <TooltipTrigger asChild>
                                        <TableHead
                                            className="min-w-20 cursor-help text-center font-semibold text-slate-900 transition-colors hover:bg-blue-50"
                                            title={getDomainName(col.code)}
                                        >
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="text-sm font-bold">{getDomainShort(col.code)}</span>
                                                <span className="hidden text-xs text-slate-500 sm:inline">{col.name}</span>
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
                            <TableRow key={row.id} className="hover:bg-slate-50">
                                <TableCell className="bg-slate-50 align-top text-xs font-semibold text-slate-900 sm:text-sm">
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
                                            <Tooltip key={`${i}-${j}`}>
                                                <TooltipTrigger asChild>
                                                    <TableCell className="cursor-help bg-slate-100 p-1 text-center">
                                                        <span className="text-lg font-bold text-slate-500">=</span>
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
                                            <Tooltip key={`${i}-${j}`}>
                                                <TooltipTrigger asChild>
                                                    <TableCell className="cursor-help bg-slate-50 p-1 text-center">
                                                        <div className="flex items-center justify-center gap-0.5">
                                                            <span className="text-xs font-semibold text-slate-500">{formatValue(val)}</span>
                                                            <Lock className="h-2.5 w-2.5 text-slate-400" />
                                                        </div>
                                                        <p className="text-xs text-slate-400">Auto</p>
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
                                        <Tooltip key={cellId}>
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
