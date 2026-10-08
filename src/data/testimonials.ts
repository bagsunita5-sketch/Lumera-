import type { Testimonial } from '@/components/ui/circular-testimonials'

const image = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=85`

// Illustrative demo copy: replace with verified customer reviews before launch.
export const lumeraTestimonials: Testimonial[] = [
  {
    quote: 'Our dining table has become the natural meeting place, from slow breakfasts to dinners that stretch long into the evening.',
    name: 'A LUMÉRA customer',
    designation: 'Dining collection',
    src: image('photo-1758977403826-01e2c8a3f68f'),
    alt: 'Solid wood dining table set for a relaxed meal in a warm, light-filled room',
  },
  {
    quote: 'My study feels calmer now. The desk is beautifully made, and the room still feels like a room rather than an office.',
    name: 'A LUMÉRA customer',
    designation: 'Workspace collection',
    src: image('photo-1683582448281-fb82b0fd803b'),
    alt: 'Oak computer desk in a quiet home workspace',
  },
  {
    quote: 'We move the chair from the desk to the table all the time. It is comfortable enough to live with and lovely to look at.',
    name: 'A LUMÉRA customer',
    designation: 'Seating collection',
    src: image('photo-1598300056393-4aac492f4344'),
    alt: 'Sculptural upholstered chair with warm wood legs',
  },
]
