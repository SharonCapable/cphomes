import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { verifyPaystackPayment } from '@/lib/payment'
import { revalidatePath } from 'next/cache'

export default async function VerifyPaymentPage({
    searchParams,
}: {
    searchParams: { bookingId?: string; reference?: string; status?: string }
}) {
    const { bookingId, reference, status } = searchParams

    if (!bookingId) {
        redirect('/properties')
    }

    // Handle mock success
    if (status === 'success' && !reference) {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' }
        })
        revalidatePath('/profile')
        redirect('/profile?payment=success')
    }

    if (reference) {
        const isValid = await verifyPaystackPayment(reference)
        if (isValid) {
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'CONFIRMED' }
            })
            revalidatePath('/profile')
            redirect('/profile?payment=success')
        } else {
            redirect('/profile?payment=failed')
        }
    }

    // Default redirect if something is missing
    redirect('/profile')
}
