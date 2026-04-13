'use client';

import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { userProfile, isLoading } = useUserProfile();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!userProfile?.isBusinessOwner) {
        router.push('/');
        return null;
    }

    // Mock businesses for now
    const businesses = [
        { id: '1', name: 'Тур по замкам', category: 'tours' },
        { id: '2', name: 'Уютный отель "Лес"', category: 'housing' },
    ];

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
                    {businesses.length > 0 ? (
                        <div className="space-y-4">
                            {businesses.map((business) => (
                                <div key={business.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="font-semibold">{business.name}</p>
                                        <p className="text-sm text-muted-foreground">{business.category}</p>
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
