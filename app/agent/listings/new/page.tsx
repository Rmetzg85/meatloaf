'use client'

import AgentShell from '@/COMPONENTS/agent/AgentShell'
import ListingForm from '@/COMPONENTS/agent/ListingForm'

export default function NewListingPage() {
  return <AgentShell>{(user) => <ListingForm user={user} />}</AgentShell>
}
