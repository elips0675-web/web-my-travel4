'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore, useUser } from '..';

export type UserProfile = {
    displayName: string;
    email: string;
    photoURL: string;
    isBusinessOwner: boolean;
};

export function useUserProfile() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setUserProfile(null);
            setIsLoading(false);
            return;
        }

        const docRef = doc(firestore, 'users', user.uid);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setUserProfile(doc.data() as UserProfile);
            } else {
                setUserProfile(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, firestore]);

    return { userProfile, isLoading: isUserLoading || isLoading };
}
