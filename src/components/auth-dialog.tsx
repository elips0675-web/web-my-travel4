'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Неверный формат email.' }),
  password: z.string().min(6, { message: 'Пароль должен быть не менее 6 символов.' }),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Неверный формат email.' }),
  password: z.string().min(6, { message: 'Пароль должен быть не менее 6 символов.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают.',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { toast } = useToast();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'Вход выполнен успешно!' });
      onLoginSuccess();
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Ошибка входа',
        description: 'Неверный email или пароль.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Пароль</Label>
        <Input id="login-password" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Войти
      </Button>
    </form>
  );
}

function RegisterForm({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
    const { toast } = useToast();
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            toast({ title: 'Регистрация прошла успешно!' });
            onRegisterSuccess();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.code === 'auth/email-already-in-use'
                ? 'Этот email уже зарегистрирован.'
                : 'Произошла ошибка при регистрации.';
            toast({
                title: 'Ошибка регистрации',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input id="register-password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Подтвердите пароль</Label>
                <Input id="register-confirm-password" type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Зарегистрироваться
            </Button>
        </form>
    );
}


export function AuthDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="login" className="w-full">
          <DialogHeader className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
          </DialogHeader>
          <TabsContent value="login">
            <DialogTitle className="text-center mb-1">С возвращением!</DialogTitle>
            <DialogDescription className="text-center mb-4">
              Войдите в свой аккаунт, чтобы продолжить.
            </DialogDescription>
            <LoginForm onLoginSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="register">
             <DialogTitle className="text-center mb-1">Создать аккаунт</DialogTitle>
            <DialogDescription className="text-center mb-4">
              Присоединяйтесь, чтобы планировать путешествия.
            </DialogDescription>
            <RegisterForm onRegisterSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
