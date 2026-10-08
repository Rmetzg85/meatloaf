'use client'

import { useParams } from 'next/navigation'
import AgentShell from '@/COMPONENTS/agent/AgentShell'
import ListingForm from '@/COMPONENTS/agent/ListingForm'

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  return <AgentShell>{(user) => <ListingForm key={id} user={user} propertyId={id} />}</AgentShell>
}
