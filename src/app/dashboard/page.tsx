'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import { useUserProfile } from '@/firebase/auth/use-user-profile';

type Business = {
    id: string;
    name: string;
    category: string;
};

const categoryLabels: Record<string, string> = {
    tours: 'Туры',
    housing: 'Жилье',
    restaurants: 'Кафе и рестораны',
    activities: 'Развлечения',
    'rental-car': 'Транспорт'
};

export default function DashboardPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const { userProfile, isLoading: isProfileLoading } = useUserProfile();
    const router = useRouter();
    const firestore = useFirestore();

    const businessesQuery = useMemo(() => {
        if (!user?.uid) return null;
        return query(collection(firestore, "businesses"), where("ownerId", "==", user.uid));
    }, [firestore, user?.uid]);

    const { data: businesses, isLoading: isBusinessesLoading } = useCollection<Business>(businessesQuery);
    
    const isLoading = isUserLoading || isProfileLoading || isBusinessesLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!isUserLoading && !user) {
         router.push('/');
         return null;
    }

    if (!isProfileLoading && !userProfile?.isBusinessOwner) {
        router.push('/');
        return null;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-headline">Панель управления</h1>
                <Button asChild>
                    <Link href="/dashboard/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить бизнес
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Мои бизнесы</CardTitle>
                    <CardDescription>
                        Здесь отображаются ваши компании и предложения.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {businesses && businesses.length > 0 ? (
                        <div className="space-y-4">
                            {businesses.map((business) => (
                                <div key={business.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-semibold">{business.name}</p>
                                        <p className="text-sm text-muted-foreground">{categoryLabels[business.category] || business.category}</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Управлять
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">У вас пока нет бизнесов</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Нажмите "Добавить бизнес", чтобы создать свое первое предложение.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
