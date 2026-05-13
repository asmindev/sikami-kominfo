import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[url('https://web.komdigi.go.id/resource/dXBsb2Fkcy8yMDI1LzcvMjkvNGZjZDA2YWEtMWZhMy00MThkLThjNzktOWQ3MjE0YTMwODM0LmpwZWc=')] bg-cover bg-fixed bg-center p-4">
            <Head title="Masuk" />

            {/* Overlay backdrop */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
                {/* Logo & Institusi */}
                <div className="space-y-4 text-center">
                    <img src="/logo.png" alt="Logo Kominfo Sultra" className="mx-auto h-20 w-auto" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">SIKAMI-AHP</h1>
                        <p className="text-lg text-white/90">Kominfo Sultra</p>
                        <p className="mt-2 text-sm text-white/80">
                            Sistem Penilaian Keamanan Informasi
                            <br />
                            Menggunakan Metode AHP &amp; Indeks KAMI 5.0
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight text-white">Masuk</h2>
                        <p className="text-sm text-white/80">Masukkan email dan kata sandi untuk masuk ke akun Anda</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contoh@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                                className="border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/50"
                            />
                            {errors.email && <p className="text-sm font-medium text-red-300">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">
                                Kata Sandi
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className="border-white/30 bg-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/50"
                            />
                            {errors.password && <p className="text-sm font-medium text-red-300">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" checked={data.remember} onCheckedChange={(checked) => setData('remember', checked as boolean)} />
                            <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-white/90">
                                Ingat saya
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Memproses...' : 'Masuk'}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-white/70">© 2026 Kominfo Sultra. Semua hak dilindungi.</p>
            </div>
        </div>
    );
}
