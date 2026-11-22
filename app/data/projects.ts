export interface Project {
  slug: string
  scope: string
  title: string
  tagline: string
  result: string
  stack: string[]
  variant: number
  image: string
}

export const projects: Project[] = [
  { slug: 'fintech', title: 'Fintech platform', tagline: 'Payments and onboarding for a growing lender.', result: 'Onboarding time cut from days to minutes.', stack: ['Nuxt', 'Stripe', 'Postgres'], variant: 1, image: '/images/cases/fintech.jpg' },
  { slug: 'logistics', title: 'Logistics app', tagline: 'Live tracking for field teams.', result: 'Fewer missed deliveries, one source of truth.', stack: ['Vue', 'Firebase', 'Maps'], variant: 5, image: '/images/cases/logistics.jpg' },
  { slug: 'booking', title: 'Booking system', tagline: 'Reservations that fill themselves.', result: 'Online bookings up from the first week.', stack: ['Nuxt', 'Nitro', 'Email'], variant: 2, image: '/images/cases/booking.jpg' },
  { slug: 'b2b', title: 'B2B marketplace', tagline: 'Orders, pricing and inventory in one place.', result: 'Sales team works from a single dashboard.', stack: ['Nuxt', 'Stripe', 'Charts'], variant: 3, image: '/images/cases/b2b.jpg' },
  { slug: 'analytics', title: 'Analytics suite', tagline: 'Dashboards people actually open.', result: 'Reports that used to take hours load instantly.', stack: ['Vue', 'Chart.js', 'API'], variant: 4, image: '/images/cases/analytics.jpg' },
  { slug: 'internal', title: 'Internal tools', tagline: 'Replace spreadsheets with software.', result: 'Manual work removed from daily operations.', stack: ['Nuxt', 'Zod', 'Auth'], variant: 0, image: '/images/cases/internal.jpg' },
]
