import { createFileRoute } from '@tanstack/solid-router'
import StudyDashboard from '../components/lessons/Dashboard'

export const Route = createFileRoute('/dashboard')({
  component: StudyDashboard,
})
