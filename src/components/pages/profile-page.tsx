'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Edit } from "lucide-react";

export default function ProfilePageContent() {
  const user = {
    name: 'Алексей Попов',
    email: 'alexey.popov@example.com',
    avatar: 'https://picsum.photos/seed/user-avatar/200/200',
    interests: ['История', 'Архитектура', 'Гастрономия', 'Природа'],
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" className="absolute bottom-1 right-1 rounded-full">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="font-headline text-3xl">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Separator />
            <div className="space-y-4">
                <Label htmlFor="name" className="font-semibold text-lg">Личная информация</Label>
                <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Имя</Label>
                        <Input id="name" defaultValue={user.name} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} className="col-span-3" />
                    </div>
                </div>
            </div>
             <Separator />
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Мои интересы</h3>
                <div className="flex flex-wrap gap-2">
                    {user.interests.map(interest => (
                        <span key={interest} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {interest}
                        </span>
                    ))}
                     <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                        + Добавить интерес
                    </Button>
                </div>
            </div>
             <Separator />
             <div className="flex justify-end">
                <Button>Сохранить изменения</Button>
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
