'use client';

import { useUser } from '@/firebase';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { AuthDialog } from './auth-dialog';
import { SheetClose } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

export function MobileAuthSection() {
    const { user, isLoading: isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const auth = useAuth();

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
    };
    
    const isLoading = isUserLoading || isProfileLoading;

    if (isLoading) {
        return <Skeleton className="h-12 w-full" />;
    }

    if (!user) {
        return (
            <div className="grid gap-4 text-base font-medium">
                <SheetClose asChild>
                    <Link href="/profile" className="flex items-center text-muted-foreground hover:text-foreground">
                        <UserIcon className="mr-2 h-5 w-5" />
                        <span>Профиль</span>
                    </Link>
                </SheetClose>
                <AuthDialog>
                    <div className="flex items-center text-muted-foreground hover:text-foreground cursor-pointer">
                        <LogIn className="mr-2 h-5 w-5" />
                        <span>Войти</span>
                    </div>
                </AuthDialog>
            </div>
        );
    }
    
    return (
        <div className="grid gap-4 text-base font-medium">
             <SheetClose asChild>
                <Link href="/profile" className="flex items-center gap-2 text-foreground">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
                        <AvatarFallback>
                            <UserIcon className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold">{user.displayName || user.email}</span>
                        <span className="text-sm text-muted-foreground">Перейти в профиль</span>
                    </div>
                </Link>
            </SheetClose>

            {userProfile?.isBusinessOwner && (
                 <SheetClose asChild>
                    <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        <span>Панель управления</span>
                    </Link>
                 </SheetClose>
            )}

            <SheetClose asChild>
                 <button onClick={handleLogout} className="flex items-center text-muted-foreground hover:text-foreground text-left w-full">
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Выйти</span>
                </button>
            </SheetClose>
        </div>
    );
}
