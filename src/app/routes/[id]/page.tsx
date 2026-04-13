import { findRouteById } from '@/lib/data';
import { notFound } from 'next/navigation';
import RouteDetailsPageContent from '@/components/pages/route-details-page';

export default function RouteDetailsPage({ params }: { params: { id: string } }) {
    const route = findRouteById(params.id);

    if (!route) {
        notFound();
    }

    return <RouteDetailsPageContent route={route} />;
}
