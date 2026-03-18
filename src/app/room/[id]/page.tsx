import RoomPage from '@/components/RoomPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RoomPage roomId={id} />;
}
