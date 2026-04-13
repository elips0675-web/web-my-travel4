'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, type DocumentData, type Query, type QuerySnapshot } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T extends {id: string}>(q: Query<DocumentData> | null) {
    const [data, setData] = useState<T[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (q === null) {
            setData(null);
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);

        const unsubscribe = onSnapshot(q, 
            (querySnapshot: QuerySnapshot<DocumentData>) => {
                const data: T[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as T));
                setData(data);
                setIsLoading(false);
                setError(null);
            }, 
            async (err) => {
                console.error(err);
                setError(err);
                setIsLoading(false);
                
                if (err.code === 'permission-denied' && (q as any)._query) {
                     const permissionError = new FirestorePermissionError({
                        path: (q as any)._query.path.segments.join('/'),
                        operation: 'list',
                    });
                    errorEmitter.emit('permission-error', permissionError);
                }
            }
        );

        return () => unsubscribe();
    }, [q]);

    return { data, isLoading, error };
}
