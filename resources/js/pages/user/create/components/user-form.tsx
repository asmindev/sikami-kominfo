import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Form } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function UserForm({
    method = 'POST',
    action,
    user,
    positions,
    roles,
    onSubmit,
}: {
    method?: string;
    action: string;
    user?: any;
    positions: any[];
    roles: string[];
    onSubmit?: () => void;
}) {
    return (
        <Form method={method} action={action} onSubmit={onSubmit}>
            <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Pengguna</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Masukkan nama pengguna"
                        defaultValue={user?.name}
                        required
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="user@example.com"
                        defaultValue={user?.email}
                        required
                    />
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">
                        Kata Sandi {user && <span className="text-sm text-muted-foreground">(kosongkan jika tidak ingin mengubah)</span>}
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder={user ? 'Biarkan kosong untuk tidak mengubah' : 'Masukkan kata sandi'}
                        required={!user}
                    />
                </div>

                {/* NIP */}
                <div className="space-y-2">
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                        id="nip"
                        name="nip"
                        placeholder="Masukkan NIP (opsional)"
                        defaultValue={user?.nip}
                    />
                </div>

                {/* Position */}
                <div className="space-y-2">
                    <Label htmlFor="position_id">Jabatan</Label>
                    <select
                        id="position_id"
                        name="position_id"
                        defaultValue={user?.position_id || ''}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">-- Pilih Jabatan --</option>
                        {positions.map((position: any) => (
                            <option key={position.id} value={position.id}>
                                {position.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                        id="role"
                        name="role"
                        defaultValue={user?.roles?.[0]?.name || ''}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">-- Pilih Role --</option>
                        {roles.map((role: string) => (
                            <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Button type="submit">
                        {user ? 'Perbarui Pengguna' : 'Tambah Pengguna'}
                    </Button>
                </div>
            </div>
        </Form>
    );
}
