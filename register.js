document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('ctrl-lol-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Submitting...';
            formStatus.innerText = '';
            formStatus.style.color = 'var(--text-muted)';

            // Gather form data
            const formData = new FormData(registerForm);
            const fileInput = registerForm.querySelector('input[name="transaction_screenshot"]');
            const file = fileInput.files[0];

            if (!file) {
                throw new Error("Please upload a transaction screenshot.");
            }

            try {
                // Check if Supabase is initialized
                if (typeof supabase === 'undefined' || !supabase) {
                    throw new Error("Supabase client not initialized. Please check credentials.");
                }

                // 1. Upload Image to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `payment_proofs/${fileName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('payment_proofs')
                    .upload(filePath, file);

                if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('payment_proofs')
                    .getPublicUrl(filePath);

                // Encryption Setup
                const SECRET_KEY = 'STATS_LOCKED_SECRET_KEY_2026'; // Simple client-side key
                const encrypt = (text) => CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

                // 3. Insert Data into Table (Encrypted)
                const data = {
                    event_name: 'CTRL + LOL',
                    full_name: formData.get('full_name'),
                    email: encrypt(formData.get('email')),
                    phone: encrypt(formData.get('phone_number')),
                    college: formData.get('college_name'),
                    course: formData.get('course_branch'),
                    year_of_study: formData.get('year_of_study'),
                    participated_before: formData.get('participated_before') === 'Yes',
                    meme_category: formData.get('meme_category'),
                    social_media: formData.get('social_media'),
                    transaction_id: encrypt(formData.get('transaction_id')),
                    transaction_screenshot_url: publicUrl,
                    consent: formData.get('consent') === 'on'
                };

                console.log("Form Data to Submit (Encrypted):", data);

                const { error: insertError } = await supabase
                    .from('ctrl_loleventreg')
                    .insert([data]);

                if (insertError) throw insertError;

                // Success
                formStatus.innerText = 'Registration Successful! Good luck!';
                formStatus.style.color = 'var(--primary-color)';
                registerForm.reset();
            } catch (error) {
                console.error('Registration Error:', error);
                formStatus.innerText = 'Error: ' + (error.message || 'Something went wrong. Please try again.');
                formStatus.style.color = '#ff0055';
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerText = 'Submit Registration';
            }
        });
    }
});
