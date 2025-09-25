import type { RequestHandler } from './$types';
import type { Database } from '$lib/database/database.types';

type Owner = Database['pets']['Tables']['owners']['Row'];

export const PUT: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
    const addAppointmentInput = await request.json()

    console.log(addAppointmentInput)

    const { data: owner } = await supabase.from('owners').select('*').single();
    const { user } = await safeGetSession()

    if (!owner) {
        const { error } = await supabase
            .schema('pets')
            .from('owners')
            .insert({
                owner_name: '',
                owner_email: user?.email,
                language: 'en'
            })
            .select('*')
            .single();
        
        const { error: error2 } = await supabase.schema('pets').from('appointments').insert({
            pet_id: '',
            appointment_date: addAppointmentInput.date.year + '-' + addAppointmentInput.date.month + '-' + addAppointmentInput.date.day + ' ' + addAppointmentInput.time,
            appointment_type: addAppointmentInput.type,
            veterinarian: addAppointmentInput.veterinarian,
            clinic_name: addAppointmentInput.clinicName,
            clinic_address: addAppointmentInput.clinicAddress,
            clinic_phone: addAppointmentInput.clinicPhone
        })
    }
    else {
        
    }

    return new Response(JSON.stringify({ success: true }));
};