export interface PaymentInitializationResponse {
    authorization_url: string
    access_code: string
    reference: string
}

export async function initializePaystackPayment(data: {
    amount: number
    email: string
    reference: string
    callback_url: string
}) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY

    if (!secretKey) {
        console.warn('Paystack Secret Key is not configured. Returning mock payment URL.')
        return {
            authorization_url: `https://checkout.paystack.com/mock-${data.reference}`,
            access_code: 'mock-code',
            reference: data.reference
        }
    }

    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                amount: Math.round(data.amount * 100 * 15), // Assuming GHS conversion if needed or keeping USD cents
                reference: data.reference,
                callback_url: data.callback_url,
            }),
        })

        const result = await response.json()
        if (!result.status) {
            throw new Error(result.message)
        }

        return result.data as PaymentInitializationResponse
    } catch (error: any) {
        console.error('Paystack Initialization Error:', error)
        throw error
    }
}

export async function verifyPaystackPayment(reference: string) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY
    if (!secretKey) return true // Mock mode

    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        })

        const result = await response.json()
        return result.status && result.data.status === 'success'
    } catch (error) {
        console.error('Paystack Verification Error:', error)
        return false
    }
}
