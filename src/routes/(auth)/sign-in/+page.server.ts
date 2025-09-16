import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
    signin: async ({ request, locals: { supabase }, cookies }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string

        const { error } = await supabase.auth.signInWithOtp({
            email: email, options: {
                shouldCreateUser: true
            },
        })

        if (error) {
            console.error(error)
            redirect(303, '/error')
        } else {
            cookies.set('email', email, {
                sameSite: true,
                secure: true,
                httpOnly: true,
                path: '/',
                maxAge: 3600000
            })
            redirect(303, '/welcome')
        }
    },
}